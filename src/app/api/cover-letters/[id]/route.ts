import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const coverLetter = await prisma.coverLetter.findUnique({ where: { id } });

        if (!coverLetter || coverLetter.userId !== user.userId) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
        }

        return NextResponse.json({ data: coverLetter.data });
    } catch (error) {
        console.error('Error fetching cover letter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { title, data } = await request.json();

        const existing = await prisma.coverLetter.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.userId) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
        }

        const coverLetter = await prisma.coverLetter.update({
            where: { id },
            data: {
                title: title || 'Untitled Cover Letter',
                templateId: data?.templateId || 'modern',
                data: data || {},
            },
        });

        return NextResponse.json(coverLetter);
    } catch (error) {
        console.error('Error updating cover letter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.coverLetter.findUnique({ where: { id } });
        if (!existing || existing.userId !== user.userId) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
        }

        await prisma.coverLetter.delete({ where: { id } });

        return NextResponse.json({ message: 'Cover letter deleted successfully' });
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
