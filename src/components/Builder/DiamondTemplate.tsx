'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function DiamondTemplate({ data }: { readonly data: ResumeState }) {
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
            {/* Bold Geometric Header */}
            <header className="relative mb-12 overflow-hidden rounded-2xl bg-gray-900 text-white p-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rotate-45 -translate-x-16 translate-y-16" />

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
                                <span>{personalInfo.website}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                {/* Summary */}
                {personalInfo?.summary && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-4 flex items-center gap-4">
                            Profile
                            <div className="h-px flex-1 bg-gray-100" />
                        </h3>
                        <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                            {personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                            Experience
                            <div className="h-px flex-1 bg-gray-100" />
                        </h3>
                        <div className="space-y-10">
                            {experiences?.map((exp) => (
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
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                            Education
                            <div className="h-px flex-1 bg-gray-100" />
                        </h3>
                        <div className="space-y-8">
                            {education?.map((edu) => (
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
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                            Skills
                            <div className="h-px flex-1 bg-gray-100" />
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            {skills?.map((skill) => (
                                <div key={skill} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: themeColor }} />
                                    <span className="text-sm font-bold text-gray-700">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
