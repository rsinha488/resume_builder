'use client';
import { FaChevronLeft, FaChevronRight, FaSave } from 'react-icons/fa';

interface BuilderBottomBarProps {
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    saving: boolean;
}

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
        <div className="fixed bottom-0 left-20 right-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
                onClick={onBack}
                disabled={isFirstStep}
                className="inline-flex items-center px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
            >
                <FaChevronLeft className="mr-2" /> Back
            </button>

            <div className="flex gap-4">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 transition-all font-semibold"
                >
                    <FaSave className="mr-2" /> {saving ? 'Saving...' : 'Save Progress'}
                </button>

                <button
                    onClick={onNext}
                    className="inline-flex items-center px-8 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-600/20"
                >
                    {isLastStep ? 'Finish' : 'Next'} <FaChevronRight className="ml-2" />
                </button>
            </div>
        </div>
    );
}
