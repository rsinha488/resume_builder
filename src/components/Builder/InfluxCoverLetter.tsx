'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function InfluxCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipient, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 p-[20mm]"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Professional Top Bar Header */}
            <header className="flex justify-between items-end mb-16 pb-8 border-b-8" style={{ borderColor: themeColor }}>
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
                </div>
            </header>

            <div className="max-w-3xl">
                <div className="mb-12">
                    <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-gray-900">{recipient?.name || 'Hiring Manager'}</h3>
                        <p className="text-gray-600 font-bold">{recipient?.jobTitle}</p>
                        <p className="text-gray-500 uppercase tracking-wider text-xs font-black">{recipient?.company}</p>
                        <p className="text-gray-600">{recipient?.address}</p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none">
                    <p className="font-black text-gray-900 text-lg mb-8">Dear {recipient?.name || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Sincerely,</p>
                        <p className="text-3xl font-black text-gray-900">{personalInfo?.fullName || 'Your Name'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
