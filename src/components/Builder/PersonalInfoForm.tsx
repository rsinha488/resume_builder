'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updatePersonalInfo } from '@/lib/features/resume/resumeSlice';
import { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

export default function PersonalInfoForm() {
    const dispatch = useAppDispatch();
    const personalInfo = useAppSelector((state) => state.resume.personalInfo);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        dispatch(updatePersonalInfo({ [name]: value }));
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
                <h2 className="text-2xl font-black text-surface-900 mb-2">Personal Information</h2>
                <p className="text-sm text-surface-500 font-medium">How should employers contact you?</p>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-8 p-6 bg-white rounded-3xl border border-surface-100 shadow-sm transition-all hover:shadow-md">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden bg-surface-50 border-4 border-white shadow-premium relative transition-transform group-hover:scale-105 duration-300">
                        {personalInfo?.avatarUrl ? (
                            <img src={personalInfo?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-surface-300">
                                <FaCamera size={28} />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm flex items-center justify-center text-white">
                                <FaSpinner className="animate-spin" size={24} />
                            </div>
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2.5 rounded-2xl cursor-pointer shadow-xl hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all z-10">
                        <FaCamera size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
                <div>
                    <h4 className="font-bold text-surface-900 mb-1">Profile Photo</h4>
                    <p className="text-xs text-surface-400 leading-relaxed max-w-[200px]">
                        JPG, PNG or WebP. <br />Max size of 2MB.
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
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                    <label htmlFor="summary" className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Professional Summary</label>
                    <span className="text-[10px] text-surface-300 font-bold uppercase tracking-widest">Recommended: 300-500 chars</span>
                </div>
                <textarea
                    id="summary"
                    name="summary"
                    value={personalInfo?.summary ?? ''}
                    onChange={handleChange}
                    rows={6}
                    className="w-full resize-none p-5"
                    placeholder="Briefly describe your professional background and key achievements..."
                />
            </div>
        </div>
    );
}
