'use client';

import React from 'react';
import { FaTimes, FaCheck, FaLock, FaMagic } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { TEMPLATES } from '@/lib/templates';
import { COLOR_PALETTES } from '@/lib/themes';
import { updateTemplate, updateThemeColor } from '@/lib/features/resume/resumeSlice';
import { updateTemplate as updateCLTemplate, updateThemeColor as updateCLThemeColor } from '@/lib/features/coverLetter/coverLetterSlice';
import ResumePreview from './ResumePreview';
import CoverLetterPreview from './CoverLetterPreview';

interface TemplateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'resume' | 'cover-letter';
    userPlan: string;
    onUpgrade: () => void;
}

export default function TemplateSelectionModal({
    isOpen,
    onClose,
    mode,
    userPlan,
    onUpgrade
}: TemplateSelectionModalProps) {
    const dispatch = useAppDispatch();

    // Get current state based on mode
    const resumeState = useAppSelector((state) => state.resume);
    const coverLetterState = useAppSelector((state) => state.coverLetter);

    const currentTemplateId = mode === 'resume' ? resumeState.templateId : coverLetterState.templateId;
    const currentThemeColor = mode === 'resume' ? resumeState.themeColor : coverLetterState.themeColor;

    if (!isOpen) return null;

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
            <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-4 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <FaMagic />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Change template</h2>
                            <p className="text-sm text-gray-500">Choose a design that fits your professional style</p>
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
                    <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center p-8 overflow-y-auto border-r">
                        <div className="w-full max-w-[600px] transform scale-[0.7] origin-top shadow-2xl">
                            {mode === 'resume' ? <ResumePreview /> : <CoverLetterPreview />}
                        </div>
                    </div>

                    {/* Right Panel: Controls */}
                    <div className="w-full lg:w-[450px] flex flex-col bg-white overflow-y-auto">
                        {/* Color Selection */}
                        <div className="p-8 border-b">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Choose color:</h3>
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
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Choose template:</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {TEMPLATES.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => handleTemplateSelect(template.id, template.isPremium)}
                                        className={`group relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${currentTemplateId === template.id
                                            ? 'border-blue-500 ring-4 ring-blue-50'
                                            : 'border-gray-100 hover:border-blue-200'
                                            }`}
                                    >
                                        {/* Template Thumbnail Placeholder */}
                                        <div className="aspect-[3/4] bg-gray-50 flex flex-col items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                                            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xs text-center p-2">
                                                {template.name}
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
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 bg-gray-50 border-t mt-auto">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                            >
                                Use this template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
