'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaGithub } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function ConceptTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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

    const renderSectionContent = (sectionId: string, index: number) => {
        const stepNumber = (index + 1).toString().padStart(2, '0');
        
        switch (sectionId) {
            case 'summary':
                if (!personalInfo?.summary) return null;
                return (
                    <PreviewSection key="summary" sectionId="summary" onClick={onSectionClick} title="Summary">
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Profile
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
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Experience
                            </h3>
                            <div className="space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: themeColor }} />
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 text-lg">{exp.position}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold mb-3" style={{ color: themeColor }}>{exp.company}</div>
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
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900">{edu.school}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
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
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Projects
                            </h3>
                            <div className="space-y-8">
                                {data.projects.map((proj) => (
                                    <div key={proj.id} className="relative pl-6 border-l-2 border-gray-100">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: themeColor }} />
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 text-lg">{proj.name}</h4>
                                            {proj.link && (
                                                <span className="text-xs font-black text-primary-600 uppercase tracking-widest">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: themeColor }}>
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
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase tracking-wider"
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
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Languages
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {data.languages.map((lang) => (
                                    <span key={lang} className="text-sm font-bold text-gray-700 uppercase tracking-wide">{lang}</span>
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
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                    {stepNumber}
                                </span>
                                Certifications
                            </h3>
                            <div className="space-y-3">
                                {data.certifications.map((cert) => (
                                    <div key={cert} className="text-sm font-medium text-gray-700 p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: themeColor }}>
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                );
            default:
                if (sectionId.startsWith('custom-') || data.sections.find(s => s.id === sectionId)?.type === 'custom') {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section>
                                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
                                        {stepNumber}
                                    </span>
                                    {customSec.title}
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
        .map((s, idx) => (
            <div key={s.id} style={{ marginBottom: `${sectionSpacing}px` }}>
                {renderSectionContent(s.id, idx)}
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
            {/* Top Bar Header */}
            <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-black tracking-tighter mb-2" style={{ color: themeColor }}>
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-600 border-y py-6 border-gray-100">
                        {personalInfo?.email && (
                            <div className="flex items-center gap-2">
                                <FaEnvelope style={{ color: themeColor }} /> <span>{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div className="flex items-center gap-2">
                                <FaPhone style={{ color: themeColor }} /> <span>{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo?.address && (
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt style={{ color: themeColor }} /> <span>{personalInfo.address}</span>
                            </div>
                        )}
                        {personalInfo?.website && (
                            <div className="flex items-center gap-2">
                                <FaGlobe style={{ color: themeColor }} /> <span className="lowercase">{personalInfo.website}</span>
                            </div>
                        )}
                    </div>
                </header>
            </PreviewSection>

            <div className="space-y-4">
                {renderedSections}
            </div>

            {/* Social - Keeping it simple at bottom if not in sections */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <FaLinkedin size={18} style={{ color: themeColor }} /> <span>LinkedIn Profile</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <FaGithub size={18} style={{ color: themeColor }} /> <span>GitHub Portfolio</span>
                </div>
            </div>
        </div>
    );
}
