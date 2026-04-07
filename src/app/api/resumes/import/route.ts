import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseResumeText } from '@/lib/parser';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeObject, sanitizeString } from '@/lib/sanitizer';
import { fileTypeFromBuffer } from 'file-type';

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
            console.error('Import error: No file provided');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Check file size (5MB limit)
        if (file.size === 0) {
            console.error('Import error: Empty file uploaded');
            return NextResponse.json({ error: 'The uploaded file is empty' }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
            console.error(`Import error: File too large (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
            return NextResponse.json({ error: 'File too large (Max 5MB)' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Signature Validation (Magic Numbers)
        const type = await fileTypeFromBuffer(buffer);
        if (!type || !['pdf', 'docx'].includes(type.ext)) {
            // Mammoth/ Mammoth-docx doesn't always detect signatures perfectly, but we should at least check for PDF
            if (file.type === 'application/pdf' && type?.ext !== 'pdf') {
                console.error('Import error: Invalid PDF signature');
                return NextResponse.json({ error: 'Invalid or malicious PDF file' }, { status: 400 });
            }
        }
        let text = '';

        const fileNameLower = file.name.toLowerCase();
        if (file.type === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
            const { PDFParse } = await import('pdf-parse');
            // The modern pdf-parse expects the data (Uint8Array) in the constructor options
            const parser = new PDFParse({ data: new Uint8Array(buffer) }) as any;
            await parser.load();
            // 'getText' returns a TextResult object with a 'text' property
            const result = await parser.getText();
            text = typeof result === 'string' ? result : (result?.text || '');
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileNameLower.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            console.error(`Import error: Unsupported format (${file.type})`);
            return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
        }

        if (!text || text.trim().length === 0) {
            console.error('Import error: Could not extract any text');
            return NextResponse.json({ error: 'Could not extract text from file. Please ensure it is not a scanned image.' }, { status: 400 });
        }

        // 3. Content Sanitization
        const sanitizedText = await sanitizeString(text);
        const parsedData = parseResumeText(sanitizedText);
        
        // 4. Object Sanitization
        const cleanParsedData = await sanitizeObject(parsedData);
        
        const title = (cleanParsedData as any).personalInfo?.fullName || 'Imported Resume';
        const resumeData = {
            ...cleanParsedData,
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

        console.log(`Import success: ${resume.id} (${(file.size / 1024).toFixed(1)} KB)`);
        return NextResponse.json({ id: resume.id, title: resume.title, data: resumeData });
    } catch (error: any) {
        console.error('Import 500 error:', error);
        return NextResponse.json({
            error: error?.message || 'Internal server error during import',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
