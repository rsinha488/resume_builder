'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateCustomSection, CustomSection } from '@/lib/features/resume/resumeSlice';
import { FaSave, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'sonner';

export default function CustomSectionForm({ sectionId, onBack }: { sectionId: string; onBack?: () => void }) {
    const dispatch = useAppDispatch();
    const customSection = useAppSelector((state) => 
        state.resume.customSections.find(s => s.id === sectionId)
    );

    const [title, setTitle] = useState(customSection?.title || '');
    const [content, setContent] = useState(customSection?.content || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (customSection) {
            setTitle(customSection.title);
            setContent(customSection.content);
        }
    }, [customSection]);

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!title.trim()) {
            toast.error('Section title is required');
            return;
        }

        setIsSaving(true);
        dispatch(updateCustomSection({
            id: sectionId,
            title,
            content
        }));
        
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Custom section saved!');
            if (onBack) onBack();
        }, 500);
    };

    if (!customSection) {
        return (
            <div className="p-8 text-center bg-surface-50 rounded-2xl border-2 border-dashed border-surface-100">
                <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Section not found</p>
                <button onClick={onBack} className="mt-4 text-primary-600 font-black uppercase tracking-widest text-[10px]">Go Back</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-surface-900 uppercase tracking-tight">Edit Custom Section</h2>
                <p className="text-sm text-surface-500 font-medium leading-relaxed">
                    Personalize this section with any content you like. Use it for Volunteer Work, Publications, Awards, or anything else that makes your profile unique.
                </p>
            </div>

            <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-4 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary-600">
                    <FaInfoCircle size={18} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-primary-900 uppercase tracking-widest">Writing Tip</p>
                    <p className="text-[11px] text-primary-700 font-medium leading-relaxed">
                        Use bullet points or concise paragraphs. Clear headings and structured content help recruiters scan your unique achievements easily.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Section Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Volunteer Experience"
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-bold transition-all text-surface-900"
                    />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Describe your achievements, roles, or details here..."
                        rows={10}
                        className="w-full px-4 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-medium transition-all text-surface-800 leading-relaxed resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-surface-100">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                    {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="px-8 py-4 border border-surface-200 text-surface-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-surface-50 transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
