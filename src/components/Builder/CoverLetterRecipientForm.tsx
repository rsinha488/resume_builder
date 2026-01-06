'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateRecipientInfo } from '@/lib/features/coverLetter/coverLetterSlice';

export default function CoverLetterRecipientForm() {
    const dispatch = useAppDispatch();
    const recipientInfo = useAppSelector((state) => state.coverLetter.recipientInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updateRecipientInfo({ [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="hiringManagerName" className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager Name</label>
                    <input
                        id="hiringManagerName"
                        type="text"
                        name="hiringManagerName"
                        value={recipientInfo.hiringManagerName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Jane Smith"
                    />
                </div>
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        value={recipientInfo.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Tech Corp Inc."
                    />
                </div>
                <div>
                    <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">Recipient Email (Optional)</label>
                    <input
                        id="recipientEmail"
                        type="email"
                        name="email"
                        value={recipientInfo.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="jane@techcorp.com"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                <input
                    id="companyAddress"
                    type="text"
                    name="address"
                    value={recipientInfo.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="123 Business Rd, City"
                />
            </div>
        </div>
    );
}
