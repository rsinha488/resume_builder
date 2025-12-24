import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resumes = await prisma.resume.findMany({
            where: { userId: user.userId },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
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

        const resume = await prisma.resume.create({
            data: {
                title: title || 'Untitled Resume',
                templateId: data?.templateId || 'modern',
                userId: user.userId,
                data: data || {},
            },
        });

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error creating resume:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
