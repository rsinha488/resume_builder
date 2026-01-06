'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function ConceptTemplate({ data }: { readonly data: ResumeState }) {
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
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                padding: `${margins}px`,
                lineHeight: lineSpacing
            }}
        >
            {/* Top Bar Header */}
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-black tracking-tight mb-2" style={{ color: themeColor }}>
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <h2 className="text-xl font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">
                    {personalInfo?.jobTitle || 'Your Professional Title'}
                </h2>

                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600 border-y py-4 border-gray-100">
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
                            <FaGlobe style={{ color: themeColor }} /> <span>{personalInfo.website}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="col-span-8 flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                                    01
                                </span>
                                Profile
                            </h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experiences?.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                                    02
                                </span>
                                Experience
                            </h3>
                            <div className="space-y-8">
                                {experiences?.map((exp) => (
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
                    )}

                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                                    03
                                </span>
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education?.map((edu) => (
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
                    )}
                </div>

                {/* Sidebar */}
                <div className="col-span-4 flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: themeColor }}>
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills?.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold uppercase tracking-wider"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Social */}
                    <section>
                        <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: themeColor }}>
                            Social
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FaLinkedin style={{ color: themeColor }} /> <span>linkedin.com/in/username</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <FaGithub style={{ color: themeColor }} /> <span>github.com/username</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
