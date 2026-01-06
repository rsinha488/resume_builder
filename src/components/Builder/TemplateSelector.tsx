import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateTemplate } from '@/lib/features/resume/resumeSlice';
import { TEMPLATES } from '@/lib/templates';
import { FaCrown, FaCheck, FaMagic } from 'react-icons/fa';
import { useState } from 'react';
import TemplateSelectionModal from './TemplateSelectionModal';

interface TemplateSelectorProps {
    userPlan: 'FREE' | 'PRO';
    onUpgradeRequired: () => void;
}

export default function TemplateSelector({ userPlan, onUpgradeRequired }: TemplateSelectorProps) {
    const dispatch = useAppDispatch();
    const selectedTemplateId = useAppSelector((state) => state.resume.templateId);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelect = (templateId: string, isPremium: boolean) => {
        if (isPremium && userPlan === 'FREE') {
            onUpgradeRequired();
            return;
        }
        dispatch(updateTemplate(templateId));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                        <FaMagic />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Advanced Template Selection</h3>
                        <p className="text-blue-100 text-sm">Preview all layouts in high fidelity</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                >
                    Open Template Gallery
                </button>
            </div>

            <TemplateSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="resume"
                userPlan={userPlan}
                onUpgrade={onUpgradeRequired}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {TEMPLATES.map((template) => (
                    <div
                        key={template.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelect(template.id, template.isPremium)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleSelect(template.id, template.isPremium);
                            }
                        }}
                        className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden group ${selectedTemplateId === template.id
                            ? 'border-primary-600 ring-2 ring-primary-100'
                            : 'border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative">
                            <span className="text-gray-400 font-medium">{template.name} Preview</span>

                            {template.isPremium && (
                                <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-full shadow-lg">
                                    <FaCrown size={14} />
                                </div>
                            )}

                            {selectedTemplateId === template.id && (
                                <div className="absolute inset-0 bg-primary-600/10 flex items-center justify-center">
                                    <div className="bg-primary-600 text-white p-2 rounded-full shadow-lg">
                                        <FaCheck size={20} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-gray-900">{template.name}</h3>
                                {template.isPremium && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                        Premium
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
