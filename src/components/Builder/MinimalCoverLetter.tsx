'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';

export default function MinimalCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipient, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 p-[20mm]"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            <div className="max-w-2xl mx-auto pt-10">
                <header className="mb-16">
                    <h1 className="text-4xl font-light tracking-tight mb-1 text-gray-900">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                    <div className="mt-6 flex gap-6 text-xs text-gray-500 font-medium">
                        {personalInfo?.email && <span>{personalInfo.email}</span>}
                        {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    </div>
                </header>

                <div className="mb-12">
                    <div className="text-xs font-bold text-gray-300 mb-8">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-gray-900">{recipient?.name || 'Hiring Manager'}</h3>
                        <p className="text-sm text-gray-600">{recipient?.jobTitle}</p>
                        <p className="text-sm text-gray-600">{recipient?.company}</p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none">
                    <p className="font-bold text-gray-900 mb-6">Dear {recipient?.name || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-16">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Best,</p>
                        <p className="text-xl font-medium text-gray-900" style={{ color: themeColor }}>{personalInfo?.fullName || 'Your Name'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
