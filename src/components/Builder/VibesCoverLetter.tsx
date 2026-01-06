'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function VibesCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipient, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] flex text-gray-800 overflow-hidden"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Main Content (Left) */}
            <main className="flex-1 bg-white p-[20mm]">
                <header className="mb-12">
                    <h1 className="text-6xl font-black tracking-tighter mb-2 text-gray-900">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-bold uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                </header>

                <div>
                    <div className="text-sm font-black text-gray-300 uppercase tracking-[0.4em] mb-10">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>

                    <div className="prose prose-sm max-w-none">
                        <p className="font-bold text-gray-900 mb-6 text-lg">Dear {recipient?.name || 'Hiring Manager'},</p>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6">
                            {content || 'Start writing your cover letter...'}
                        </div>
                        <div className="mt-16">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Sincerely,</p>
                            <p className="text-2xl font-black text-gray-900">{personalInfo?.fullName || 'Your Name'}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sidebar (Right) */}
            <aside className="w-[30%] bg-gray-50 p-[20mm] flex flex-col gap-12">
                <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Recipient</h3>
                    <div className="space-y-1 text-sm">
                        <h4 className="font-bold text-gray-900">{recipient?.name || 'Hiring Manager'}</h4>
                        <p className="text-gray-600">{recipient?.jobTitle}</p>
                        <p className="text-gray-500 uppercase tracking-wider text-[10px] font-black">{recipient?.company}</p>
                        <p className="text-gray-600">{recipient?.address}</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Contact</h3>
                    <div className="space-y-4 text-sm font-medium text-gray-600">
                        {personalInfo?.email && <div className="flex items-center gap-3"><FaEnvelope style={{ color: themeColor }} /> <span className="break-all">{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-3"><FaPhone style={{ color: themeColor }} /> <span>{personalInfo.phone}</span></div>}
                    </div>
                </section>
            </aside>
        </div>
    );
}
