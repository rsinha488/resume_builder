'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updatePersonalInfo } from '@/lib/features/resume/resumeSlice';
import { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaSpinner, FaMagic } from 'react-icons/fa';
import { toast } from 'sonner';

interface PersonalInfoFormProps {
    readonly userPlan: 'FREE' | 'PRO';
    readonly aiUsageCount: number;
    readonly onUsageUpdate: (count: number) => void;
    readonly onUpgrade: () => void;
}

export default function PersonalInfoForm({ userPlan, aiUsageCount, onUsageUpdate, onUpgrade }: PersonalInfoFormProps) {
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume);
    const personalInfo = resume.personalInfo;
    const [uploading, setUploading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        dispatch(updatePersonalInfo({ [name]: value }));
    };

    const handleGenerateSummary = async () => {
        if (userPlan === 'FREE' && aiUsageCount >= 50) {
            onUpgrade();
            return;
        }

        setAiLoading(true);
        try {
            const res = await axios.post('/api/ai/generate-summary', {
                personalInfo: resume.personalInfo,
                experiences: resume.experiences,
                skills: resume.skills,
            });
            dispatch(updatePersonalInfo({ summary: res.data.summary }));
            if (res.data.newUsageCount !== undefined) {
                onUsageUpdate(res.data.newUsageCount);
            }
            toast.success('Professional summary generated!');
        } catch (error: any) {
            console.error('Summary generation error:', error);
            const msg = error.response?.data?.error || 'Failed to generate summary.';
            toast.error(msg);
        } finally {
            setAiLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size too large. Please upload an image smaller than 2MB.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData);
            dispatch(updatePersonalInfo({ avatarUrl: response.data.secure_url }));
            toast.success('Photo uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-surface-900 mb-2">Personal Information</h2>
                <p className="text-sm md:text-base text-surface-500 font-medium">How should employers contact you?</p>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6 p-4 sm:p-6 bg-white rounded-[2rem] border border-surface-100 shadow-premium transition-all hover:shadow-premium-hover group/avatar">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-surface-50 border-4 border-white shadow-premium relative transition-transform group-hover/avatar:scale-105 duration-500">
                        {personalInfo?.avatarUrl ? (
                            <img src={personalInfo?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-surface-200">
                                <FaCamera size={24} />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm flex items-center justify-center text-white">
                                <FaSpinner className="animate-spin" size={20} />
                            </div>
                        )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-primary-600 text-white p-2.5 rounded-2xl cursor-pointer shadow-xl hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all z-10">
                        <FaCamera size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-surface-900 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        Profile Photo <span className="w-1 h-1 bg-surface-200 rounded-full" />
                    </h4>
                    <p className="text-[10px] sm:text-xs text-surface-400 font-medium leading-relaxed max-w-[240px]">
                        JPG, PNG or WebP. Recommended square aspect ratio. Max 2MB.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={personalInfo?.fullName ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="jobTitle" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Desired Job Title</label>
                    <input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        value={personalInfo?.jobTitle ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="e.g. Lead Software Engineer"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={personalInfo?.email ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={personalInfo?.phone ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="address" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Location</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={personalInfo?.address ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="City, Country"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="website" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Portfolio / LinkedIn</label>
                    <input
                        id="website"
                        type="text"
                        name="website"
                        value={personalInfo?.website ?? ''}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="https://johndoe.com"
                    />
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <label htmlFor="summary" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Professional Summary</label>
                        <p className="text-[10px] text-surface-300 font-bold uppercase tracking-widest ml-1">Recommended: 300-500 chars</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {userPlan === 'FREE' && (
                            <span className="text-[10px] font-bold text-surface-500 bg-surface-50 border border-surface-200 px-3 py-1.5 rounded-xl shadow-sm">
                                Free AI Uses: {aiUsageCount}/50
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleGenerateSummary}
                            disabled={aiLoading}
                            className="flex items-center gap-2 group/magic"
                            aria-label="Generate professional summary with AI"
                            aria-busy={aiLoading}
                        >
                            <div className="w-8 h-8 rounded-lg bg-surface-50 group-hover/magic:bg-primary-50 flex items-center justify-center transition-colors">
                                {aiLoading ? <FaSpinner className="animate-spin text-primary-600" aria-hidden="true" /> : <FaMagic className="text-primary-600" aria-hidden="true" />}
                            </div>
                            <span className="text-[10px] font-black text-surface-400 group-hover/magic:text-primary-600 uppercase tracking-widest transition-colors">
                                {aiLoading ? 'Generating...' : 'AI Generated Summary'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <textarea
                        id="summary"
                        name="summary"
                        value={personalInfo?.summary ?? ''}
                        onChange={handleChange}
                        rows={8}
                        className="relative w-full p-8 bg-white border border-surface-100 rounded-3xl shadow-sm focus:ring-0 focus:border-primary-500 outline-none resize-none text-base text-surface-700 leading-relaxed font-medium transition-all"
                        placeholder="Briefly describe your professional background and key achievements..."
                    />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-100 italic">
                    <span className="text-lg">💡</span>
                    <p className="text-[10px] text-surface-500 font-medium">Keep it concise. 3-5 sentences that highlight your most relevant experience and skills.</p>
                </div>
            </div>
        </div>
    );
}
