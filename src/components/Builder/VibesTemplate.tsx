'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function VibesTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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

    const renderSidebarSection = (sectionId: string) => {
        switch (sectionId) {
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <PreviewSection key="skills" sectionId="skills" onClick={onSectionClick} title="Skills">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Skills</h3>
                            <div className="flex flex-col gap-3">
                                {skills.map((skill) => (
                                    <div key={skill} className="space-y-1">
                                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">{skill}</div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ backgroundColor: themeColor, width: '85%' }} />
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
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Education</h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold text-sm leading-tight text-gray-800">{edu.degree}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{edu.field}</p>
                                        <p className="text-[10px] font-black text-gray-400 mt-2 uppercase">
                                            {edu.startDate} — {edu.endDate}
                                        </p>
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
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Languages</h3>
                            <div className="space-y-2">
                                {data.languages.map((lang) => (
                                    <div key={lang} className="text-xs font-bold uppercase tracking-wider text-gray-600">{lang}</div>
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
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Certifications</h3>
                            <div className="space-y-3">
                                {data.certifications.map((cert) => (
                                    <div key={cert} className="text-[11px] font-medium leading-relaxed text-gray-600">
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            default:
                return null;
        }
    };

    const renderMainSection = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                if (!personalInfo?.summary) return null;
                return (
                    <PreviewSection key="summary" sectionId="summary" onClick={onSectionClick} title="Summary">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">About Me</h3>
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
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8 text-right pr-4 border-r-4 shrink-0 transition-colors duration-300" style={{ borderColor: themeColor }}>Experience</h3>
                            <div className="space-y-10">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-black text-gray-900">{exp.position}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold mb-4" style={{ color: themeColor }}>{exp.company}</div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
                                            {exp.description}
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
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8 text-right pr-4 border-r-4 shrink-0 transition-colors duration-300" style={{ borderColor: themeColor }}>Projects</h3>
                            <div className="space-y-10">
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
                                            <div className="text-sm font-bold mb-3 uppercase tracking-wide opacity-70" style={{ color: themeColor }}>
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
            default:
                if (sectionId.startsWith('custom-')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8 text-right pr-4 border-r-4 shrink-0 transition-colors duration-300" style={{ borderColor: themeColor }}>{customSec.title}</h3>
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

    const sidebarSectionIds = ['skills', 'education', 'languages', 'certifications'];
    const sidebarSections = (data.sections || [])
        .filter(s => s.isVisible && sidebarSectionIds.includes(s.id))
        .map(s => renderSidebarSection(s.id));

    const mainSections = (data.sections || [])
        .filter(s => s.isVisible && !sidebarSectionIds.includes(s.id) && s.id !== 'personal')
        .map(s => (
            <div key={s.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                {renderMainSection(s.id)}
            </div>
        ));

    return (
        <div
            id="resume-content"
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex flex-row-reverse text-gray-800 overflow-hidden"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Main Content (Left) */}
            <main
                className="flex-1 bg-white"
                style={{ padding: `${margins || 96}px` }}
            >
                <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                    <header className="mb-12">
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-gray-900 leading-none">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                            {personalInfo?.jobTitle || 'Your Professional Title'}
                        </h2>
                    </header>
                </PreviewSection>

                <div className="flex flex-col">
                    {mainSections}
                </div>
            </main>

            {/* Sidebar (Right) */}
            <aside
                className="w-[30%] bg-gray-50 flex flex-col border-r border-gray-100"
                style={{
                    padding: `${margins || 96}px ${(margins || 96) * 0.8}px`,
                    gap: `${sectionSpacing || 24}px`
                }}
            >
                {/* Avatar */}
                {personalInfo?.avatarUrl && (
                    <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 shrink-0">
                        <img 
                            src={personalInfo.avatarUrl} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} 
                        />
                    </div>
                )}

                {/* Contact */}
                <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Contact</h3>
                    <div className="space-y-4 text-sm font-bold text-gray-600">
                        {personalInfo?.email && <div className="flex items-center gap-3 shrink-0"><FaEnvelope style={{ color: themeColor }} className="shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-3 shrink-0"><FaPhone style={{ color: themeColor }} className="shrink-0" /> <span>{personalInfo.phone}</span></div>}
                        {personalInfo?.address && <div className="flex items-center gap-3 shrink-0"><FaMapMarkerAlt style={{ color: themeColor }} className="shrink-0" /> <span className="whitespace-pre-line">{personalInfo.address}</span></div>}
                        {personalInfo?.website && <div className="flex items-center gap-3 shrink-0"><FaGlobe style={{ color: themeColor }} className="shrink-0" /> <span className="break-all lowercase">{personalInfo.website}</span></div>}
                    </div>
                </section>

                {sidebarSections}
            </aside>
        </div>
    );
}
