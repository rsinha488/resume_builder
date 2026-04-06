'use client';
import { FaChevronLeft, FaChevronRight, FaSave } from 'react-icons/fa';

export default function BuilderBottomBar({
    onBack,
    onNext,
    onSave,
    isFirstStep,
    isLastStep,
    saving
}: {
    readonly onBack: () => void;
    readonly onNext: () => void;
    readonly onSave: () => void;
    readonly isFirstStep: boolean;
    readonly isLastStep: boolean;
    readonly saving: boolean;
}) {
    return (
        <div className="fixed bottom-0 left-24 right-0 glass border-t border-white/20 px-10 py-5 flex justify-between items-center z-10 animate-fade-in-up [animation-delay:200ms]">
            <button
                onClick={onBack}
                disabled={isFirstStep}
                className="btn-secondary !px-5 !py-2.5 !rounded-xl !text-sm flex items-center gap-2 group disabled:opacity-30 disabled:hover:translate-y-0"
            >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="font-bold uppercase tracking-widest text-[10px]">Back</span>
            </button>

            <div className="flex gap-5">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-surface-200 text-surface-600 rounded-xl hover:bg-surface-50 hover:-translate-y-0.5 active:scale-95 transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                >
                    <FaSave className={`${saving ? 'animate-spin' : ''}`} /> 
                    <span className="uppercase tracking-widest text-[10px]">{saving ? 'Saving...' : 'Save Progress'}</span>
                </button>

                <button
                    onClick={onNext}
                    className="btn-primary !px-10 !py-2.5 !rounded-xl !text-sm group flex items-center gap-2"
                >
                    <span className="font-black uppercase tracking-widest text-[10px]">
                        {isLastStep ? 'Finish & Download' : 'Next Step'}
                    </span>
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
