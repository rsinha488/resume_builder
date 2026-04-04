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

        const { description, jobTitle } = await req.json();
        if (!description?.trim()) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const chatCompletion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: `Rewrite this resume experience description for a ${jobTitle || 'professional'} role. 
Use strong action verbs, add quantifiable metrics where reasonable, and make it ATS-friendly.
Return ONLY the rewritten text, no explanation, no bullet points prefix.

Original: ${description}`
            }],
            max_tokens: 500,
            temperature: 0.7,
        });

        const rewritten = chatCompletion.choices[0]?.message?.content?.trim() || '';
        return NextResponse.json({ rewritten });
    } catch (error) {
        console.error('AI rewrite-bullet error:', error);
        return NextResponse.json({ error: 'Failed to rewrite description' }, { status: 500 });
    }
}

