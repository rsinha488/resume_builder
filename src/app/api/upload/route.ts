import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { fileTypeFromBuffer } from 'file-type';
import { getUserFromRequest } from '@/lib/auth';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const user = getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 1. Check file size (2MB limit for images)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image too large (Max 2MB)' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. Signature Validation (Magic Numbers)
        const type = await fileTypeFromBuffer(buffer);
        if (!type || !['jpg', 'png', 'webp', 'jpeg'].includes(type.ext)) {
            return NextResponse.json({ error: 'Invalid image format (Supported: JPEG, PNG, WebP)' }, { status: 400 });
        }

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder: 'resume-builder',
                    // Strips metadata and re-encodes to prevent malware injections
                    invalidate: true,
                    resource_type: 'image',
                    format: type.ext,
                    transformation: [{ width: 500, height: 500, crop: 'limit' }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            ).end(buffer);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
