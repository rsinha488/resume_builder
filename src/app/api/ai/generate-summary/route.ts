import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getUserFromRequest } from '@/lib/auth';
import { checkProAccess } from '@/lib/planGuard';

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { isPro, reason } = await checkProAccess(user.userId);
        if (!isPro) {
            return NextResponse.json({ error: reason || 'PRO plan required' }, { status: 403 });
        }

        const { personalInfo, experiences, skills } = await req.json();

        const context = `
Name: ${personalInfo.fullName}
Job Title: ${personalInfo.jobTitle}
Skills: ${skills.slice(0, 10).join(', ')}
Experience: ${experiences.slice(0, 3).map((e: any) =>
            `${e.position} at ${e.company}`).join(', ')}
        `.trim();

        const chatCompletion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: `Write a professional resume summary (3 sentences max, 80-120 words) for this person.
ATS-optimized, no first-person pronouns, highlight their strongest value.
Return ONLY the summary text.

${context}`
            }],
            max_tokens: 300,
            temperature: 0.7,
        });

        const summary = chatCompletion.choices[0]?.message?.content?.trim() || '';
        return NextResponse.json({ summary });
    } catch (error) {
        console.error('AI generate-summary error:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}

