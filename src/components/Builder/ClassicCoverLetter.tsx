'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';

interface ClassicCoverLetterProps {
    readonly data: CoverLetterState;
}

export default function ClassicCoverLetter({ data }: ClassicCoverLetterProps) {
    const { personalInfo, recipientInfo, content, themeColor, fontFamily, date } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-16 text-gray-800"
            style={{ fontFamily: fontFamily || 'serif' }}
        >
            {/* Header */}
            <header className="text-center mb-12 border-b-2 pb-8" style={{ borderColor: themeColor }}>
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600 italic">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo?.address && <span>• {personalInfo.address}</span>}
                </div>
            </header>

            {/* Date & Recipient */}
            <div className="mb-10">
                <p className="text-gray-600 mb-8">{date}</p>
                <div className="space-y-1">
                    <p className="font-bold text-gray-900">{recipientInfo.hiringManagerName || 'Hiring Manager'}</p>
                    <p className="text-gray-700">{recipientInfo.companyName}</p>
                    <p className="text-gray-600">{recipientInfo.address}</p>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <p className="font-bold text-gray-900">
                    Dear {recipientInfo.hiringManagerName || 'Hiring Manager'},
                </p>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                    {content || 'Start writing your cover letter here...'}
                </div>
                <div className="pt-12">
                    <p className="text-gray-600">Sincerely,</p>
                    <p className="font-bold text-gray-900 mt-2 text-xl">{personalInfo?.fullName || 'Your Name'}</p>
                </div>
            </div>
        </div>
    );
}
