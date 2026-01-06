import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { parseResumeText } from '@/lib/parser';
import { v4 as uuidv4 } from 'uuid';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';

        if (file.type === 'application/pdf') {
            const data = await pdf(buffer);
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

        return NextResponse.json({
            id: uuidv4(),
            title: parsedData.personalInfo?.fullName || 'Imported Resume',
            data: {
                ...parsedData,
                themeColor: '#2563eb',
                fontFamily: 'Inter, sans-serif',
                templateId: 'modern'
            }
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Internal server error during import' }, { status: 500 });
    }
}
