'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateTemplate } from '@/lib/features/coverLetter/coverLetterSlice';
import { FaCrown, FaCheck, FaMagic } from 'react-icons/fa';
import { useState } from 'react';
import TemplateSelectionModal from './TemplateSelectionModal';

const TEMPLATES = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Sleek and professional with a clean header.',
        isPremium: false,
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional centered design with serif fonts.',
        isPremium: false,
    },
    {
        id: 'cascade',
        name: 'Cascade',
        description: 'Modern two-column design with a colored sidebar.',
        isPremium: true,
    },
    {
        id: 'concept',
        name: 'Concept',
        description: 'Modern and clean with subtle icons and a professional top bar.',
        isPremium: true,
    },
    {
        id: 'diamond',
        name: 'Diamond',
        description: 'Bold geometric headers for high impact and modern feel.',
        isPremium: true,
    },
    {
        id: 'influx',
        name: 'Influx',
        description: 'A professional top-bar layout with a focus on hierarchy.',
        isPremium: true,
    },
    {
        id: 'vibes',
        name: 'Vibes',
        description: 'Creative design with a right-hand sidebar for a unique look.',
        isPremium: true,
    },
    {
        id: 'muse',
        name: 'Muse',
        description: 'Elegant and sophisticated with serif typography and classic spacing.',
        isPremium: true,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant, focusing purely on content.',
        isPremium: true,
    },
    {
        id: 'primo',
        name: 'Primo',
        description: 'A bold and creative design with high-impact visuals.',
        isPremium: true,
    },
];

interface Props {
    userPlan: 'FREE' | 'PRO';
    onUpgradeRequired: () => void;
}

export default function CoverLetterTemplateSelector({ userPlan, onUpgradeRequired }: Props) {
    const dispatch = useAppDispatch();
    const currentTemplateId = useAppSelector((state) => state.coverLetter.templateId);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelect = (templateId: string, isPremium: boolean) => {
        if (isPremium && userPlan !== 'PRO') {
            onUpgradeRequired();
            return;
        }
        dispatch(updateTemplate(templateId));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                        <FaMagic />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Advanced Template Selection</h3>
                        <p className="text-purple-100 text-sm">Preview all layouts in high fidelity</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg"
                >
                    Open Template Gallery
                </button>
            </div>

            <TemplateSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="cover-letter"
                userPlan={userPlan}
                onUpgrade={onUpgradeRequired}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleSelect(template.id, template.isPremium)}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentTemplateId === template.id
                            ? 'border-primary-600 ring-4 ring-primary-600/10 shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                            }`}
                    >
                        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
                            {/* Placeholder for template preview image */}
                            <div className="w-full h-full bg-white shadow-sm rounded border border-gray-200 flex flex-col p-4 gap-2">
                                <div className={`h-4 w-3/4 rounded ${template.id === 'classic' ? 'mx-auto' : ''}`} style={{ backgroundColor: template.id === 'cascade' ? '#eee' : '#eee' }} />
                                <div className="h-2 w-1/2 bg-gray-50 rounded" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-2 w-full bg-gray-50 rounded" />
                                    <div className="h-2 w-full bg-gray-50 rounded" />
                                    <div className="h-2 w-3/4 bg-gray-50 rounded" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900">{template.name}</h3>
                                {template.isPremium && (
                                    <FaCrown className="text-amber-500 text-sm" />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
                        </div>

                        {currentTemplateId === template.id && (
                            <div className="absolute top-3 right-3 bg-primary-600 text-white p-1.5 rounded-full shadow-lg">
                                <FaCheck className="text-xs" />
                            </div>
                        )}

                        {template.isPremium && userPlan !== 'PRO' && (
                            <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <FaCrown className="text-amber-500" /> Upgrade to Use
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
