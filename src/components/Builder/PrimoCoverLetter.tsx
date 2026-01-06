'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';

export default function PrimoCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipient, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 flex flex-col"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Bold Header */}
            <header className="bg-gray-900 text-white p-12 flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-400">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black" style={{ backgroundColor: themeColor }}>
                    {personalInfo?.fullName?.charAt(0) || 'Y'}
                </div>
            </header>

            <div className="flex-1 p-12 flex gap-12">
                <div className="w-1/3 space-y-10">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Contact</h3>
                        <div className="space-y-2 text-sm font-bold text-gray-600">
                            <p className="break-all">{personalInfo?.email}</p>
                            <p>{personalInfo?.phone}</p>
                            <p>{personalInfo?.address}</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Date</h3>
                        <p className="text-sm font-bold text-gray-900">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Recipient</h3>
                        <div className="space-y-1 text-sm font-bold">
                            <p className="text-gray-900">{recipient?.name || 'Hiring Manager'}</p>
                            <p className="text-gray-600">{recipient?.jobTitle}</p>
                            <p style={{ color: themeColor }}>{recipient?.company}</p>
                        </div>
                    </section>
                </div>

                <div className="w-2/3">
                    <p className="font-black text-gray-900 text-xl mb-8">Dear {recipient?.name || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-6 text-lg">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-16">
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs mb-4">Best Regards,</p>
                        <p className="text-3xl font-black text-gray-900">{personalInfo?.fullName || 'Your Name'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
