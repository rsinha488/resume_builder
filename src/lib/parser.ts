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

    // Process Summary
    if (sectionContent.summary.length > 0) {
        data.personalInfo.summary = sectionContent.summary.join(' ');
    }

    // Process Skills
    if (sectionContent.skills.length > 0) {
        const skillsText = sectionContent.skills.join(', ');
        data.skills = skillsText.split(/[,|•\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
    }

    // Process Experience
    if (sectionContent.experience.length > 0) {
        data.experiences.push({
            id: '1',
            company: 'Extracted Company',
            position: 'Extracted Position',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: sectionContent.experience.join('\n')
        });
    }

    // Process Education
    if (sectionContent.education.length > 0) {
        data.education.push({
            id: '1',
            school: 'Extracted School',
            degree: 'Extracted Degree',
            location: '',
            startDate: '',
            endDate: '',
            description: sectionContent.education.join('\n')
        });
    }

    return data;
}

function extractPersonalInfo(text: string, lines: string[]) {
    const info = {
        fullName: lines.length > 0 ? lines[0] : '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        summary: ''
    };

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatch = emailRegex.exec(text);
    if (emailMatch) info.email = emailMatch[0];

    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatch = phoneRegex.exec(text);
    if (phoneMatch) info.phone = phoneMatch[0];

    return info;
}

function identifySections(lines: string[]) {
    const sections: { [key: string]: string[] } = {
        experience: ['experience', 'work history', 'employment', 'professional background'],
        education: ['education', 'academic', 'qualification'],
        skills: ['skills', 'technologies', 'competencies', 'expertise'],
        summary: ['summary', 'profile', 'objective', 'about me']
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
            if (keywords.some(kw => lowerLine === kw || lowerLine.startsWith(kw + ':') || lowerLine.startsWith(kw + ' '))) {
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
