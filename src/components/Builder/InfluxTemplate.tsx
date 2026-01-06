'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function InfluxTemplate({ data }: { readonly data: ResumeState }) {
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
            {/* Professional Top Bar Header */}
            <header className="flex justify-between items-end mb-12 pb-8 border-b-8" style={{ borderColor: themeColor }}>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2 text-gray-900">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-2xl font-medium text-gray-500">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                </div>
                <div className="text-right space-y-1 text-sm font-bold text-gray-600">
                    {personalInfo?.email && <div className="flex items-center justify-end gap-2">{personalInfo.email} <FaEnvelope style={{ color: themeColor }} /></div>}
                    {personalInfo?.phone && <div className="flex items-center justify-end gap-2">{personalInfo.phone} <FaPhone style={{ color: themeColor }} /></div>}
                    {personalInfo?.address && <div className="flex items-center justify-end gap-2">{personalInfo.address} <FaMapMarkerAlt style={{ color: themeColor }} /></div>}
                    {personalInfo?.website && <div className="flex items-center justify-end gap-2">{personalInfo.website} <FaGlobe style={{ color: themeColor }} /></div>}
                </div>
            </header>

            <div className="flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                {/* Summary */}
                {personalInfo?.summary && (
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
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className="grid grid-cols-12 gap-8">
                        <div className="col-span-3">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Experience</h3>
                        </div>
                        <div className="col-span-9 space-y-8">
                            {experiences?.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-xl font-black text-gray-900">{exp.position}</h4>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
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
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section className="grid grid-cols-12 gap-8">
                        <div className="col-span-3">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Education</h3>
                        </div>
                        <div className="col-span-9 space-y-6">
                            {education?.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-lg font-black text-gray-900">{edu.school}</h4>
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

                {/* Skills */}
                {skills?.length > 0 && (
                    <section className="grid grid-cols-12 gap-8">
                        <div className="col-span-3">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Skills</h3>
                        </div>
                        <div className="col-span-9">
                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                {skills?.map((skill) => (
                                    <div key={skill} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                                        <span className="text-sm font-bold text-gray-700">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
