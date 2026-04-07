'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCheck, FaLock, FaMagic } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { TEMPLATES } from '@/lib/templates';
import { COLOR_PALETTES } from '@/lib/themes';
import { updateTemplate, updateThemeColor } from '@/lib/features/resume/resumeSlice';
import { updateTemplate as updateCLTemplate, updateThemeColor as updateCLThemeColor } from '@/lib/features/coverLetter/coverLetterSlice';
import ResumePreview from './ResumePreview';
import CoverLetterPreview from './CoverLetterPreview';

interface TemplateSelectionModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly mode: 'resume' | 'cover-letter';
    readonly userPlan: string;
    readonly onUpgrade: () => void;
}

export default function TemplateSelectionModal({
    isOpen,
    onClose,
    mode,
    userPlan,
    onUpgrade
}: TemplateSelectionModalProps) {
    const dispatch = useAppDispatch();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get current state based on mode
    const resumeState = useAppSelector((state) => state.resume);
    const coverLetterState = useAppSelector((state) => state.coverLetter);

    const currentTemplateId = mode === 'resume' ? resumeState.templateId : coverLetterState.templateId;
    const currentThemeColor = mode === 'resume' ? resumeState.themeColor : coverLetterState.themeColor;

    if (!isOpen || !mounted) return null;

    const handleTemplateSelect = (templateId: string, isPremium: boolean) => {
        if (isPremium && userPlan === 'FREE') {
            onUpgrade();
            return;
        }

        if (mode === 'resume') {
            dispatch(updateTemplate(templateId));
        } else {
            dispatch(updateCLTemplate(templateId));
        }
    };

    const handleColorSelect = (color: string, isPremium: boolean) => {
        if (isPremium && userPlan === 'FREE') {
            onUpgrade();
            return;
        }

        if (mode === 'resume') {
            dispatch(updateThemeColor(color));
        } else {
            dispatch(updateCLThemeColor(color));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8">
            <div className="bg-white w-full h-full sm:h-auto sm:max-w-7xl sm:max-h-[90vh] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
                            <FaMagic size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight uppercase">Change template</h2>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Choose a design that fits your professional style</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Live Preview */}
                    <div className="hidden lg:flex flex-1 bg-gray-100 justify-center p-12 overflow-y-auto border-r">
                        <div className="w-[210mm] min-h-[297mm] transform scale-[0.5] xl:scale-[0.65] origin-top shadow-2xl bg-white mb-12">
                            {mode === 'resume' ? <ResumePreview /> : <CoverLetterPreview />}
                        </div>
                    </div>

                    {/* Right Panel: Controls */}
                    <div className="w-full lg:w-[450px] flex flex-col bg-white overflow-y-auto">
                        {/* Color Selection */}
                        <div className="p-8 border-b">
                            <h3 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Choose color:</h3>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_PALETTES.map((palette) => (
                                    <button
                                        key={palette.id}
                                        onClick={() => handleColorSelect(palette.primary, palette.premium)}
                                        className={`w-10 h-10 rounded-full border-4 transition-all relative flex items-center justify-center ${currentThemeColor === palette.primary ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: palette.primary }}
                                    >
                                        {currentThemeColor === palette.primary && <FaCheck className="text-white text-xs" />}
                                        {palette.premium && userPlan === 'FREE' && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-[8px] p-0.5 rounded-full text-white shadow-sm">
                                                <FaLock />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="p-8 flex-1">
                            <h3 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Choose template:</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {TEMPLATES.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleTemplateSelect(template.id, template.isPremium)}
                                        className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden group text-left ${currentTemplateId === template.id
                                            ? 'border-blue-500 ring-4 ring-blue-50'
                                            : 'border-gray-100 hover:border-blue-200'
                                            }`}
                                    >
                                        {/* Template Thumbnail Preview */}
                                        <div className="aspect-[3/4] bg-gray-100 flex flex-col items-center overflow-hidden relative group-hover:bg-gray-200 transition-colors border-b p-2">
                                            <div className="w-[210mm] min-h-[297mm] transform scale-[0.12] origin-top shadow-md border border-gray-200 pointer-events-none bg-white">
                                                <ResumePreview templateId={template.id} />
                                            </div>
                                        </div>

                                        {/* Recommended Badge */}
                                        {template.isRecommended && (
                                            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm">
                                                Recommended
                                            </div>
                                        )}

                                        {/* Premium Lock */}
                                        {template.isPremium && userPlan === 'FREE' && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg">
                                                <FaLock size={10} />
                                            </div>
                                        )}

                                        {/* Selection Overlay */}
                                        {currentTemplateId === template.id && (
                                            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                                <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                                                    <FaCheck size={12} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-3 bg-white border-t">
                                            <p className="text-xs font-bold text-gray-900 truncate">{template.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 bg-gray-50 border-t mt-auto">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                            >
                                Use this template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
