'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updatePersonalInfo } from '@/lib/features/coverLetter/coverLetterSlice';

export default function CoverLetterPersonalInfoForm() {
    const dispatch = useAppDispatch();
    const personalInfo = useAppSelector((state) => state.coverLetter.personalInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updatePersonalInfo({ [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        value={personalInfo.jobTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Software Engineer"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+1 234 567 890"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                    id="address"
                    type="text"
                    name="address"
                    value={personalInfo.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="City, Country"
                />
            </div>
        </div>
    );
}
