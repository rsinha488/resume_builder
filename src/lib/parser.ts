import { ResumeState } from './features/resume/resumeSlice';

export function parseResumeText(text: string): Partial<ResumeState> {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const data: any = {
        personalInfo: extractPersonalInfo(text, lines),
        experiences: [],
        education: [],
        skills: []
    };

    const sectionContent = identifySections(lines);

    if (sectionContent.summary.length > 0) {
        data.personalInfo.summary = sectionContent.summary.join(' ');
    }

    if (sectionContent.skills.length > 0) {
        const skillsText = sectionContent.skills.join(', ');
        data.skills = skillsText.split(/[,|•\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 1 && s.length < 40);
    }

    if (sectionContent.experience.length > 0) {
        data.experiences = parseExperienceBlocks(sectionContent.experience);
    }

    if (sectionContent.education.length > 0) {
        data.education = parseEducationBlocks(sectionContent.education);
    }

    return data;
}

function extractPersonalInfo(text: string, lines: string[]) {
    const info = {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        summary: ''
    };

    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) info.email = emailMatch[0];

    // Phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) info.phone = phoneMatch[0].trim();

    // Name — first non-empty line that isn't an email/phone/URL and looks like a name
    const nameRegex = /^[A-Z][a-zA-Z]+([\s'-][A-Z][a-zA-Z]+)+$/;
    for (const line of lines.slice(0, 5)) {
        if (nameRegex.test(line) && !line.includes('@') && !line.match(/\d{3}/)) {
            info.fullName = line;
            break;
        }
    }
    // Fallback: first line
    if (!info.fullName && lines.length > 0) {
        info.fullName = lines[0];
    }

    // Job title — look for common title patterns in first 6 lines
    const titleKeywords = /engineer|developer|designer|manager|analyst|consultant|director|specialist|architect|lead|officer|executive|coordinator|administrator/i;
    for (const line of lines.slice(1, 6)) {
        if (titleKeywords.test(line) && line.length < 60 && !line.includes('@')) {
            info.jobTitle = line;
            break;
        }
    }

    // Address — look for city/state pattern
    const addressMatch = text.match(/[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(\s+\d{5})?/);
    if (addressMatch) info.address = addressMatch[0].trim();

    return info;
}

function parseExperienceBlocks(lines: string[]) {
    const experiences: any[] = [];
    const datePattern = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/i;
    const yearPattern = /\b(19|20)\d{2}\b/;

    let current: any = null;
    let id = 1;

    for (const line of lines) {
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
            // Try to extract position/company from surrounding context
            const idx = lines.indexOf(line);
            if (idx > 0) {
                const prev = lines[idx - 1];
                // If previous line has a separator like | or @ or comma, split it
                if (prev.includes(' | ') || prev.includes(' at ') || prev.includes(' @ ')) {
                    const sep = prev.includes(' | ') ? ' | ' : prev.includes(' at ') ? ' at ' : ' @ ';
                    const [pos, comp] = prev.split(sep);
                    current.position = pos.trim();
                    current.company = comp?.trim() || '';
                } else {
                    current.position = prev;
                }
            }
            if (idx > 1 && !current.company) {
                current.company = lines[idx - 2] || '';
            }
        } else if (current) {
            if (!current.position && line.length < 80 && !yearPattern.test(line)) {
                current.position = line;
            } else if (!current.company && line.length < 80 && !yearPattern.test(line) && line !== current.position) {
                current.company = line;
            } else {
                current.description += (current.description ? '\n' : '') + line;
            }
        }
    }

    if (current) experiences.push(current);

    // If nothing parsed, create one entry with raw text as description
    if (experiences.length === 0 && lines.length > 0) {
        experiences.push({
            id: '1',
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: lines.join('\n')
        });
    }

    return experiences;
}

function parseEducationBlocks(lines: string[]) {
    const education: any[] = [];
    const degreePattern = /\b(bachelor|master|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|ph\.?d\.?|associate|diploma|certificate|mba|btech|mtech|be|me)\b/i;
    const yearPattern = /\b(19|20)\d{2}\b/g;

    let current: any = null;
    let id = 1;

    for (const line of lines) {
        const degreeMatch = line.match(degreePattern);
        const years = line.match(yearPattern);

        if (degreeMatch) {
            if (current) education.push(current);
            // Try to split "Bachelor of Science in Computer Science" → degree + field
            const inMatch = line.match(/(.+?)\s+in\s+(.+)/i);
            current = {
                id: String(id++),
                school: '',
                degree: inMatch ? inMatch[1].trim() : line,
                field: inMatch ? inMatch[2].replace(/\d{4}.*/g, '').trim() : '',
                location: '',
                startDate: years?.[0] || '',
                endDate: years?.[1] || '',
                current: false,
                description: ''
            };
        } else if (years && !current) {
            current = {
                id: String(id++),
                school: '',
                degree: '',
                field: '',
                location: '',
                startDate: years[0] || '',
                endDate: years[1] || '',
                current: false,
                description: ''
            };
        } else if (current) {
            if (!current.school && line.length < 100) {
                current.school = line;
            } else {
                current.description += (current.description ? '\n' : '') + line;
            }
        }
    }

    if (current) education.push(current);

    if (education.length === 0 && lines.length > 0) {
        education.push({
            id: '1',
            school: lines[0] || '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: lines.slice(1).join('\n')
        });
    }

    return education;
}

function identifySections(lines: string[]) {
    const sections: { [key: string]: string[] } = {
        experience: [
            'experience', 'work history', 'employment', 'professional background', 
            'work experience', 'professional experience', 'career history', 
            'employment history', 'work', 'history', 'professional career'
        ],
        education: [
            'education', 'academic', 'qualification', 'academic background',
            'educational background', 'learning', 'scholastic', 'academics',
            'degrees', 'training', 'certifications'
        ],
        skills: [
            'skills', 'technologies', 'competencies', 'expertise', 
            'technical skills', 'core competencies', 'tools', 'proficiencies',
            'languages', 'core skills', 'tech stack', 'software', 'qualifications'
        ],
        summary: [
            'summary', 'profile', 'objective', 'about me', 'professional summary', 
            'career objective', 'executive summary', 'personal profile', 'about', 
            'bio', 'overview', 'professional profile', 'personal statement'
        ]
    };

    const sectionContent: { [key: string]: string[] } = {
        experience: [],
        education: [],
        skills: [],
        summary: []
    };

    let currentSection = '';
    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        let foundSection = false;

        for (const [key, keywords] of Object.entries(sections)) {
            if (keywords.some(kw => lowerLine === kw || lowerLine.startsWith(kw + ':') || lowerLine.startsWith(kw + ' ') || lowerLine === kw.toUpperCase())) {
                currentSection = key;
                foundSection = true;
                break;
            }
        }

        if (!foundSection && currentSection) {
            sectionContent[currentSection].push(line);
        }
    }

    return sectionContent;
}
