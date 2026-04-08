'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import PreviewSection from './PreviewSection';

export default function CascadeTemplate({ data, onSectionClick }: { readonly data: ResumeState; readonly onSectionClick?: (sectionId: string) => void }) {
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

    // Helper to render sidebar items
    const renderSidebarSection = (sectionId: string) => {
        switch (sectionId) {
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <PreviewSection key="skills" sectionId="skills" onClick={onSectionClick} title="Skills">
                        <section>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                                Skills
                            </h3>
                            <div className="space-y-3">
                                {skills.map((skill) => (
                                    <div key={skill} className="flex flex-col gap-1">
                                        <span className="text-xs font-bold uppercase tracking-wider">{skill}</span>
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[85%] opacity-80" />
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
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold text-sm leading-tight">{edu.degree}</h4>
                                        <p className="text-xs opacity-80 mt-1">{edu.field}</p>
                                        <p className="text-xs opacity-60 mt-1">{edu.school}</p>
                                        <p className="text-[10px] font-black opacity-40 mt-2 uppercase">
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
                             <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                                 Languages
                             </h3>
                             <div className="space-y-2">
                                 {data.languages.map((lang) => (
                                     <div key={lang} className="text-xs font-bold uppercase tracking-wider opacity-80">{lang}</div>
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
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                                Certifications
                            </h3>
                            <div className="space-y-4">
                                {data.certifications.map((cert) => (
                                    <div key={cert} className="text-xs font-medium leading-relaxed opacity-80">
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

    // Helper to render main content items
    const renderMainSection = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                if (!personalInfo?.summary) return null;
                return (
                    <PreviewSection key="summary" sectionId="summary" onClick={onSectionClick} title="Summary">
                        <section>
                            <h3
                                className="text-lg font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4"
                                style={{ color: themeColor || '#2d3748' }}
                            >
                                Profile
                                <div className="h-[2px] flex-1 bg-gray-100" />
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
                        <section>
                            <h3
                                className="text-lg font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4"
                                style={{ color: themeColor || '#2d3748' }}
                            >
                                Experience
                                <div className="h-[2px] flex-1 bg-gray-100" />
                            </h3>
                            <div className="space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm font-bold uppercase tracking-wider mb-4"
                                            style={{ color: themeColor || '#2d3748' }}
                                        >
                                            {exp.company}
                                        </p>
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
                            <h3
                                className="text-lg font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4"
                                style={{ color: themeColor || '#2d3748' }}
                            >
                                Projects
                                <div className="h-[2px] flex-1 bg-gray-100" />
                            </h3>
                            <div className="space-y-8">
                                {data.projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">{proj.name}</h4>
                                            {proj.link && (
                                                <span className="text-xs font-black text-primary-600 uppercase tracking-widest shrink-0">
                                                    {proj.link}
                                                </span>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <p className="text-sm font-bold uppercase tracking-wider mb-4 opacity-70">
                                                {proj.technologies}
                                            </p>
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
                if (sectionId.startsWith('custom-') || sectionId.startsWith('custom_')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <PreviewSection key={sectionId} sectionId={sectionId} onClick={onSectionClick} title={customSec.title}>
                            <section>
                                <h3
                                    className="text-lg font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4"
                                    style={{ color: themeColor || '#2d3748' }}
                                >
                                    {customSec.title}
                                    <div className="h-[2px] flex-1 bg-gray-100" />
                                </h3>
                                <div 
                                    className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 prose prose-sm max-w-none`}
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
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                lineHeight: lineSpacing
            }}
        >
            {/* Sidebar */}
            <aside
                className="w-[35%] text-white flex flex-col gap-10"
                style={{
                    backgroundColor: themeColor || '#2d3748',
                    padding: `${margins || 96}px ${(margins || 96) * 0.8}px`
                }}
            >
                {/* Contact - Always at top of sidebar */}
                <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                    <section>
                        {/* Avatar */}
                        {personalInfo?.avatarUrl && (
                            <div className="w-full aspect-square rounded-full border-4 border-white/20 overflow-hidden shadow-2xl mb-8">
                                <img 
                                    src={personalInfo.avatarUrl} 
                                    alt={personalInfo?.fullName || 'Profile'} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} 
                                />
                            </div>
                        )}
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                            Contact
                        </h3>
                        <div className="space-y-4 text-sm font-medium">
                            {personalInfo?.email && (
                                <div className="flex items-start gap-3">
                                    <FaEnvelope className="mt-1 opacity-70 shrink-0" />
                                    <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-start gap-3">
                                    <FaPhone className="mt-1 opacity-70 shrink-0" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo?.address && (
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="mt-1 opacity-70 shrink-0" />
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-start gap-3">
                                    <FaGlobe className="mt-1 opacity-70 shrink-0" />
                                    <span className="break-all lowercase">{personalInfo.website}</span>
                                </div>
                            )}
                        </div>
                    </section>
                </PreviewSection>

                {sidebarSections}
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 bg-white overflow-hidden"
                style={{ padding: `${margins || 96}px` }}
            >
                <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                    <header style={{ marginBottom: `${sectionSpacing * 1.5}px` }}>
                        <h1
                            className="text-5xl font-black tracking-tighter uppercase mb-2"
                            style={{ color: themeColor || '#2d3748' }}
                        >
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-2xl font-medium text-gray-500 tracking-wide uppercase">
                            {personalInfo?.jobTitle || 'Professional Title'}
                        </h2>
                    </header>
                </PreviewSection>

                <div className="flex flex-col">
                    {mainSections}
                </div>
            </main>
        </div>
    );
}
