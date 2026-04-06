import { ResumeState } from './features/resume/resumeSlice';

// Section header keywords
const SECTION_KEYWORDS: Record<string, string[]> = {
    experience: [
        'work experience', 'professional experience', 'employment history', 'work history',
        'career history', 'professional background', 'employment', 'experience', 'work',
        'past experience', 'career progression', 'work profile', 'experience & achievements'
    ],
    education: [
        'educational background', 'academic background', 'education', 'academic',
        'qualification', 'degrees', 'training', 'certifications', 'academics',
        'educational qualifications', 'academic profile', 'university', 'college'
    ],
    skills: [
        'technical skills', 'core competencies', 'key skills', 'core skills',
        'tech stack', 'technologies', 'competencies', 'expertise', 'skills',
        'tools', 'proficiencies', 'software', 'qualifications', 'languages',
        'hard skills', 'soft skills', 'computer skills', 'it skills', 'areas of expertise'
    ],
    summary: [
        'professional summary', 'career objective', 'executive summary',
        'personal profile', 'professional profile', 'personal statement',
        'about me', 'summary', 'profile', 'objective', 'about', 'bio', 'overview',
        'career summary'
    ]
};

// Known section header patterns (case-insensitive) to split flat text on
const SECTION_SPLIT_RE = new RegExp(
    '(?<![a-z])(' +
    Object.values(SECTION_KEYWORDS).flat()
        .sort((a, b) => b.length - a.length) // longest first
        .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|') +
    ')(?=\\s|$)',
    'gi'
);

export function parseResumeText(text: string): Partial<ResumeState> {
    // Normalise: collapse excessive whitespace but preserve single newlines
    const normalised = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

    // If the text has very few newlines relative to its length it is likely a flat blob
    // (pdfjs/unpdf sometimes returns one giant line per page). Split it heuristically.
    const newlineRatio = (normalised.match(/\n/g) || []).length / (normalised.length / 100);
    const structured = newlineRatio > 0.5 ? normalised : splitFlatText(normalised);

    const lines = structured.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const personalInfo = extractPersonalInfo(structured, lines);
    const sectionContent = identifySections(lines);

    const data: any = { personalInfo, experiences: [], education: [], skills: [] };

    if (sectionContent.summary.length > 0) {
        data.personalInfo.summary = sectionContent.summary.join(' ');
    }

    if (sectionContent.skills.length > 0) {
        const raw = sectionContent.skills.join(' ');
        data.skills = raw
            .split(/[,|•·\n\/]/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 1 && s.length < 50 && !/^\d+$/.test(s));
    }

    if (sectionContent.experience.length > 0) {
        data.experiences = parseExperienceBlocks(sectionContent.experience);
    }

    if (sectionContent.education.length > 0) {
        data.education = parseEducationBlocks(sectionContent.education);
    }

    return data;
}

/**
 * Heuristically split flat PDF text into lines by injecting newlines before
 * known section headers, dates, email, phone, and sentence starts.
 */
function splitFlatText(text: string): string {
    let result = text;

    // Put each section heading on its own line
    result = result.replace(SECTION_SPLIT_RE, '\n$1');

    // Put dates on their own line  e.g. "Jan 2019 — July 2019" or "2019 - Present"
    result = result.replace(
        /(?<!\n)((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/gi,
        '\n$&'
    );

    // Split on bullet separators that PDF extractors often preserve
    result = result.replace(/[·•◆▪▸►]/g, '\n');

    // Split on a capital letter after a period+space (new sentence = potential new bullet)
    result = result.replace(/\.\s+([A-Z])/g, '.\n$1');

    // Email and phone on their own line
    result = result.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '\n$1\n');
    result = result.replace(/((\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g, '\n$1\n');

    return result;
}

function extractPersonalInfo(text: string, lines: string[]) {
    const info = { fullName: '', jobTitle: '', email: '', phone: '', address: '', summary: '' };

    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) info.email = emailMatch[0];

    // Phone — international or local formats
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) info.phone = phoneMatch[0].trim();

    // Name — look in first 5 short lines for a properly-cased name (2+ words, all title-case)
    const nameRegex = /^[A-Z][a-zA-Z'-]+([\s][A-Z][a-zA-Z'-]+)+$/;
    for (const line of lines.slice(0, 8)) {
        const trimmed = line.trim();
        // Skip lines that are section headers, emails, phone numbers, or URLs
        if (
            trimmed.length > 60 ||
            trimmed.includes('@') ||
            /\d{5,}/.test(trimmed) ||
            /^(https?|www)/i.test(trimmed) ||
            isSectionHeader(trimmed)
        ) continue;

        if (nameRegex.test(trimmed)) {
            info.fullName = trimmed;
            break;
        }
    }

    // Fallback: first short non-header line
    if (!info.fullName) {
        for (const line of lines.slice(0, 5)) {
            if (line.length < 50 && !line.includes('@') && !/\d{7,}/.test(line) && !isSectionHeader(line)) {
                // Take only first 1-3 words (in case parser stuck multiple things together)
                const words = line.split(/\s+/);
                if (words.length <= 4) {
                    info.fullName = line;
                    break;
                }
                // Pick first 2-3 title-cased words as the name
                const nameWords = words.filter(w => /^[A-Z]/.test(w)).slice(0, 3);
                if (nameWords.length >= 2) {
                    info.fullName = nameWords.join(' ');
                    break;
                }
            }
        }
    }

    // Job title — common title keywords within first 8 lines, short enough to be a title
    const titleKeywords = /\b(engineer|developer|designer|manager|analyst|consultant|director|specialist|architect|lead|officer|executive|coordinator|administrator|programmer|scientist|intern|trainee|associate)\b/i;
    for (const line of lines.slice(1, 10)) {
        if (
            titleKeywords.test(line) &&
            line.length < 70 &&
            !line.includes('@') &&
            !/\d{4}/.test(line) &&
            !isSectionHeader(line)
        ) {
            info.jobTitle = line.trim();
            break;
        }
    }

    // Address — city, ST  or city, country pattern
    const addressMatch = text.match(/[A-Z][a-zA-Z\s]+(,\s*[A-Z][a-zA-Z\s]+){1,2}(\s+\d{5,6})?/);
    if (addressMatch && addressMatch[0].length < 60) info.address = addressMatch[0].trim();

    return info;
}

function isSectionHeader(line: string): boolean {
    const clean = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    return Object.values(SECTION_KEYWORDS).flat().some(
        kw => clean === kw || clean === kw + 's'
    );
}

function parseExperienceBlocks(lines: string[]) {
    const experiences: any[] = [];
    const datePattern = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/i;
    const yearOnlyPattern = /\b(19|20)\d{2}\b/;

    let current: any = null;
    let id = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const dateMatch = line.match(datePattern);

        if (dateMatch) {
            if (current) experiences.push(current);
            const parts = dateMatch[0].split(/[-–—to]+/i).map(s => s.trim());
            const isCurrent = /present|current/i.test(parts[1] || '');
            current = {
                id: String(id++),
                company: '',
                position: '',
                location: '',
                startDate: parts[0] || '',
                endDate: isCurrent ? '' : (parts[1] || ''),
                current: isCurrent,
                description: ''
            };

            // Peek at surrounding lines for position/company
            const prevLine = i > 0 ? lines[i - 1] : '';
            const prevPrev = i > 1 ? lines[i - 2] : '';

            if (prevLine && !yearOnlyPattern.test(prevLine) && prevLine.length < 100) {
                if (prevLine.includes(' | ') || prevLine.includes(' at ') || prevLine.includes(' @ ')) {
                    const sep = prevLine.includes(' | ') ? ' | ' : prevLine.includes(' at ') ? ' at ' : ' @ ';
                    const [pos, comp] = prevLine.split(sep);
                    current.position = pos.trim();
                    current.company = comp?.trim() || '';
                } else {
                    current.position = prevLine.trim();
                }
            }
            if (!current.company && prevPrev && !yearOnlyPattern.test(prevPrev) && prevPrev.length < 100) {
                current.company = prevPrev.trim();
            }
        } else if (current) {
            if (!current.position && line.length < 100 && !yearOnlyPattern.test(line)) {
                current.position = line;
            } else if (!current.company && line.length < 100 && !yearOnlyPattern.test(line) && line !== current.position) {
                current.company = line;
            } else if (line.length > 0) {
                current.description += (current.description ? '\n' : '') + line;
            }
        }
    }

    if (current) experiences.push(current);

    if (experiences.length === 0 && lines.length > 0) {
        experiences.push({
            id: '1', company: '', position: '', location: '',
            startDate: '', endDate: '', current: false,
            description: lines.join('\n')
        });
    }

    return experiences;
}

function parseEducationBlocks(lines: string[]) {
    const education: any[] = [];
    const degreePattern = /\b(bachelor|master|b\.?s\.?c?\.?|m\.?s\.?c?\.?|b\.?a\.?|m\.?a\.?|ph\.?d\.?|associate|diploma|certificate|mba|btech|mtech|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech)\b/i;

    let current: any = null;
    let id = 1;

    for (const line of lines) {
        const degreeMatch = line.match(degreePattern);
        const years = [...line.matchAll(/\b(19|20)\d{2}\b/g)].map(m => m[0]);

        if (degreeMatch) {
            if (current) education.push(current);
            const inMatch = line.match(/(.+?)\s+in\s+(.+)/i);
            current = {
                id: String(id++),
                school: '',
                degree: inMatch ? inMatch[1].trim() : degreeMatch[0],
                field: inMatch ? inMatch[2].replace(/\d{4}.*/g, '').trim() : '',
                location: '',
                startDate: years[0] || '',
                endDate: years[1] || '',
                current: false,
                description: ''
            };
        } else if (years.length > 0 && !current) {
            current = {
                id: String(id++),
                school: '', degree: '', field: '', location: '',
                startDate: years[0] || '', endDate: years[1] || '',
                current: false, description: ''
            };
        } else if (current) {
            if (!current.school && line.length < 120 && !/^\d+$/.test(line)) {
                current.school = line;
            } else {
                current.description += (current.description ? '\n' : '') + line;
            }
        }
    }

    if (current) education.push(current);

    if (education.length === 0 && lines.length > 0) {
        education.push({
            id: '1', school: lines[0] || '', degree: '', field: '', location: '',
            startDate: '', endDate: '', current: false,
            description: lines.slice(1).join('\n')
        });
    }

    return education;
}

function identifySections(lines: string[]) {
    const sectionContent: Record<string, string[]> = {
        experience: [], education: [], skills: [], summary: []
    };

    let currentSection = '';

    for (const line of lines) {
        const clean = line.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

        let matched = false;
        for (const [key, keywords] of Object.entries(SECTION_KEYWORDS)) {
            if (keywords.some(kw => clean === kw || (clean.startsWith(kw) && clean.length < kw.length + 15))) {
                currentSection = key;
                matched = true;
                break;
            }
        }

        if (!matched && currentSection) {
            sectionContent[currentSection].push(line);
        }
    }

    return sectionContent;
}
