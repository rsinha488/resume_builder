'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateLanguages, updateCertifications, updateHobbies } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTimes, FaLanguage, FaCertificate, FaRunning } from 'react-icons/fa';
import { toast } from 'sonner';

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    onUpdate: (items: string[]) => void;
    placeholder: string;
}

const Section = ({ title, icon, items, onUpdate, placeholder }: SectionProps) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim() && !items?.includes(newItem.trim())) {
            onUpdate([...items, newItem.trim()]);
            setNewItem('');
            toast.success(`${title} added`);
        }
    };

    const handleRemove = (itemToRemove: string) => {
        onUpdate(items?.filter(i => i !== itemToRemove));
        toast.success(`${title} removed`);
    };

    return (
        <div className="bg-white p-8 rounded-4xl border border-surface-100 shadow-premium space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                        {icon}
                    </div>
                    <h3 className="text-xl font-black text-surface-900">{title}</h3>
                </div>
            </div>

            <form onSubmit={handleAdd} className="flex gap-4">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="w-full pl-5 pr-12 py-3.5 bg-surface-50 border-surface-100 rounded-2xl focus:bg-white transition-all outline-none"
                        placeholder={placeholder}
                    />
                </div>
                <button
                    type="submit"
                    className="w-12 h-12 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center shrink-0 active:scale-95"
                >
                    <FaPlus />
                </button>
            </form>

            <div className="flex flex-wrap gap-3">
                {items?.map((item, index) => (
                    <div
                        key={item}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-surface-50 text-surface-700 text-xs font-bold border border-surface-100 group hover:border-primary-200 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <span className="uppercase tracking-wider">{item}</span>
                        <button
                            onClick={() => handleRemove(item)}
                            className="w-5 h-5 rounded-lg flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ExtraSections() {
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume);

    return (
        <div className="space-y-8">
            <Section
                title="Languages"
                icon={<FaLanguage size={20} />}
                items={resume.languages}
                onUpdate={(items) => dispatch(updateLanguages(items))}
                placeholder="e.g. English (Native), Spanish (Fluent)"
            />
            <Section
                title="Certifications"
                icon={<FaCertificate size={20} />}
                items={resume.certifications}
                onUpdate={(items) => dispatch(updateCertifications(items))}
                placeholder="e.g. AWS Certified Developer"
            />
            <Section
                title="Hobbies"
                icon={<FaRunning size={20} />}
                items={resume.hobbies}
                onUpdate={(items) => dispatch(updateHobbies(items))}
                placeholder="e.g. Photography, Marathon Running"
            />
        </div>
    );
}
