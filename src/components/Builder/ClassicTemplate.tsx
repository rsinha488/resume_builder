'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import PreviewSection from './PreviewSection';

export default function ClassicTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
    const {
        personalInfo,
        experiences,
        education,
        skills,
        themeColor,
        fontFamily,
        fontSize,
        lineSpacing,
        sectionSpacing,
        margins
    } = data;

    const fontSizeMap = {
        small: 'text-[12px]',
        medium: 'text-[14px]',
        large: 'text-[16px]'
    };

    const renderSectionContent = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                if (!personalInfo?.summary) return null;
                return (
                    <PreviewSection key="summary" sectionId="summary" onClick={onSectionClick} title="Summary">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Professional Summary
                            </h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-justify whitespace-pre-line`}>
                                {personalInfo.summary}
                            </p>
                        </section>
                    </PreviewSection>
                );
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <PreviewSection key="experience" sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Experience
                            </h3>
                            <div className="space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg">{exp.company}</h4>
                                            <span className="text-sm italic">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-md font-medium italic mb-2" style={{ color: themeColor }}>{exp.position}</div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 whitespace-pre-line leading-relaxed text-justify`}>
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <PreviewSection key="education" sectionId="education" onClick={onSectionClick} title="Education">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg">{edu.school}</h4>
                                            <span className="text-sm italic">
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                        <div className={`${fontSizeMap[fontSize || 'medium']} italic`}>
                                            {edu.degree} in {edu.field}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'projects':
                if (!data.projects?.length) return null;
                return (
                    <PreviewSection key="projects" sectionId="projects" onClick={onSectionClick} title="Projects">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Projects
                            </h3>
                            <div className="space-y-8">
                                {data.projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg">{proj.name}</h4>
                                            {proj.link && (
                                                <span className="text-sm italic text-primary-600">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <div className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70">
                                                {proj.technologies}
                                            </div>
                                        )}
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 whitespace-pre-line leading-relaxed text-justify`}>
                                            {proj.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <PreviewSection key="skills" sectionId="skills" onClick={onSectionClick} title="Skills">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Skills
                            </h3>
                            <div className="text-sm leading-relaxed text-center font-medium text-gray-700">
                                {skills.join('  •  ')}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'languages':
                if (!data.languages?.length) return null;
                return (
                    <PreviewSection key="languages" sectionId="languages" onClick={onSectionClick} title="Languages">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Languages
                            </h3>
                            <div className="text-sm leading-relaxed text-center font-medium text-gray-700">
                                {data.languages.join('  •  ')}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <PreviewSection key="certifications" sectionId="certifications" onClick={onSectionClick} title="Certifications">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                Certifications
                            </h3>
                            <div className="space-y-2 text-center text-sm font-medium text-gray-700">
                                {data.certifications.map((cert) => (
                                    <p key={cert}>{cert}</p>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            default:
                if (sectionId.startsWith('custom-')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section style={{ marginBottom: `${sectionSpacing}px` }}>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                                    {customSec.title}
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed prose prose-sm max-w-none text-center`}
                                    dangerouslySetInnerHTML={{ __html: customSec.content }}
                                />
                            </section>
                        </PreviewSection>
                    );
                }
                return null;
        }
    };

    const renderedSections = (data.sections || [])
        .filter(s => s.isVisible && s.id !== 'personal')
        .map(s => renderSectionContent(s.id));

    return (
        <div
            id="resume-content"
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800"
            style={{
                fontFamily: fontFamily || 'serif',
                padding: `${margins || 96}px`,
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600 italic">
                        {personalInfo?.email && <span>{personalInfo.email}</span>}
                        {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                        {personalInfo?.address && <span>• {personalInfo.address}</span>}
                        {personalInfo?.website && <span>• <span className="lowercase">{personalInfo.website}</span></span>}
                    </div>
                </header>
            </PreviewSection>

            <div className="flex flex-col">
                {renderedSections}
            </div>
        </div>
    );
}
