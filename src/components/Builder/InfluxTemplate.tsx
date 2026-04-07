'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function InfluxTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Profile</h3>
                            </div>
                            <div className="col-span-9">
                                <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                                    {personalInfo.summary}
                                </p>
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <PreviewSection key="experience" sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Experience</h3>
                            </div>
                            <div className="col-span-9 space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-black text-gray-900">{exp.position}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-md font-bold mb-4" style={{ color: themeColor }}>{exp.company}</div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
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
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Education</h3>
                            </div>
                            <div className="col-span-9 space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-lg font-black text-gray-900">{edu.school}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                        <div className={`${fontSizeMap[fontSize || 'medium']} text-gray-600`}>
                                            <span className="font-bold">{edu.degree}</span> in {edu.field}
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
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Projects</h3>
                            </div>
                            <div className="col-span-9 space-y-8">
                                {data.projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-black text-gray-900">{proj.name}</h4>
                                            {proj.link && (
                                                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest shrink-0">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <div className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: themeColor }}>
                                                {proj.technologies}
                                            </div>
                                        )}
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
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
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Skills</h3>
                            </div>
                            <div className="col-span-9">
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    {skills.map((skill) => (
                                        <div key={skill} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                                            <span className="text-sm font-bold text-gray-700">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'languages':
                if (!data.languages?.length) return null;
                return (
                    <PreviewSection key="languages" sectionId="languages" onClick={onSectionClick} title="Languages">
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Languages</h3>
                            </div>
                            <div className="col-span-9">
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {data.languages.map((lang) => (
                                        <span key={lang} className="text-sm font-bold text-gray-700 uppercase">{lang}</span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <PreviewSection key="certifications" sectionId="certifications" onClick={onSectionClick} title="Certifications">
                        <section className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Certifications</h3>
                            </div>
                            <div className="col-span-9 space-y-2">
                                {data.certifications.map((cert) => (
                                    <p key={cert} className="text-sm font-black text-gray-700 uppercase tracking-widest">{cert}</p>
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
                            <section className="grid grid-cols-12 gap-8">
                                <div className="col-span-3">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">{customSec.title}</h3>
                                </div>
                                <div className="col-span-9">
                                    <div 
                                        className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 prose prose-sm max-w-none`}
                                        dangerouslySetInnerHTML={{ __html: customSec.content }}
                                    />
                                </div>
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
            {/* Professional Top Bar Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="flex justify-between items-end mb-16 pb-12 border-b-8" style={{ borderColor: themeColor }}>
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-4 text-gray-900 leading-none">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-wider">
                            {personalInfo?.jobTitle || 'Your Professional Title'}
                        </h2>
                    </div>
                    <div className="text-right space-y-2 text-sm font-black text-gray-600 uppercase tracking-widest shrink-0 pb-1">
                        {personalInfo?.email && <div className="flex items-center justify-end gap-3">{personalInfo.email} <FaEnvelope style={{ color: themeColor }} /></div>}
                        {personalInfo?.phone && <div className="flex items-center justify-end gap-3">{personalInfo.phone} <FaPhone style={{ color: themeColor }} /></div>}
                        {personalInfo?.address && <div className="flex items-center justify-end gap-3">{personalInfo.address} <FaMapMarkerAlt style={{ color: themeColor }} /></div>}
                        {personalInfo?.website && <div className="flex items-center justify-end gap-3"><span className="lowercase">{personalInfo.website}</span> <FaGlobe style={{ color: themeColor }} /></div>}
                    </div>
                </header>
            </PreviewSection>

            <div className="space-y-4">
                {renderedSections}
            </div>
        </div>
    );
}
