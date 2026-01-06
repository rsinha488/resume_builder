'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

export default function MuseTemplate({ data }: { readonly data: ResumeState }) {
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
                fontFamily: fontFamily || 'serif',
                padding: `${margins}px`,
                lineHeight: lineSpacing
            }}
        >
            {/* Elegant Serif Header */}
            <header className="text-center mb-16">
                <h1 className="text-6xl font-serif italic tracking-tight mb-4 text-gray-900">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-gray-200" />
                    <h2 className="text-lg font-bold uppercase tracking-[0.4em] text-gray-400">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                    <div className="h-px w-12 bg-gray-200" />
                </div>

                <div className="flex justify-center gap-8 text-sm font-serif italic text-gray-500">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.address && <span>{personalInfo.address}</span>}
                </div>
            </header>

            <div className="flex flex-col" style={{ gap: `${sectionSpacing}px` }}>
                {/* Summary */}
                {personalInfo?.summary && (
                    <section className="max-w-2xl mx-auto text-center">
                        <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 italic font-serif`}>
                            "{personalInfo.summary}"
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-10 text-center">Professional Experience</h3>
                        <div className="space-y-12">
                            {experiences?.map((exp) => (
                                <div key={exp.id} className="relative">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <div>
                                            <h4 className="text-2xl font-serif text-gray-900 mb-1">{exp.position}</h4>
                                            <div className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>{exp.company}</div>
                                        </div>
                                        <span className="text-xs font-serif italic text-gray-400">
                                            {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 whitespace-pre-line leading-relaxed font-serif`}>
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
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-10 text-center">Academic Background</h3>
                        <div className="grid grid-cols-2 gap-12">
                            {education?.map((edu) => (
                                <div key={edu.id} className="text-center">
                                    <h4 className="text-xl font-serif text-gray-900 mb-2">{edu.school}</h4>
                                    <div className={`${fontSizeMap[fontSize || 'medium']} text-gray-600 font-serif italic`}>
                                        <span className="font-bold">{edu.degree}</span> in {edu.field}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                        {edu.startDate} — {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-8 text-center">Expertise</h3>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                            {skills?.map((skill) => (
                                <div key={skill} className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-serif italic text-gray-700">{skill}</span>
                                    <div className="w-8 h-0.5" style={{ backgroundColor: themeColor }} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
