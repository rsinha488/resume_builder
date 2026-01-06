import { ResumeState } from './features/resume/resumeSlice';

export const convertToPlainText = (data: ResumeState): string => {
    const { personalInfo, experiences, education, skills } = data;

    let text = `${personalInfo.fullName.toUpperCase()}\n`;
    text += `${personalInfo.jobTitle}\n`;
    text += `${personalInfo.email} | ${personalInfo.phone}\n`;
    text += `${personalInfo.address}\n`;
    if (personalInfo.website) text += `${personalInfo.website}\n`;
    text += `\nSUMMARY\n${personalInfo.summary}\n\n`;

    if (experiences?.length > 0) {
        text += `EXPERIENCE\n`;
        experiences?.forEach((exp) => {
            text += `${exp.position} | ${exp.company}\n`;
            text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
            text += `${exp.description}\n\n`;
        });
    }

    if (education.length > 0) {
        text += `EDUCATION\n`;
        education.forEach((edu) => {
            text += `${edu.degree} in ${edu.field}\n`;
            text += `${edu.school} | ${edu.startDate} - ${edu.endDate}\n\n`;
        });
    }

    if (skills.length > 0) {
        text += `SKILLS\n`;
        text += skills.join(', ') + '\n';
    }

    return text;
};
