import { ResumeState } from '@/lib/features/resume/resumeSlice';

export default function ClassicTemplate({ data }: { data: ResumeState }) {
    const { personalInfo, experiences, education, skills, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-16 text-gray-800"
            style={{ fontFamily: fontFamily || 'serif' }}
        >
            {/* Header */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600 italic">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.address && <span>• {personalInfo.address}</span>}
                    {personalInfo.website && <span>• {personalInfo.website}</span>}
                </div>
            </header>

            {/* Summary */}
            {personalInfo.summary && (
                <section className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                        Professional Summary
                    </h3>
                    <p className="text-sm leading-relaxed text-justify">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                        Experience
                    </h3>
                    <div className="space-y-8">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">{exp.company}</h4>
                                    <span className="text-sm italic">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-md font-medium italic mb-2" style={{ color: themeColor }}>{exp.position}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                        Education
                    </h3>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">{edu.school}</h4>
                                    <span className="text-sm italic">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <div className="text-md italic">
                                    {edu.degree} in {edu.field}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-center" style={{ borderColor: themeColor }}>
                        Skills
                    </h3>
                    <div className="text-sm leading-relaxed text-center">
                        {skills.join(' • ')}
                    </div>
                </section>
            )}
        </div>
    );
}
