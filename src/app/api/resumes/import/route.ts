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
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 5MB)' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 2. Signature Validation (Magic Numbers)
        const type = await fileTypeFromBuffer(buffer);
        if (!type || !['pdf', 'docx'].includes(type.ext)) {
            // Mammoth/ Mammoth-docx doesn't always detect signatures perfectly, but we should at least check for PDF
            if (file.type === 'application/pdf' && type?.ext !== 'pdf') {
                return NextResponse.json({ error: 'Invalid or malicious PDF file' }, { status: 400 });
            }
        }
        let text = '';

        if (file.type === 'application/pdf') {
            const { extractText, getDocumentProxy } = await import('unpdf');
            const pdf = await getDocumentProxy(new Uint8Array(buffer));
            const { text: pages } = await extractText(pdf, { mergePages: false });
            text = (pages as string[]).join('\n');
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

        // 3. Content Sanitization
        const sanitizedText = sanitizeString(text);
        const parsedData = parseResumeText(sanitizedText);
        
        // 4. Object Sanitization
        const cleanParsedData = sanitizeObject(parsedData);
        
        const title = cleanParsedData.personalInfo?.fullName || 'Imported Resume';
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

        return NextResponse.json({ id: resume.id, title: resume.title, data: resumeData });
    } catch (error: any) {
        console.error('Import error:', error?.message || error);
        return NextResponse.json({
            error: error?.message || 'Internal server error during import'
        }, { status: 500 });
    }
}
