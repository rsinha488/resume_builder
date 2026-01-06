import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coverLetters = await prisma.coverLetter.findMany({
            where: { userId: user.userId },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(coverLetters);
    } catch (error) {
        console.error('Error fetching cover letters:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, data } = await request.json();

        const coverLetter = await prisma.coverLetter.create({
            data: {
                title: title || 'Untitled Cover Letter',
                templateId: data?.templateId || 'modern',
                userId: user.userId,
                data: data || {},
            },
        });

        return NextResponse.json(coverLetter);
    } catch (error) {
        console.error('Error creating cover letter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
