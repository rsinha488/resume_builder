'use client';
import { FaChevronLeft, FaChevronRight, FaSave, FaEye, FaEdit } from 'react-icons/fa';

export default function BuilderBottomBar({
    onBack,
    onNext,
    onSave,
    isFirstStep,
    isLastStep,
    saving,
    showPreview,
    onTogglePreview
}: {
    readonly onBack: () => void;
    readonly onNext: () => void;
    readonly onSave: () => void;
    readonly isFirstStep: boolean;
    readonly isLastStep: boolean;
    readonly saving: boolean;
    readonly showPreview: boolean;
    readonly onTogglePreview: () => void;
}) {
    return (
        <div className="fixed bottom-0 left-0 lg:left-24 right-0 glass border-t border-white/20 px-4 sm:px-10 py-4 sm:py-5 flex justify-between items-center z-30 animate-fade-in-up [animation-delay:200ms]">
            <div className="flex gap-2 sm:gap-4">
                <button
                    onClick={onBack}
                    disabled={isFirstStep}
                    className="btn-secondary !h-12 sm:!h-auto !px-4 sm:!px-5 !py-2.5 !rounded-xl !text-[10px] flex items-center gap-2 group disabled:opacity-30"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="font-bold uppercase tracking-widest hidden xs:inline">Back</span>
                </button>

                <button
                    onClick={onTogglePreview}
                    className="xl:hidden flex items-center gap-2 px-4 !h-12 sm:!h-auto py-2.5 bg-surface-900 text-white rounded-xl hover:bg-surface-800 transition-all text-[10px] font-bold shadow-lg shadow-surface-900/20"
                >
                    {showPreview ? <FaEdit /> : <FaEye />}
                    <span className="uppercase tracking-widest">{showPreview ? 'Edit' : 'Preview'}</span>
                </button>
            </div>

            <div className="flex gap-2 sm:gap-5">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="hidden sm:flex items-center gap-2 px-5 !h-12 sm:!h-auto py-2.5 bg-white border border-surface-200 text-surface-600 rounded-xl hover:bg-surface-50 hover:-translate-y-0.5 transition-all text-[10px] font-bold"
                >
                    <FaSave className={`${saving ? 'animate-spin' : ''}`} /> 
                    <span className="uppercase tracking-widest">{saving ? 'Saving...' : 'Save'}</span>
                </button>

                <button
                    onClick={onNext}
                    className="btn-primary !h-12 sm:!h-auto !px-6 sm:!px-10 !py-2.5 !rounded-xl !text-[10px] group flex items-center gap-2"
                >
                    <span className="font-black uppercase tracking-widest">
                        {isLastStep ? 'Finish' : 'Next'}
                    </span>
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
