'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function DiamondTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-4">
                                Profile
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                                {personalInfo.summary}
                            </p>
                        </section>
                    </PreviewSection>
                );
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <PreviewSection key="experience" sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                                Experience
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <div className="space-y-10">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="grid grid-cols-12 gap-6">
                                        <div className="col-span-3">
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="col-span-9">
                                            <h4 className="font-black text-gray-900 text-xl mb-1">{exp.position}</h4>
                                            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>{exp.company}</div>
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                                Education
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <div className="space-y-8">
                                {education.map((edu) => (
                                    <div key={edu.id} className="grid grid-cols-12 gap-6">
                                        <div className="col-span-3">
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                        <div className="col-span-9">
                                            <h4 className="font-black text-gray-900 text-lg mb-1">{edu.school}</h4>
                                            <div className={`${fontSizeMap[fontSize || 'medium']} text-gray-600`}>
                                                <span className="font-bold">{edu.degree}</span> in {edu.field}
                                            </div>
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
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                                Projects
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <div className="space-y-10">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="grid grid-cols-12 gap-6">
                                        <div className="col-span-3">
                                            {proj.link && (
                                                <span className="text-[10px] font-bold text-primary-600 break-all uppercase tracking-widest">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-9">
                                            <h4 className="font-black text-gray-900 text-xl mb-1">{proj.name}</h4>
                                            {proj.technologies && (
                                                <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: themeColor }}>
                                                    {proj.technologies}
                                                </div>
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                                Skills
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                {skills.map((skill) => (
                                    <div key={skill} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: themeColor }} />
                                        <span className="text-sm font-bold text-gray-700">{skill}</span>
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
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-4">
                                Languages
                                <div className="h-px flex-1 bg-gray-100" />
                            </h3>
                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                {data.languages.map((lang, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{lang}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            default:
                if (sectionId.startsWith('custom-') || sectionId.startsWith('custom_')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-4">
                                    {customSec.title}
                                    <div className="h-px flex-1 bg-gray-100" />
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 prose prose-sm max-w-none`}
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
            {/* Bold Geometric Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="relative mb-12 overflow-hidden rounded-2xl bg-gray-900 text-white p-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 translate-x-32 -translate-y-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rotate-45 -translate-x-16 translate-y-16 pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-5xl font-black tracking-tighter mb-2">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <div className="h-1 w-20 mb-4" style={{ backgroundColor: themeColor }} />
                        <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
                            {personalInfo?.jobTitle || 'Your Professional Title'}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-300">
                            {personalInfo?.email && (
                                <div className="flex items-center gap-2">
                                    <FaEnvelope className="text-gray-500" />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <FaPhone className="text-gray-500" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo?.address && (
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-500" />
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-center gap-2">
                                    <FaGlobe className="text-gray-500" />
                                    <span className="lowercase">{personalInfo.website}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </PreviewSection>

            <div className="space-y-4">
                {renderedSections}
            </div>
        </div>
    );
}
