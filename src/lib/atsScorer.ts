import { ResumeState } from './features/resume/resumeSlice';

export interface ScoreResult {
    score: number;
    suggestions: {
        type: 'critical' | 'improvement' | 'success';
        message: string;
        targetSection?: string;
    }[];
}

const KEYWORDS: Record<string, string[]> = {
    'software engineer': ['react', 'javascript', 'typescript', 'node.js', 'aws', 'docker', 'git', 'agile', 'api', 'database'],
    'frontend developer': ['react', 'css', 'html', 'javascript', 'tailwind', 'redux', 'responsive', 'ui/ux', 'webpack'],
    'backend developer': ['node.js', 'python', 'java', 'sql', 'nosql', 'api', 'microservices', 'docker', 'kubernetes'],
    'data scientist': ['python', 'r', 'machine learning', 'statistics', 'sql', 'pandas', 'numpy', 'data visualization'],
    'product manager': ['roadmap', 'agile', 'scrum', 'user stories', 'strategy', 'analytics', 'stakeholder', 'product lifecycle'],
};

function evaluatePersonalInfo(personalInfo: any, suggestions: any[]): number {
    let score = 0;
    if (!personalInfo) {
        suggestions.push({ type: 'critical', message: 'Add your personal information.', targetSection: 'personal' });
        return 0;
    }
    if (personalInfo.fullName) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your full name.', targetSection: 'personal' });

    if (personalInfo.email) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your email address.', targetSection: 'personal' });

    if (personalInfo.phone) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your phone number.', targetSection: 'personal' });

    if (personalInfo.address) score += 5;
    else suggestions.push({ type: 'improvement', message: 'Add your location (City, Country).', targetSection: 'personal' });

    // New Check: LinkedIn or Portfolio
    if (personalInfo.website || personalInfo.linkedin) {
        score += 5;
    } else {
        suggestions.push({ type: 'improvement', message: 'Add a LinkedIn or Portfolio link for a stronger profile.', targetSection: 'personal' });
    }

    return score;
}

function evaluateSummary(summary: string | undefined, suggestions: any[]): number {
    if (!summary) {
        suggestions.push({ type: 'critical', message: 'Add a professional summary.', targetSection: 'personal' });
        return 0;
    }
    if (summary.length > 200) return 10;
    if (summary.length > 100) return 8;
    suggestions.push({ type: 'improvement', message: 'Your summary is a bit short. Aim for at least 100 characters for better impact.', targetSection: 'personal' });
    return 5;
}

function evaluateExperience(experiences: any[], suggestions: any[]): number {
    if (!experiences || experiences.length === 0) {
        suggestions.push({ type: 'critical', message: 'Add your work experience.', targetSection: 'experience' });
        return 0;
    }
    
    let totalScore = 0;
    const hasLongDescriptions = experiences.some(exp => exp.description?.length > 100);
    const hasBulletPoints = experiences.some(exp => exp.description?.includes('•') || exp.description?.includes('-') || exp.description?.includes('*'));

    if (hasLongDescriptions) totalScore += 15;
    else suggestions.push({ type: 'improvement', message: 'Provide more detailed descriptions of your roles.', targetSection: 'experience' });

    if (hasBulletPoints) totalScore += 15;
    else suggestions.push({ type: 'improvement', message: 'Format job descriptions with bullet points for easier AI/ATS scanning.', targetSection: 'experience' });

    // Date consistency check
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/; // MM/YYYY
    const datesValid = experiences.every(exp => 
        (exp.startDate && (dateRegex.test(exp.startDate) || exp.startDate.toLowerCase() === 'present')) &&
        (exp.current || (exp.endDate && (dateRegex.test(exp.endDate) || exp.endDate.toLowerCase() === 'present')))
    );

    if (!datesValid) {
        suggestions.push({ type: 'improvement', message: 'Ensure all dates follow the MM/YYYY format for consistency.', targetSection: 'experience' });
    } else {
        totalScore += 5;
    }

    return totalScore;
}

function evaluateSkills(skills: string[], suggestions: any[]): number {
    if (!skills || skills.length === 0) {
        suggestions.push({ type: 'critical', message: 'Add technical or soft skills.', targetSection: 'skills' });
        return 0;
    }
    if (skills.length >= 8) return 10;
    if (skills.length >= 5) return 7;
    suggestions.push({ type: 'improvement', message: 'Add at least 5-8 relevant skills to boost keyword score.', targetSection: 'skills' });
    return 4;
}

function evaluateKeywords(resume: ResumeState, suggestions: any[]): number {
    const jobTitle = resume.personalInfo?.jobTitle?.toLowerCase() || '';
    let targetKeywords: string[] = [];

    for (const [title, keywords] of Object.entries(KEYWORDS)) {
        if (jobTitle.includes(title)) {
            targetKeywords = keywords;
            break;
        }
    }

    if (targetKeywords.length === 0) {
        return Math.min(10, resume.skills?.length * 2);
    }

    const resumeText = JSON.stringify(resume).toLowerCase();
    const foundKeywords = targetKeywords.filter(kw => resumeText.includes(kw)).length;
    const keywordScore = Math.min(20, (foundKeywords / targetKeywords.length) * 20);

    if (foundKeywords < 3) {
        suggestions.push({ 
            type: 'improvement', 
            message: `Consider adding more industry keywords like: ${targetKeywords.slice(0, 3).join(', ')}.`,
            targetSection: 'skills'
        });
    }

    return keywordScore;
}

export function calculateAtsScore(resume: ResumeState): ScoreResult {
    const suggestions: ScoreResult['suggestions'] = [];
    let score = 0;

    score += evaluatePersonalInfo(resume.personalInfo, suggestions);
    score += evaluateSummary(resume.personalInfo?.summary, suggestions);
    score += evaluateExperience(resume.experiences, suggestions);
    score += (resume.education?.length > 0 ? 10 : 0);
    if (resume.education?.length === 0) suggestions.push({ type: 'improvement', message: 'Add your educational background.' });
    score += evaluateSkills(resume.skills, suggestions);
    score += evaluateKeywords(resume, suggestions);

    // Final Word Count Check
    const fullText = JSON.stringify(resume);
    const wordCount = fullText.split(/\s+/).length;
    if (wordCount < 200) {
        suggestions.push({ type: 'improvement', message: 'Your resume is quite sparse. Add more content to showcase your value.' });
    } else if (wordCount > 1500) {
        suggestions.push({ type: 'improvement', message: 'Your resume is very long. ATS might struggle with multi-page content.' });
    }

    score = Math.min(100, Math.round(score));

    if (score >= 80) {
        suggestions.unshift({ type: 'success', message: 'Great job! Your resume is highly ATS-optimized.' });
    } else if (score >= 50) {
        suggestions.unshift({ type: 'improvement', message: 'Good start, but there is room for improvement.' });
    }

    return { score, suggestions };
}
