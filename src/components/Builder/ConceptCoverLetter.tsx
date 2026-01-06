'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ConceptCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipientInfo, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 p-[20mm]"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Top Bar Header */}
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-black tracking-tight mb-2" style={{ color: themeColor }}>
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <h2 className="text-xl font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">
                    {personalInfo?.jobTitle || 'Your Professional Title'}
                </h2>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600 border-y py-4 border-gray-100">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-2">
                            <FaEnvelope style={{ color: themeColor }} /> <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-2">
                            <FaPhone style={{ color: themeColor }} /> <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.address && (
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt style={{ color: themeColor }} /> <span>{personalInfo.address}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-3xl mx-auto">
                {/* Date & Recipient */}
                <div className="mb-10">
                    <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-gray-900">{recipientInfo?.hiringManagerName || 'Hiring Manager'}</h3>
                        <p className="text-gray-600">{recipientInfo?.companyName}</p>
                        <p className="text-gray-600">{recipientInfo?.address}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                    <p className="font-bold text-gray-900 mb-6">Dear {recipientInfo?.hiringManagerName || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-12">
                        <p className="text-gray-600 mb-4">Sincerely,</p>
                        <p className="text-xl font-black" style={{ color: themeColor }}>{personalInfo?.fullName || 'Your Name'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
