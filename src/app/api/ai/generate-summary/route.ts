import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getUserFromRequest } from '@/lib/auth';

const client = new Anthropic();

export async function POST(req: Request) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { personalInfo, experiences, skills } = await req.json();

    const context = `
Name: ${personalInfo.fullName}
Job Title: ${personalInfo.jobTitle}
Skills: ${skills.slice(0, 10).join(', ')}
Experience: ${experiences.slice(0, 3).map((e: any) =>
    `${e.position} at ${e.company}`).join(', ')}
    `.trim();

    const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{
            role: 'user',
            content: `Write a professional resume summary (3 sentences max, 80-120 words) for this person.
ATS-optimized, no first-person pronouns, highlight their strongest value.
Return ONLY the summary text.

${context}`
        }]
    });

    const summary = (message.content[0] as { text: string }).text.trim();
    return NextResponse.json({ summary });
}
