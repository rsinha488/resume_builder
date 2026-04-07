'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import PreviewSection from './PreviewSection';

export default function MuseTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
                        <section className="max-w-2xl mx-auto text-center">
                            <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 italic font-serif whitespace-pre-line`}>
                                "{personalInfo.summary}"
                            </p>
                        </section>
                    </PreviewSection>
                );
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <PreviewSection key="experience" sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-10 text-center">Professional Experience</h3>
                            <div className="space-y-12">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <div>
                                                <h4 className="text-2xl font-serif text-gray-900 mb-1">{exp.position}</h4>
                                                <div className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>{exp.company}</div>
                                            </div>
                                            <span className="text-xs font-serif italic text-gray-400 shrink-0">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed font-serif`}>
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-10 text-center">Academic Background</h3>
                            <div className="grid grid-cols-2 gap-12">
                                {education.map((edu) => (
                                    <div key={edu.id} className="text-center">
                                        <h4 className="text-xl font-serif text-gray-900 mb-2 leading-tight">{edu.school}</h4>
                                        <div className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 font-serif italic`}>
                                            <span className="font-bold">{edu.degree}</span> in {edu.field}
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                            {edu.startDate} — {edu.endDate}
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-10 text-center">Key Projects</h3>
                            <div className="space-y-12">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="text-center max-w-2xl mx-auto">
                                        <h4 className="text-2xl font-serif text-gray-900 mb-2">{proj.name}</h4>
                                        {proj.link && (
                                            <div className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2 italic">
                                                {proj.link}
                                            </div>
                                        )}
                                        {proj.technologies && (
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                                {proj.technologies}
                                            </div>
                                        )}
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed font-serif`}>
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-8 text-center">Expertise</h3>
                            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                                {skills.map((skill) => (
                                    <div key={skill} className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-serif italic text-gray-700">{skill}</span>
                                        <div className="w-8 h-0.5" style={{ backgroundColor: themeColor }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'languages':
                if (!data.languages?.length) return null;
                return (
                    <PreviewSection key="languages" sectionId="languages" onClick={onSectionClick} title="Languages">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-6 text-center">Languages</h3>
                            <div className="flex justify-center gap-8 text-sm italic font-serif text-gray-700">
                                {data.languages.map((lang) => (
                                    <span key={lang}>{lang}</span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <PreviewSection key="certifications" sectionId="certifications" onClick={onSectionClick} title="Certifications">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-6 text-center">Certifications</h3>
                            <div className="space-y-4 text-center max-w-xl mx-auto italic font-serif text-gray-600">
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
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-6 text-center">{customSec.title}</h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 prose prose-sm max-w-none font-serif text-center italic mx-auto`}
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
        .map(s => (
            <div key={s.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                {renderSectionContent(s.id)}
            </div>
        ));

    return (
        <div
            id="resume-content"
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                padding: `${margins || 96}px`,
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Elegant Serif Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="text-center mb-16">
                    <h1 className="text-6xl font-serif italic tracking-tight mb-4 text-gray-900 leading-none">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="h-px w-12 bg-gray-200" />
                        <h2 className="text-lg font-bold uppercase tracking-[0.4em] text-gray-400">
                            {personalInfo?.jobTitle || 'Your Professional Title'}
                        </h2>
                        <div className="h-px w-12 bg-gray-200" />
                    </div>

                    <div className="flex justify-center gap-8 text-sm font-serif italic text-gray-500 pb-8 border-b border-gray-50">
                        {personalInfo?.email && <span className="hover:text-primary-600 transition-colors">{personalInfo.email}</span>}
                        {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo?.address && <span className="whitespace-pre-line">{personalInfo.address}</span>}
                        {personalInfo?.website && <span className="lowercase hover:text-primary-600 transition-colors">{personalInfo.website}</span>}
                    </div>
                </header>
            </PreviewSection>

            <div className="flex flex-col">
                {renderedSections}
            </div>
        </div>
    );
}
