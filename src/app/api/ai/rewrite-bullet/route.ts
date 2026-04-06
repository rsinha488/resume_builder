import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getUserFromRequest } from '@/lib/auth';
import { checkProAccess } from '@/lib/planGuard';
import { prisma } from '@/lib/prisma';

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { isPro, reason, aiUsageCount } = await checkProAccess(user.userId);
        if (!isPro && aiUsageCount >= 50) {
            return NextResponse.json({ error: reason || 'AI limit reached. Please upgrade to Pro.' }, { status: 403 });
        }

        const { description, jobTitle } = await req.json();
        if (!description?.trim()) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const chatCompletion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: `
            You are a professional resume EXPERIENCE rewriting agent.

            Rewrite this resume experience for a ${jobTitle || 'professional'} role.

            Ensure the output:
            - uses strong action verbs
            - highlights measurable impact where possible
            - is ATS-friendly with relevant keywords
            - is concise and professional
            - is formatted as 4–5 bullet points only (no paragraphs)

            Each bullet point should:
            - start with an action verb
            - focus on achievements and outcomes

            DO NOT:
            - add information not provided
            - include explanations or extra text
            - include bullet symbols (•, -, etc.)

            Return ONLY valid JSON in this format:

            {
            "experience": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"]
            }

            Experience input:
            ${description}`
            }],
            max_tokens: 500,
            temperature: 0.7,
        });

        const rawContent = chatCompletion.choices[0]?.message?.content?.trim() || '';

        let finalRewritten = '';
        try {
            const jsonMatch = rawContent.match(/{[\s\S]*}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
            if (parsed.experience && Array.isArray(parsed.experience)) {
                finalRewritten = parsed.experience.map((point: string) => `• ${point}`).join('\n');
            } else {
                finalRewritten = rawContent;
            }
        } catch (e) {
            finalRewritten = rawContent;
        }

        let newUsageCount = aiUsageCount;
        if (!isPro) {
            const updatedUser = await prisma.user.update({
                where: { id: user.userId },
                data: { aiUsageCount: { increment: 1 } },
                select: { aiUsageCount: true }
            });
            newUsageCount = updatedUser.aiUsageCount;
        }

        return NextResponse.json({ rewritten: finalRewritten, newUsageCount });
    } catch (error) {
        console.error('AI rewrite-bullet error:', error);
        return NextResponse.json({ error: 'Failed to rewrite description' }, { status: 500 });
    }
}

