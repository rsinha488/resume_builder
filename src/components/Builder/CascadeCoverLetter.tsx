'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

interface Props {
    readonly data: CoverLetterState;
}

export default function CascadeCoverLetter({ data }: Props) {
    const { personalInfo, recipientInfo, content, themeColor, fontFamily, date } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Sidebar */}
            <aside
                className="w-[35%] text-white p-10 flex flex-col gap-10"
                style={{ backgroundColor: themeColor || '#2d3748' }}
            >
                <header className="mb-12">
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
                    </div>
                </section>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 bg-white">
                <div className="mb-12">
                    <p className="text-gray-500 font-bold mb-8">{date}</p>
                    <div className="space-y-1">
                        <p className="text-xl font-black uppercase tracking-tighter" style={{ color: themeColor }}>
                            {recipientInfo.hiringManagerName || 'Hiring Manager'}
                        </p>
                        <p className="font-bold text-gray-700">{recipientInfo.companyName}</p>
                        <p className="text-sm text-gray-500">{recipientInfo.address}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="font-bold text-gray-900">
                        Dear {recipientInfo.hiringManagerName || 'Hiring Manager'},
                    </p>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                        {content || 'Start writing your cover letter here...'}
                    </div>
                    <div className="pt-12">
                        <p className="text-gray-500 font-bold">Sincerely,</p>
                        <p className="text-2xl font-black uppercase tracking-tighter mt-2" style={{ color: themeColor }}>
                            {personalInfo?.fullName || 'Your Name'}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
