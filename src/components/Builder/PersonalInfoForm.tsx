'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updatePersonalInfo } from '@/lib/features/resume/resumeSlice';
import { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaSpinner } from 'react-icons/fa';

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

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData);
            dispatch(updatePersonalInfo({ avatarUrl: response.data.secure_url }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md relative">
                        {personalInfo.avatarUrl ? (
                            <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaCamera size={32} />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                <FaSpinner className="animate-spin" size={24} />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-700 transition-colors">
                        <FaCamera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
                <p className="mt-2 text-xs text-gray-500 font-medium">Upload professional photo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={personalInfo.jobTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Software Engineer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="New York, USA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <input
                        type="text"
                        name="website"
                        value={personalInfo.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="https://johndoe.com"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Professional Summary</label>
                <textarea
                    name="summary"
                    value={personalInfo.summary}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Briefly describe your professional background and key achievements..."
                />
            </div>
        </div>
    );
}
