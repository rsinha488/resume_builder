'use client';

interface ProgressBarProps {
    readonly steps: { readonly id: string; readonly title: string }[];
    readonly currentStep: number;
    readonly currentMode: 'templates' | 'design' | 'content' | 'analysis' | 'finalize';
}

export default function ProgressBar({ steps, currentStep, currentMode }: ProgressBarProps) {
    const getProgress = () => {
        if (currentMode === 'templates') return 10;
        if (currentMode === 'design') return 25;
        if (currentMode === 'content') {
            const contentProgress = (currentStep / steps.length) * 50;
            return 25 + contentProgress;
        }
        if (currentMode === 'analysis') return 100;
        return 0;
    };

    const progress = getProgress();

    return (
        <div className="w-full bg-gray-100 h-2 sticky top-0 z-20">
            <div
                className="bg-primary-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
