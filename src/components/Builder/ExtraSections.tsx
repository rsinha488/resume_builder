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
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder={placeholder}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <FaPlus />
                </button>
            </form>

            <div className="flex flex-wrap gap-2">
                {items?.map((item) => (
                    <span
                        key={item}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 group"
                    >
                        {item}
                        <button
                            onClick={() => handleRemove(item)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FaTimes size={10} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

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
