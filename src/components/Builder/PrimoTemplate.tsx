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

    return (
        <div
            id="resume-content"
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                lineHeight: lineSpacing
            }}
        >
            {/* Left Sidebar — 30% */}
            <div
                className="text-white flex-shrink-0"
                style={{
                    width: '30%',
                    backgroundColor: themeColor || '#2d3748',
                    padding: `${margins || 40}px ${(margins || 40) * 0.8}px`
                }}
            >
                <PreviewSection sectionId="personal" onClick={onSectionClick} title="Personal Info">
                    <div className="flex flex-col">
                        {personalInfo?.avatarUrl && (
                            <div className="w-24 h-24 rounded-2xl border-4 border-white/30 overflow-hidden shadow-xl mb-6 mx-auto">
                                <img src={personalInfo.avatarUrl} alt={personalInfo.fullName || 'Profile'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                            </div>
                        )}

                        <h1 className="text-2xl font-black tracking-tight mb-1 uppercase break-words">
                            {personalInfo?.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-sm font-medium opacity-90 tracking-wide uppercase mb-8">
                            {personalInfo?.jobTitle || 'Professional Title'}
                        </h2>

                        <div className="flex flex-col gap-3 text-xs font-medium">
                            {personalInfo?.email && (
                                <div className="flex items-center gap-2">
                                    <FaEnvelope className="opacity-70 flex-shrink-0" />
                                    <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <FaPhone className="opacity-70 flex-shrink-0" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo?.address && (
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="opacity-70 flex-shrink-0" />
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo?.website && (
                                <div className="flex items-center gap-2">
                                    <FaGlobe className="opacity-70 flex-shrink-0" />
                                    <span className="break-all">{personalInfo.website}</span>
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
                {/* Main Content */}
                <div style={{ gap: `${sectionSpacing}px` }} className="flex flex-col">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <PreviewSection sectionId="summary" onClick={onSectionClick} title="Summary">
                            <section>
                                <h3
                                    className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                                    style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                                >
                                    Professional Profile
                                </h3>
                                <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed`}>
                                    {personalInfo.summary}
                                </p>
                            </section>
                        </PreviewSection>
                    )}

                    {/* Experience */}
                    <PreviewSection sectionId="experience" onClick={onSectionClick} title="Experience">
                        <section>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Work History
                            </h3>
                            <div style={{ gap: `${sectionSpacing * 0.8}px` }} className="flex flex-col">
                                {experiences?.map((exp) => (
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
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                                {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed whitespace-pre-line`}>
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>
                </div>

                {/* Skills & Education */}
                <div style={{ gap: `${sectionSpacing}px` }} className="flex flex-col">
                    {/* Skills */}
                    <PreviewSection sectionId="skills" onClick={onSectionClick} title="Skills">
                        <section>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills?.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-bold uppercase tracking-tight"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </PreviewSection>

                    {/* Education */}
                    <PreviewSection sectionId="education" onClick={onSectionClick} title="Education">
                        <section>
                            <h3
                                className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                                style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                            >
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education?.map((edu) => (
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
                </div>
            </div>
        </div>
    );
}
