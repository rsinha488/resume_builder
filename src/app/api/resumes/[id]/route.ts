import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const resume = await prisma.resume.findUnique({
            where: { id },
        });

        if (!resume || resume.userId !== user.userId) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
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
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { title, data } = await request.json();

        // Verify ownership
        const existingResume = await prisma.resume.findUnique({
            where: { id },
        });

        if (!existingResume || existingResume.userId !== user.userId) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const updatedResume = await prisma.resume.update({
            where: { id },
            data: {
                title,
                templateId: data.templateId || 'modern',
                data,
            },
        });

        return NextResponse.json(updatedResume);
    } catch (error) {
        console.error('Error updating resume:', error);
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
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existingResume = await prisma.resume.findUnique({
            where: { id },
        });

        if (!existingResume || existingResume.userId !== user.userId) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        await prisma.resume.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Resume deleted' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
