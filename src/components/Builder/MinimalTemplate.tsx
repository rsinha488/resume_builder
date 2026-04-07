'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import PreviewSection from './PreviewSection';

export default function MinimalTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
        small: 'text-[14px]',
        medium: 'text-[16px]',
        large: 'text-[18px]'
    };

    const renderSectionContent = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                if (!personalInfo?.summary) return null;
                return (
                    <PreviewSection key="summary" sectionId="summary" onClick={onSectionClick} title="Summary">
                        <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 text-center">
                                Profile
                            </h3>
                            <p className={`text-center max-w-2xl mx-auto italic ${fontSizeMap[fontSize || 'medium']} text-gray-600`}>
                                "{personalInfo.summary}"
                            </p>
                        </section>
                    </PreviewSection>
                );
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <PreviewSection key="experience" sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">
                                Experience
                            </h3>
                            <div className="space-y-12">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="grid grid-cols-12 gap-8">
                                        <div className="col-span-3 text-right">
                                            <span className="text-sm font-medium tracking-tighter text-gray-400">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="col-span-9">
                                            <h4 className="text-xl font-medium text-gray-900 mb-1">{exp.position}</h4>
                                            <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">
                                                {exp.company}
                                            </p>
                                            <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
                                                {exp.description}
                                            </p>
                                        </div>
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
                        <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">
                                Education
                            </h3>
                            <div className="space-y-8">
                                {education.map((edu) => (
                                    <div key={edu.id} className="text-center">
                                        <h4 className={`font-medium text-gray-900 ${fontSizeMap[fontSize || 'medium']}`}>{edu.degree}</h4>
                                        <p className="text-sm text-gray-500 mb-1">{edu.field}</p>
                                        <p className="text-xs tracking-widest uppercase text-gray-400">
                                            {edu.school} | {edu.startDate} — {edu.endDate}
                                        </p>
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
                        <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">
                                Projects
                            </h3>
                            <div className="space-y-12">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="grid grid-cols-12 gap-8">
                                        <div className="col-span-3 text-right">
                                            {proj.link && (
                                                <span className="text-[10px] font-bold text-primary-600 break-all">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-9">
                                            <h4 className="text-xl font-medium text-gray-900 mb-1">{proj.name}</h4>
                                            {proj.technologies && (
                                                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                                                    {proj.technologies}
                                                </p>
                                            )}
                                            <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
                                                {proj.description}
                                            </p>
                                        </div>
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
                        <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-8 text-center">
                                Skills
                            </h3>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-xl mx-auto">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-sm font-medium tracking-widest uppercase text-gray-600"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'languages':
                if (!data.languages?.length) return null;
                return (
                    <PreviewSection key="languages" sectionId="languages" onClick={onSectionClick} title="Languages">
                         <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 text-center">
                                Languages
                            </h3>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-xl mx-auto">
                                {data.languages.map((lang) => (
                                    <span key={lang} className="text-sm font-medium tracking-widest uppercase text-gray-600">{lang}</span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <PreviewSection key="certifications" sectionId="certifications" onClick={onSectionClick} title="Certifications">
                         <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 text-center">
                                Certifications
                            </h3>
                            <div className="space-y-2 text-center">
                                {data.certifications.map((cert) => (
                                    <p key={cert} className="text-sm font-medium text-gray-700">{cert}</p>
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
                            <section style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                                <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 text-center">
                                    {customSec.title}
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-center max-w-2xl mx-auto text-gray-600 prose prose-sm max-w-none prose-p:my-1`}
                                    dangerouslySetInnerHTML={{ __html: customSec.content }}
                                />
                            </section>
                        </PreviewSection>
                    );
                }
                return null;
        }
    };

    const renderedSections = data.sections
        ? data.sections
            .filter(s => s.isVisible && s.id !== 'personal')
            .map(s => renderSectionContent(s.id))
        : [
            renderSectionContent('summary'),
            renderSectionContent('experience'),
            renderSectionContent('education'),
            renderSectionContent('projects'),
            renderSectionContent('skills'),
          ];

    return (
        <div
            id="resume-content"
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 leading-relaxed"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                padding: `${margins || 96}px`,
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Centered Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="text-center" style={{ marginBottom: `${sectionSpacing * 2}px` }}>
                    <h1
                        className="text-4xl font-light tracking-[0.2em] uppercase mb-4"
                        style={{ color: themeColor || '#374151' }}
                    >
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <div className="flex justify-center items-center gap-4 text-sm tracking-widest uppercase text-gray-400">
                        {personalInfo?.email && <span>{personalInfo.email}</span>}
                        {personalInfo?.email && personalInfo?.phone && <span className="w-1 h-1 bg-gray-300 rounded-full" />}
                        {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo?.website && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="lowercase">{personalInfo.website}</span>
                            </>
                        )}
                    </div>
                    {personalInfo?.address && (
                        <p className="mt-2 text-xs tracking-[0.3em] uppercase text-gray-400">
                            {personalInfo.address}
                        </p>
                    )}
                </header>
            </PreviewSection>

            <div className="space-y-16">
                {renderedSections}
            </div>
        </div>
    );
}
