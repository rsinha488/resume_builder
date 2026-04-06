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

        const { resume, jobDescription } = await req.json();

        const resumeContext = JSON.stringify({
            personalInfo: resume.personalInfo,
            experiences: resume.experiences?.map((e: any) => ({
                position: e.position,
                company: e.company,
                description: e.description
            })),
            skills: resume.skills
        });

        const chatCompletion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: `You are an elite Technical Recruiter and ATS Optimization Expert.
                
Analyze the following RESUME against the provided JOB DESCRIPTION (JD).

RESUME:
${resumeContext}

JOB DESCRIPTION (JD):
${jobDescription || 'No specific JD provided. Perform a general industry standard best-practice analysis.'}

Return ONLY valid JSON in this format:
{
  "matchRate": number (0-100),
  "foundKeywords": ["string"],
  "missingKeywords": ["string"],
  "impactScore": number (0-100),
  "improvementTips": {
    "summary": "string",
    "experience": "string",
    "skills": "string"
  }
}

Your analysis must be:
1. Brutally honest but actionable.
2. Focus on "Impact Signals" (numbers, metrics) for the impactScore.
3. Identify missing technical keywords/skills from the JD in the missingKeywords list.`
            }],
            max_tokens: 1000,
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

        let newUsageCount = aiUsageCount;
        if (!isPro) {
            const updatedUser = await prisma.user.update({
                where: { id: user.userId },
                data: { aiUsageCount: { increment: 1 } },
                select: { aiUsageCount: true }
            });
            newUsageCount = updatedUser.aiUsageCount || 0;
        }

        return NextResponse.json({ analysis: result, newUsageCount });
    } catch (error) {
        console.error('AI analyze-ats error:', error);
        return NextResponse.json({ error: 'Failed to perform deep scan' }, { status: 500 });
    }
}
