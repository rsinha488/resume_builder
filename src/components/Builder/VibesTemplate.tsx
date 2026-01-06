'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function VibesTemplate({ data }: { readonly data: ResumeState }) {
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
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{
                fontFamily: fontFamily || 'sans-serif',
                lineHeight: lineSpacing
            }}
        >
            {/* Main Content (Left) */}
            <main
                className="flex-1 bg-white"
                style={{ padding: `${margins}px` }}
            >
                <header className="mb-12">
                    <h1 className="text-6xl font-black tracking-tighter mb-2 text-gray-900">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-bold uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                </header>

                <div className="flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">About Me</h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experiences?.length > 0 && (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8 text-right pr-4 border-r-4" style={{ borderColor: themeColor }}>Experience</h3>
                            <div className="space-y-10">
                                {experiences?.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="text-xl font-black text-gray-900">{exp.position}</h4>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
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
                    )}

                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8 text-right pr-4 border-r-4" style={{ borderColor: themeColor }}>Education</h3>
                            <div className="space-y-6">
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
                </div>
            </main>

            {/* Sidebar (Right) */}
            <aside
                className="w-[30%] bg-gray-50 flex flex-col"
                style={{
                    padding: `${margins}px ${margins * 0.8}px`,
                    gap: `${sectionSpacing}px`
                }}
            >
                {/* Avatar */}
                {personalInfo?.avatarUrl && (
                    <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
                        <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Contact */}
                <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Contact</h3>
                    <div className="space-y-4 text-sm font-medium text-gray-600">
                        {personalInfo?.email && <div className="flex items-center gap-3"><FaEnvelope style={{ color: themeColor }} /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-3"><FaPhone style={{ color: themeColor }} /> <span>{personalInfo.phone}</span></div>}
                        {personalInfo?.address && <div className="flex items-center gap-3"><FaMapMarkerAlt style={{ color: themeColor }} /> <span>{personalInfo.address}</span></div>}
                        {personalInfo?.website && <div className="flex items-center gap-3"><FaGlobe style={{ color: themeColor }} /> <span className="break-all">{personalInfo.website}</span></div>}
                    </div>
                </section>

                {/* Skills */}
                {skills?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Skills</h3>
                        <div className="flex flex-col gap-3">
                            {skills?.map((skill) => (
                                <div key={skill} className="space-y-1">
                                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">{skill}</div>
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ backgroundColor: themeColor, width: '85%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>
        </div>
    );
}
