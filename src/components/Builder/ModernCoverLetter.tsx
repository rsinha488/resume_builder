'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';

interface Props {
    readonly data: CoverLetterState;
}

export default function ModernCoverLetter({ data }: Props) {
    const { personalInfo, recipientInfo, content, themeColor, fontFamily, date } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-16 text-gray-800"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Header */}
            <header className="border-b-4 pb-8 mb-12 flex justify-between items-start" style={{ borderColor: themeColor }}>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-medium text-gray-600">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                </div>
                <div className="text-right text-sm text-gray-500 space-y-1">
                    <p>{personalInfo?.email}</p>
                    <p>{personalInfo?.phone}</p>
                    <p>{personalInfo?.address}</p>
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
                <div className="pt-8">
                    <p className="text-gray-600">Sincerely,</p>
                    <p className="font-bold text-gray-900 mt-2 text-xl">{personalInfo?.fullName || 'Your Name'}</p>
                </div>
            </div>
        </div>
    );
}
