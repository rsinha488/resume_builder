import { ResumeState } from './features/resume/resumeSlice';

export interface ScoreResult {
    score: number;
    suggestions: {
        type: 'critical' | 'improvement' | 'success';
        message: string;
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
        suggestions.push({ type: 'critical', message: 'Add your personal information.' });
        return 0;
    }
    if (personalInfo.fullName) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your full name.' });

    if (personalInfo.email) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your email address.' });

    if (personalInfo.phone) score += 5;
    else suggestions.push({ type: 'critical', message: 'Add your phone number.' });

    if (personalInfo.address) score += 5;
    else suggestions.push({ type: 'improvement', message: 'Add your location (City, Country).' });

    return score;
}

function evaluateSummary(summary: string | undefined, suggestions: any[]): number {
    if (!summary) {
        suggestions.push({ type: 'critical', message: 'Add a professional summary.' });
        return 0;
    }
    if (summary.length > 100) return 10;
    suggestions.push({ type: 'improvement', message: 'Your summary is a bit short. Aim for 2-3 sentences.' });
    return 5;
}

function evaluateExperience(experiences: any[], suggestions: any[]): number {
    if (experiences?.length === 0) {
        suggestions.push({ type: 'critical', message: 'Add your work experience.' });
        return 0;
    }
    const hasDescriptions = experiences?.every(exp => exp.description && exp.description.length > 50);
    if (hasDescriptions) return 30;
    suggestions.push({ type: 'improvement', message: 'Add more detail to your job descriptions using bullet points.' });
    return 20;
}

function evaluateSkills(skills: string[], suggestions: any[]): number {
    if (skills?.length === 0) {
        suggestions.push({ type: 'critical', message: 'Add your technical or soft skills.' });
        return 0;
    }
    if (skills?.length >= 5) return 10;
    suggestions.push({ type: 'improvement', message: 'Add at least 5 relevant skills.' });
    return 5;
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
        suggestions.push({ type: 'improvement', message: `Consider adding more industry keywords like: ${targetKeywords.slice(0, 3).join(', ')}.` });
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

    score = Math.min(100, Math.round(score));

    if (score >= 80) {
        suggestions.unshift({ type: 'success', message: 'Great job! Your resume is highly ATS-optimized.' });
    } else if (score >= 50) {
        suggestions.unshift({ type: 'improvement', message: 'Good start, but there is room for improvement.' });
    }

    return { score, suggestions };
}
