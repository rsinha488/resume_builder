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
        <div className="fixed bottom-0 md:bottom-8 left-0 md:left-[clamp(2rem,5vw,6rem)] lg:left-[calc(6rem+clamp(2rem,5vw,6rem))] right-0 md:right-[clamp(2rem,5vw,6rem)] glass-premium md:rounded-[2rem] px-5 sm:px-10 py-5 flex justify-between items-center z-40 animate-fade-in-up [animation-delay:200ms] border-t md:border border-white/20">
            <div className="flex gap-3 sm:gap-4">
                <button
                    onClick={onBack}
                    disabled={isFirstStep}
                    className="btn-secondary !h-12 !px-5 !rounded-2xl !text-[11px] flex items-center gap-2 group disabled:opacity-30 shadow-sm"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="font-bold uppercase tracking-widest hidden xs:inline">Back</span>
                </button>

                <button
                    onClick={onTogglePreview}
                    className="xl:hidden flex items-center gap-2 px-5 !h-12 bg-surface-900 text-white rounded-2xl hover:bg-surface-800 transition-all text-[11px] font-black shadow-xl shadow-surface-900/20 active:scale-95"
                >
                    {showPreview ? <FaEdit size={12} /> : <FaEye size={12} />}
                    <span className="uppercase tracking-widest">{showPreview ? 'Edit' : 'Preview'}</span>
                </button>
            </div>

            <div className="flex gap-3 sm:gap-5">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="hidden sm:flex items-center gap-2 px-6 !h-12 bg-white border border-surface-200 text-surface-600 rounded-2xl hover:bg-surface-50 hover:-translate-y-0.5 transition-all text-[11px] font-black shadow-sm"
                >
                    <FaSave className={`${saving ? 'animate-spin' : ''}`} /> 
                    <span className="uppercase tracking-widest">{saving ? 'Saving...' : 'Save'}</span>
                </button>

                <button
                    onClick={onNext}
                    className="btn-primary !h-12 !px-8 sm:!px-12 !rounded-2xl !text-[11px] group flex items-center gap-2 grow sm:grow-0 justify-center"
                >
                    <span className="font-black uppercase tracking-widest">
                        {isLastStep ? 'Finish' : 'Continue'}
                    </span>
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
