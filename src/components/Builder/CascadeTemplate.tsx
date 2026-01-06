'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function CascadeTemplate({ data }: { readonly data: ResumeState }) {
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
            {/* Sidebar */}
            <aside
                className="w-[35%] text-white flex flex-col gap-10"
                style={{
                    backgroundColor: themeColor || '#2d3748',
                    padding: `${margins}px ${margins * 0.8}px`
                }}
            >
                {/* Avatar */}
                {personalInfo?.avatarUrl && (
                    <div className="w-full aspect-square rounded-full border-4 border-white/20 overflow-hidden shadow-2xl">
                        <img src={personalInfo.avatarUrl} alt={personalInfo?.fullName || 'Profile'} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Contact */}
                <section>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                        Contact
                    </h3>
                    <div className="space-y-4 text-sm">
                        {personalInfo?.email && (
                            <div className="flex items-start gap-3">
                                <FaEnvelope className="mt-1 opacity-70" />
                                <span className="break-all">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div className="flex items-start gap-3">
                                <FaPhone className="mt-1 opacity-70" />
                                <span>{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo?.address && (
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 opacity-70" />
                                <span>{personalInfo.address}</span>
                            </div>
                        )}
                        {personalInfo?.website && (
                            <div className="flex items-start gap-3">
                                <FaGlobe className="mt-1 opacity-70" />
                                <span className="break-all">{personalInfo.website}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                        Skills
                    </h3>
                    <div className="space-y-3">
                        {skills?.map((skill) => (
                            <div key={skill} className="flex flex-col gap-1">
                                <span className="text-xs font-bold uppercase tracking-wider">{skill}</span>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[85%] opacity-80" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-white/20">
                        Education
                    </h3>
                    <div className="space-y-6">
                        {education?.map((edu) => (
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
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 bg-white"
                style={{ padding: `${margins}px` }}
            >
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

                <div style={{ gap: `${sectionSpacing}px` }} className="flex flex-col">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section>
                            <h3
                                className="text-lg font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4"
                                style={{ color: themeColor || '#2d3748' }}
                            >
                                Profile
                                <div className="h-[2px] flex-1 bg-gray-100" />
                            </h3>
                            <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 leading-relaxed`}>
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    <section>
                        <h3
                            className="text-lg font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-4"
                            style={{ color: themeColor || '#2d3748' }}
                        >
                            Experience
                            <div className="h-[2px] flex-1 bg-gray-100" />
                        </h3>
                        <div style={{ gap: `${sectionSpacing * 0.8}px` }} className="flex flex-col">
                            {experiences?.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
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
                </div>
            </main>
        </div>
    );
}
