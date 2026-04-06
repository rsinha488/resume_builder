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
                content: `You are a professional resume SUMMARY rewriting agent.

            Rewrite this into a strong PROFESSIONAL SUMMARY section for a ${safePersonalInfo.jobTitle || 'professional'} role.

            Ensure the summary:
            - is concise, confident, and impactful
            - highlights the candidate’s strongest value proposition
            - is achievement-focused with measurable impact where possible
            - uses strong, professional language
            - is ATS-optimized with relevant keywords
            - is written in third person (no first-person pronouns)
            - is limited to 3 sentences (80–120 words total)

            DO NOT:
            - add skills or experience not provided
            - include placeholder content
            - include explanations or formatting outside the response

            Return ONLY valid JSON in this format:

            {
            "summary": "string"
            }

            User Summary: ${context}`
            }],
            max_tokens: 300,
            temperature: 0.7,
        });

        const rawContent = chatCompletion.choices[0]?.message?.content?.trim() || '';
        
        let finalSummary = '';
        try {
            const jsonMatch = rawContent.match(/{[\s\S]*}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
            finalSummary = parsed.summary || rawContent;
        } catch (e) {
            finalSummary = rawContent;
        }

        let newUsageCount = aiUsageCount;
        if (!isPro) {
            const updatedUser = await prisma.user.update({
                where: { id: user.userId },
                data: { aiUsageCount: { increment: 1 } },
                select: { aiUsageCount: true }
            });
            newUsageCount = updatedUser.aiUsageCount || 0;
        }

        return NextResponse.json({ summary: finalSummary, newUsageCount });
    } catch (error) {
        console.error('AI generate-summary error:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}

