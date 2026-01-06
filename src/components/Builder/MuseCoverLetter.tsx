'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';

export default function MuseCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipient, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 p-[25mm]"
            style={{ fontFamily: fontFamily || 'serif' }}
        >
            {/* Elegant Serif Header */}
            <header className="text-center mb-20">
                <h1 className="text-6xl font-serif italic tracking-tight mb-4 text-gray-900">
                    {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-gray-200" />
                    <h2 className="text-lg font-bold uppercase tracking-[0.4em] text-gray-400">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                    <div className="h-px w-12 bg-gray-200" />
                </div>

                <div className="flex justify-center gap-8 text-sm font-serif italic text-gray-500">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                </div>
            </header>

            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                    <div className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 mb-8">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-1 font-serif italic text-gray-600">
                        <h3 className="text-xl font-serif text-gray-900 not-italic font-bold">{recipient?.name || 'Hiring Manager'}</h3>
                        <p>{recipient?.jobTitle}</p>
                        <p className="font-bold" style={{ color: themeColor }}>{recipient?.company}</p>
                        <p>{recipient?.address}</p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none font-serif">
                    <p className="font-serif italic text-gray-900 text-lg mb-8">Dear {recipient?.name || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6 italic">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-20 text-center">
                        <p className="text-gray-400 font-serif italic mb-4">Sincerely yours,</p>
                        <p className="text-3xl font-serif italic text-gray-900">{personalInfo?.fullName || 'Your Name'}</p>
                        <div className="w-16 h-0.5 bg-gray-200 mx-auto mt-4" style={{ backgroundColor: themeColor }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
