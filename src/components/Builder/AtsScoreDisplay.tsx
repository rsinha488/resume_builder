'use client';
import { useAppSelector } from '@/lib/hooks';
import { calculateAtsScore } from '@/lib/atsScorer';
import { FaExclamationCircle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

export default function AtsScoreDisplay() {
    const resume = useAppSelector((state) => state.resume);
    const { score, suggestions } = calculateAtsScore(resume);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-600';
    };

    const getBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50';
        if (score >= 50) return 'bg-amber-50';
        return 'bg-red-50';
    };

    return (
        <div className="space-y-8">
            <div className={`p-8 rounded-2xl ${getBgColor(score)} border border-white/50 shadow-sm flex flex-col items-center text-center`}>
                <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200 stroke-current"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className={`${getScoreColor(score)} stroke-current transition-all duration-1000 ease-out`}
                            strokeWidth="3"
                            strokeDasharray={`${score}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-black ${getScoreColor(score)}`}>{score}</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">ATS Optimization Score</h3>
                <p className="text-sm text-gray-600">
                    This score represents how well your resume is optimized for Applicant Tracking Systems.
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Suggestions</h4>
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 p-4 rounded-xl border transition-all ${suggestion.type === 'critical'
                                    ? 'bg-red-50 border-red-100 text-red-800'
                                    : suggestion.type === 'improvement'
                                        ? 'bg-amber-50 border-amber-100 text-amber-800'
                                        : 'bg-green-50 border-green-100 text-green-800'
                                }`}
                        >
                            <div className="mt-0.5">
                                {suggestion.type === 'critical' && <FaExclamationCircle className="text-red-500" />}
                                {suggestion.type === 'improvement' && <FaLightbulb className="text-amber-500" />}
                                {suggestion.type === 'success' && <FaCheckCircle className="text-green-500" />}
                            </div>
                            <p className="text-sm font-medium">{suggestion.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
