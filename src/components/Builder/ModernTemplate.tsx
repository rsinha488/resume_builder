'use client';
import { ResumeState } from '@/lib/features/resume/resumeSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function ModernTemplate({ data }: { readonly data: ResumeState }) {
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
            {/* Header */}
            <header className="border-b-4 pb-8 mb-8 flex justify-between items-start" style={{ borderColor: themeColor }}>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-medium text-gray-600 mb-4">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                        {personalInfo?.email && (
                            <div className="flex items-center gap-2">
                                <FaEnvelope style={{ color: themeColor }} /> {personalInfo.email}
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div className="flex items-center gap-2">
                                <FaPhone style={{ color: themeColor }} /> {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo?.address && (
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt style={{ color: themeColor }} /> {personalInfo.address}
                            </div>
                        )}
                        {personalInfo?.website && (
                            <div className="flex items-center gap-2">
                                <FaGlobe style={{ color: themeColor }} /> {personalInfo.website}
                            </div>
                        )}
                    </div>
                </div>

                {personalInfo?.avatarUrl && (
                    <div className="ml-8 w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                        <img src={personalInfo.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section style={{ marginBottom: `${sectionSpacing}px` }}>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-3 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                        Professional Summary
                    </h3>
                    <p className={`${fontSizeMap[fontSize || 'medium']} leading-relaxed text-gray-700 whitespace-pre-line`}>
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experiences?.length > 0 && (
                <section style={{ marginBottom: `${sectionSpacing}px` }}>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                        Work Experience
                    </h3>
                    <div className="space-y-6">
                        {experiences?.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                                <p className={`${fontSizeMap[fontSize || 'medium']} text-gray-700 whitespace-pre-line leading-relaxed`}>
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section style={{ marginBottom: `${sectionSpacing}px` }}>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                        Education
                    </h3>
                    <div className="space-y-4">
                        {education?.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900">{edu.school}</h4>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <div className={`${fontSizeMap[fontSize || 'medium']}`}>
                                    <span className="font-semibold">{edu.degree}</span> in {edu.field}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold uppercase tracking-wide mb-4 border-b pb-1" style={{ color: themeColor, borderColor: themeColor + '40' }}>
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills?.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded uppercase tracking-wider"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
