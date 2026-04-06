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

        const { personalInfo, experiences, skills } = await req.json();

        const safePersonalInfo = personalInfo || {};
        const safeSkills = Array.isArray(skills) ? skills : [];
        const safeExperiences = Array.isArray(experiences) ? experiences : [];

        const context = `
Name: ${safePersonalInfo.fullName || 'Professional'}
Job Title: ${safePersonalInfo.jobTitle || 'Candidate'}
Skills: ${safeSkills.slice(0, 10).join(', ')}
Experience: ${safeExperiences.slice(0, 3).map((e: any) =>
            `${e.position || 'Employee'} at ${e.company || 'Company'}`).join(', ')}
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
        
        let newUsageCount = aiUsageCount;
        if (!isPro) {
            const updatedUser = await prisma.user.update({
                where: { id: user.userId },
                data: { aiUsageCount: { increment: 1 } },
                select: { aiUsageCount: true }
            });
            newUsageCount = updatedUser.aiUsageCount;
        }

        return NextResponse.json({ summary, newUsageCount });
    } catch (error) {
        console.error('AI generate-summary error:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}

