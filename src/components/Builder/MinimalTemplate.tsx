'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

export default function MinimalTemplate({ data }: { data: ResumeState }) {
    const { personalInfo, experiences, education, skills, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-20 text-gray-700 leading-relaxed"
            style={{ fontFamily: fontFamily || 'serif' }}
        >
            {/* Centered Header */}
            <header className="text-center mb-16">
                <h1
                    className="text-4xl font-light tracking-[0.2em] uppercase mb-4"
                    style={{ color: themeColor || '#374151' }}
                >
                    {personalInfo.fullName}
                </h1>
                <div className="flex justify-center items-center gap-4 text-sm tracking-widest uppercase text-gray-400">
                    <span>{personalInfo.email}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{personalInfo.phone}</span>
                    {personalInfo.website && (
                        <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{personalInfo.website}</span>
                        </>
                    )}
                </div>
                <p className="mt-2 text-xs tracking-[0.3em] uppercase text-gray-400">
                    {personalInfo.address}
                </p>
            </header>

            <div className="space-y-16">
                {/* Summary */}
                <section>
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-6 text-center">
                        Profile
                    </h3>
                    <p className="text-center max-w-2xl mx-auto italic text-lg text-gray-600">
                        "{personalInfo.summary}"
                    </p>
                </section>

                {/* Experience */}
                <section>
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">
                        Experience
                    </h3>
                    <div className="space-y-12">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="grid grid-cols-12 gap-8">
                                <div className="col-span-3 text-right">
                                    <span className="text-sm font-medium tracking-tighter text-gray-400">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="col-span-9">
                                    <h4 className="text-xl font-medium text-gray-900 mb-1">{exp.position}</h4>
                                    <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">
                                        {exp.company}
                                    </p>
                                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-10 text-center">
                        Education
                    </h3>
                    <div className="space-y-8">
                        {education.map((edu) => (
                            <div key={edu.id} className="text-center">
                                <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                                <p className="text-sm text-gray-500 mb-1">{edu.field}</p>
                                <p className="text-xs tracking-widest uppercase text-gray-400">
                                    {edu.school} | {edu.startDate} — {edu.endDate}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-8 text-center">
                        Skills
                    </h3>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-xl mx-auto">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="text-sm font-medium tracking-widest uppercase text-gray-600"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
