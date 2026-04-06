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
                content: `You are an expert resume writer specializing in FAANG/MAANG-level resumes.

Rewrite the given content into a high-impact PROFESSIONAL SUMMARY for a ${safePersonalInfo.jobTitle || 'professional'} role.

The summary MUST:
- avoid generic buzzwords (e.g., "results-driven", "team player", "hardworking")
- clearly state years of experience (if present)
- highlight core technical expertise or domain specialization
- include 1–2 measurable achievements or impact signals where possible
- reflect ownership, scale, or complexity of work
- be ATS-optimized with relevant keywords
- be written in third person (no first-person pronouns)
- be exactly 2–3 sentences (60–100 words max)
- sound sharp, modern, and specific (like top-tier tech resumes)

DO NOT:
- repeat the candidate’s full name
- add information not provided
- use vague or filler language
- include soft-skill-heavy statements without proof
- include explanations or extra text

Return ONLY valid JSON in this format:

{
  "summary": "string"
}

User Summary:
${context}`
            }],
            max_tokens: 250,
            temperature: 0.5,
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

