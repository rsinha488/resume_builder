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
        <div className="w-full bg-surface-100/50 backdrop-blur-sm h-1.5 sticky top-0 z-30 border-b border-white/5">
            <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(99,102,241,0.4)] relative"
                style={{ width: `${progress}%` }}
            >
                {/* Glow effect at the tip */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 blur-sm" />
            </div>
        </div>
    );
}
