'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function ModernTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-3 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                Professional Summary
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
                        <section style={{ marginBottom: `${sectionSpacing}px` }}>
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                Work Experience
                            </h3>
                            <div className="space-y-6">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900">{exp.position}</h4>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 whitespace-pre-line leading-relaxed`}>
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
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                Education
                            </h3>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900">{edu.school}</h4>
                                            <span className="text-xs font-semibold text-gray-500 uppercase">
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                        <div className={`${fontSizeMap[fontSize || 'medium']}`}>
                                            <span className="font-semibold">{edu.degree}</span> in {edu.field}
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
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                Projects
                            </h3>
                            <div className="space-y-6">
                                {data.projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900">{proj.name}</h4>
                                            {proj.link && (
                                                <span className="text-xs font-semibold text-primary-600">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {proj.technologies.split(',').map((tech, idx) => (
                                                    <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 whitespace-pre-line leading-relaxed`}>
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
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded uppercase tracking-wider"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            default:
                if (sectionId.startsWith('custom-') || sectionId.startsWith('custom_') || sectionId.startsWith('custom_')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section style={{ marginBottom: `${sectionSpacing}px` }}>
                                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                                    {customSec.title}
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5`}
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
            .filter(s => s.isVisible && s.id !== 'personal') // personal is always in header
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
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                padding: `${margins || 0}px`,
                lineHeight: lineSpacing || 1.15
            }}
        >
            {/* Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="border-b-4 pb-8 mb-8 flex justify-between items-start" style={{ borderColor: themeColor }}>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-xl font-medium text-gray-600 mb-4">
                            {personalInfo?.jobTitle || 'Your Professional Title'}
                        </h2>

                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                            {personalInfo?.email && (
                                <div className="flex items-center gap-2">
                                    <FaEnvelope style={{ color: themeColor }} /> {personalInfo.email}
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <FaPhone style={{ color: themeColor }} /> {personalInfo.phone}
                                </div>
                            )}
                            {personalInfo?.address && (
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt style={{ color: themeColor }} /> {personalInfo.address}
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-center gap-2">
                                    <FaGlobe style={{ color: themeColor }} /> {personalInfo.website}
                                </div>
                            )}
                        </div>
                    </div>

                    {personalInfo?.avatarUrl && (
                        <div className="ml-8 w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                            <img src={personalInfo.avatarUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                        </div>
                    )}
                </header>
            </PreviewSection>

            {renderedSections}
        </div>
    );
}
