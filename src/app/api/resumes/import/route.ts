import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseResumeText } from '@/lib/parser';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';

        if (file.type === 'application/pdf') {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const pdfParse = require('pdf-parse/node');
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.name.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
        }

        const parsedData = parseResumeText(text);
        const title = parsedData.personalInfo?.fullName || 'Imported Resume';
        const resumeData = {
            ...parsedData,
            themeColor: '#2563eb',
            fontFamily: 'Inter, sans-serif',
            templateId: 'modern'
        };

        const resume = await prisma.resume.create({
            data: {
                title,
                templateId: 'modern',
                userId: user.userId,
                data: resumeData as object,
            },
        });

        return NextResponse.json({ id: resume.id, title: resume.title, data: resumeData });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Internal server error during import' }, { status: 500 });
    }
}
