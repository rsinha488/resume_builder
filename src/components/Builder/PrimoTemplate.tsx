'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function PrimoTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Professional Profile
                            </h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed whitespace-pre-line`}>
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
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Work History
                            </h3>
                            <div className="flex flex-col space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                                        <div
                                            className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white"
                                            style={{ backgroundColor: themeColor || '#1a365d' }}
                                        />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                                                <p className="text-lg font-semibold text-gray-700">{exp.company}</p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider shrink-0">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed`}>
                                            {exp.description}
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
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Expertise
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-sm font-bold uppercase tracking-tight border border-gray-100"
                                    >
                                        {skill}
                                    </span>
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
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold text-gray-900 leading-tight">{edu.degree}</h4>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">{edu.field}</p>
                                        <p className="text-sm text-gray-500">{edu.school}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">
                                            {edu.startDate} — {edu.endDate}
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
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Key Projects
                            </h3>
                            <div className="flex flex-col space-y-8">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="relative pl-6 border-l-2 border-gray-100">
                                        <div
                                            className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white"
                                            style={{ backgroundColor: themeColor || '#1a365d' }}
                                        />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">{proj.name}</h4>
                                                {proj.link && <p className="text-sm font-semibold text-primary-600">{proj.link}</p>}
                                            </div>
                                        </div>
                                        {proj.technologies && (
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                                {proj.technologies}
                                            </p>
                                        )}
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed whitespace-pre-line`}>
                                            {proj.description}
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
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {data.languages.map((lang) => (
                                    <span key={lang} className="text-sm font-bold text-gray-700 uppercase tracking-widest">{lang}</span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <PreviewSection key="certifications" sectionId="certifications" onClick={onSectionClick} title="Certifications">
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Certifications
                            </h3>
                            <div className="space-y-3">
                                {data.certifications.map((cert) => (
                                    <div key={cert} className="text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded border-l-4" style={{ borderColor: themeColor }}>
                                        {cert}
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
                            <section style={{ marginBottom: `${sectionSpacing}px` }}>
                                <h3
                                    className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                                    style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                                >
                                    {customSec.title}
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed prose prose-sm max-w-none`}
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
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Left Sidebar — 30% */}
            <div
                className="text-white flex-shrink-0"
                style={{
                    width: '32%',
                    backgroundColor: themeColor || '#2d3748',
                    padding: `${margins || 40}px ${(margins || 40) * 0.8}px`
                }}
            >
                <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                    <div className="flex flex-col">
                        {personalInfo?.avatarUrl && (
                            <div className="w-28 h-28 rounded-2xl border-4 border-white/30 overflow-hidden shadow-xl mb-8 mx-auto shrink-0">
                                <img 
                                    src={personalInfo.avatarUrl} 
                                    alt={personalInfo.fullName || 'Profile'} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} 
                                />
                            </div>
                        )}

                        <h1 className="text-3xl font-black tracking-tight mb-2 uppercase break-words leading-tight">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-sm font-bold opacity-80 tracking-widest uppercase mb-12">
                            {personalInfo?.jobTitle || 'Professional Title'}
                        </h2>

                        <div className="flex flex-col gap-5 text-sm font-medium">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b border-white/10 pb-2 mb-1">Information</h3>
                            {personalInfo?.email && (
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="opacity-70 flex-shrink-0" />
                                    <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-center gap-3">
                                    <FaPhone className="opacity-70 flex-shrink-0" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo?.address && (
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="opacity-70 flex-shrink-0" />
                                    <span className="whitespace-pre-line">{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-center gap-3">
                                    <FaGlobe className="opacity-70 flex-shrink-0" />
                                    <span className="break-all lowercase">{personalInfo.website}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </PreviewSection>
            </div>

            {/* Right Content — 70% */}
            <div
                className="flex-1 bg-white"
                style={{ padding: `${margins || 40}px` }}
            >
                <div className="flex flex-col">
                    {renderedSections}
                </div>
            </div>
        </div>
    );
}
