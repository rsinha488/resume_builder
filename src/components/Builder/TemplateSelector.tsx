import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateTemplate } from '@/lib/features/resume/resumeSlice';
import { TEMPLATES } from '@/lib/templates';
import { FaCrown, FaCheck, FaMagic } from 'react-icons/fa';
import { useState } from 'react';
import TemplateSelectionModal from './TemplateSelectionModal';

interface TemplateSelectorProps {
    readonly userPlan: 'FREE' | 'PRO';
    readonly onUpgradeRequired: () => void;
}

import ResumePreview from './ResumePreview';

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
        <div className="space-y-10 animate-fade-in-up">
            {/* Gallery Promo Card */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-surface-950 p-10 text-white shadow-2xl shadow-primary-900/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:scale-150 duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -ml-32 -mb-32" />
                
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                            <FaMagic className="text-primary-400 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight mb-1 text-white">Template Gallery</h3>
                            <p className="text-white/70 text-sm font-medium">Explore our collection of high-impact layouts.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-white text-surface-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-all shadow-xl active:scale-95 shrink-0"
                    >
                        Browse all templates
                    </button>
                </div>
            </div>

            <TemplateSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode="resume"
                userPlan={userPlan}
                onUpgrade={onUpgradeRequired}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {TEMPLATES.map((template, index) => (
                    <button
                        key={template.id}
                        onClick={() => handleSelect(template.id, template.isPremium)}
                        className={`relative cursor-pointer rounded-[2rem] border-2 transition-all duration-500 overflow-hidden group text-left flex flex-col animate-fade-in-up ${
                            selectedTemplateId === template.id
                            ? 'border-primary-600 shadow-2xl ring-8 ring-primary-500/5 -translate-y-1'
                            : 'border-surface-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 bg-white'
                            }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Template Thumbnail Preview */}
                        <div className="aspect-[3/4] bg-surface-50 flex flex-col items-center overflow-hidden relative transition-colors p-6 group-hover:bg-surface-100/50">
                            <div className="w-[210mm] min-h-[297mm] transform scale-[0.18] origin-top shadow-2xl border border-surface-100 pointer-events-none bg-white rounded-sm">
                                <ResumePreview templateId={template.id} />
                            </div>
                            
                            {/* Overlay for selection */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                                selectedTemplateId === template.id 
                                ? 'bg-primary-600/5 backdrop-blur-[1px]' 
                                : 'bg-transparent group-hover:bg-surface-900/5'
                            }`}>
                                {selectedTemplateId === template.id && (
                                    <div className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                                        <FaCheck size={28} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 bg-white mt-auto border-t border-surface-50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-surface-900 text-lg tracking-tight group-hover:text-primary-600 transition-colors uppercase">{template.name}</h3>
                                {template.isPremium && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full">
                                        <FaCrown size={10} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-surface-500 font-medium leading-relaxed line-clamp-2">{template.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div >
    );
}
