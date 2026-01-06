'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateContent } from '@/lib/features/coverLetter/coverLetterSlice';

export default function CoverLetterContentForm() {
    const dispatch = useAppDispatch();
    const content = useAppSelector((state) => state.coverLetter.content);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateContent(e.target.value));
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={handleChange}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-serif"
                    placeholder="Dear Hiring Manager, I am writing to express my interest in..."
                />
            </div>
            <p className="text-xs text-gray-500 italic">
                Tip: Be specific about how your skills match the job requirements.
            </p>
        </div>
    );
}
