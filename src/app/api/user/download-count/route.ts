import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const FREE_DOWNLOAD_LIMIT = 5;

// GET — returns current download count and whether the user can still download
export async function GET(req: NextRequest) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await (prisma.user.findUnique as any)({
            where: { id: user.userId },
            select: { plan: true, pdfDownloadCount: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPro = dbUser.plan === 'PRO';
        const count: number = dbUser.pdfDownloadCount ?? 0;

        return NextResponse.json({
            plan: dbUser.plan,
            isPro,
            pdfDownloadCount: count,
            limit: FREE_DOWNLOAD_LIMIT,
            remaining: isPro ? null : Math.max(0, FREE_DOWNLOAD_LIMIT - count),
            canDownload: isPro || count < FREE_DOWNLOAD_LIMIT,
        });
    } catch (error) {
        console.error('Download count fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — gate and increment download count
export async function POST(req: NextRequest) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await (prisma.user.findUnique as any)({
            where: { id: user.userId },
            select: { plan: true, pdfDownloadCount: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // PRO users: always allow, no tracking needed
        if (dbUser.plan === 'PRO') {
            return NextResponse.json({ success: true, canDownload: true, isPro: true });
        }

        const currentCount: number = dbUser.pdfDownloadCount ?? 0;

        if (currentCount >= FREE_DOWNLOAD_LIMIT) {
            return NextResponse.json({
                error: `You've used all ${FREE_DOWNLOAD_LIMIT} free PDF downloads. Upgrade to PRO for unlimited downloads.`,
                canDownload: false,
                pdfDownloadCount: currentCount,
                limit: FREE_DOWNLOAD_LIMIT,
                remaining: 0,
            }, { status: 403 });
        }

        const updated = await (prisma.user.update as any)({
            where: { id: user.userId },
            data: { pdfDownloadCount: (currentCount || 0) + 1 },
            select: { pdfDownloadCount: true },
        });

        const newCount: number = updated.pdfDownloadCount ?? (currentCount || 0) + 1;

        return NextResponse.json({
            success: true,
            canDownload: true,
            pdfDownloadCount: newCount,
            limit: FREE_DOWNLOAD_LIMIT,
            remaining: FREE_DOWNLOAD_LIMIT - newCount,
        });
    } catch (error) {
        console.error('Download count increment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
