import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coverLetter = await prisma.coverLetter.findUnique({
            where: {
                id: params.id,
                userId: user.userId,
            },
        });

        if (!coverLetter) {
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
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, data } = await request.json();

        const coverLetter = await prisma.coverLetter.update({
            where: {
                id: params.id,
                userId: user.userId,
            },
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
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.coverLetter.delete({
            where: {
                id: params.id,
                userId: user.userId,
            },
        });

        return NextResponse.json({ message: 'Cover letter deleted successfully' });
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
