import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getUserFromRequest } from '@/lib/auth';

const client = new Anthropic();

export async function POST(req: Request) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { description, jobTitle } = await req.json();
    if (!description?.trim()) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
            role: 'user',
            content: `Rewrite this resume experience description for a ${jobTitle || 'professional'} role. 
Use strong action verbs, add quantifiable metrics where reasonable, and make it ATS-friendly.
Return ONLY the rewritten text, no explanation, no bullet points prefix.

Original: ${description}`
        }]
    });

    const rewritten = (message.content[0] as { text: string }).text.trim();
    return NextResponse.json({ rewritten });
}
