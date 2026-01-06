'use client';
import { CoverLetterState } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

export default function DiamondCoverLetter({ data }: { readonly data: CoverLetterState }) {
    const { personalInfo, recipientInfo, content, themeColor, fontFamily } = data;

    return (
        <div
            className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-gray-800 p-[20mm]"
            style={{ fontFamily: fontFamily || 'sans-serif' }}
        >
            {/* Bold Geometric Header */}
            <header className="relative mb-12 overflow-hidden rounded-2xl bg-gray-900 text-white p-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 translate-x-32 -translate-y-32" />
                <div className="relative z-10">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">
                        {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <div className="h-1 w-20 mb-4" style={{ backgroundColor: themeColor }} />
                    <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
                        {personalInfo?.jobTitle || 'Your Professional Title'}
                    </h2>
                    
                    <div className="flex gap-8 text-sm font-medium text-gray-300">
                        {personalInfo?.email && <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500" /> <span>{personalInfo.email}</span></div>}
                        {personalInfo?.phone && <div className="flex items-center gap-2"><FaPhone className="text-gray-500" /> <span>{personalInfo.phone}</span></div>}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-4">
                    <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Recipient</h3>
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900">{recipientInfo?.hiringManagerName || 'Hiring Manager'}</h4>
                            <p className="text-sm text-gray-600 font-bold" style={{ color: themeColor }}>{recipientInfo?.companyName}</p>
                            <p className="text-sm text-gray-600">{recipientInfo?.address}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-8">
                    <p className="font-bold text-gray-900 mb-6">Dear {recipientInfo?.hiringManagerName || 'Hiring Manager'},</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                        {content || 'Start writing your cover letter...'}
                    </div>
                    <div className="mt-12">
                        <p className="text-gray-600 mb-2">Best Regards,</p>
                        <p className="text-2xl font-black text-gray-900">{personalInfo?.fullName || 'Your Name'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
