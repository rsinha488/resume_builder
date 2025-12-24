'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function PrimoTemplate({ data }: { data: ResumeState }) {
    const { personalInfo, experiences, education, skills, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 overflow-hidden"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Bold Header */}
            <div
                className="p-12 text-white"
                style={{ backgroundColor: themeColor || '#1a365d' }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">
                            {personalInfo.fullName}
                        </h1>
                        <h2 className="text-2xl font-medium opacity-90 tracking-wide uppercase">
                            {personalInfo.jobTitle}
                        </h2>
                    </div>
                    {personalInfo.avatarUrl && (
                        <div className="w-32 h-32 rounded-2xl border-4 border-white/30 overflow-hidden shadow-xl">
                            <img src={personalInfo.avatarUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <FaEnvelope className="opacity-70" />
                        <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaPhone className="opacity-70" />
                        <span>{personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="opacity-70" />
                        <span>{personalInfo.address}</span>
                    </div>
                    {personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <FaGlobe className="opacity-70" />
                            <span>{personalInfo.website}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-12 grid grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="col-span-8 space-y-10">
                    {/* Summary */}
                    <section>
                        <h3
                            className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
                            style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                        >
                            Professional Profile
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {personalInfo.summary}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h3
                            className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                            style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                        >
                            Work History
                        </h3>
                        <div className="space-y-8">
                            {experiences.map((exp) => (
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
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="col-span-4 space-y-10">
                    {/* Skills */}
                    <section>
                        <h3
                            className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                            style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                        >
                            Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-bold uppercase tracking-tight"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h3
                            className="text-xl font-bold uppercase tracking-wider mb-6 pb-2 border-b-2"
                            style={{ borderColor: themeColor || '#1a365d', color: themeColor || '#1a365d' }}
                        >
                            Education
                        </h3>
                        <div className="space-y-6">
                            {education.map((edu) => (
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
                </div>
            </div>
        </div>
    );
}
