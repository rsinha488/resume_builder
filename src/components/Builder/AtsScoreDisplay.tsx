'use client';
import { useAppSelector } from '@/lib/hooks';
import { calculateAtsScore } from '@/lib/atsScorer';
import { FaExclamationCircle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

export default function AtsScoreDisplay() {
    const resume = useAppSelector((state) => state.resume);
    const { score: rawScore, suggestions } = calculateAtsScore(resume);
    const score = Number.isNaN(rawScore) ? 0 : rawScore;

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
        <div className="space-y-12 animate-fade-in-up">
            {/* Score Card */}
            <div className={`p-10 rounded-4xl ${getBgColor(score)} border border-white/50 shadow-premium flex flex-col items-center text-center relative overflow-hidden transition-all duration-500`}>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full -mr-10 -mt-10 ${getScoreColor(score).replace('text-', 'bg-')}`} />
                
                <div className="relative w-40 h-40 mb-6 drop-shadow-xl">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-white/40 stroke-current"
                            strokeWidth="2.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className={`${getScoreColor(score)} stroke-current transition-all duration-1000 ease-in-out`}
                            strokeWidth="2.5"
                            strokeDasharray={`${score}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-black ${getScoreColor(score)} tracking-tighter`}>{score}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${getScoreColor(score)} opacity-70 mt-1`}>Score</span>
                    </div>
                </div>
                
                <h3 className="text-2xl font-black text-surface-900 mb-2">ATS Optimization Score</h3>
                <p className="text-sm text-surface-600 font-medium max-w-md leading-relaxed">
                    We've analyzed your content against industry-standard filters. 
                </p>
            </div>

            {/* Suggestions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Quality Report</h4>
                    <span className="text-[10px] font-bold text-surface-400">{suggestions.length} Improvements found</span>
                </div>
                
                <div className="grid gap-4">
                    {suggestions.map((suggestion, index) => {
                        let bgColorClass = 'bg-green-50/50 border-green-100/50 text-green-900 hover:bg-green-50';
                        if (suggestion.type === 'critical') {
                            bgColorClass = 'bg-red-50/50 border-red-100/50 text-red-900 group hover:bg-red-50';
                        } else if (suggestion.type === 'improvement') {
                            bgColorClass = 'bg-amber-50/50 border-amber-100/50 text-amber-900 hover:bg-amber-50';
                        }

                        return (
                            <div
                                key={`${suggestion.type}-${index}`}
                                className={`flex gap-4 p-5 rounded-3xl border transition-all duration-300 animate-fade-in-up shadow-sm hover:translate-x-1 ${bgColorClass}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {suggestion.type === 'critical' && <FaExclamationCircle className="text-red-500 text-lg" />}
                                    {suggestion.type === 'improvement' && <FaLightbulb className="text-amber-500 text-lg" />}
                                    {suggestion.type === 'success' && <FaCheckCircle className="text-green-500 text-lg" />}
                                </div>
                                <p className="text-sm font-bold leading-relaxed">{suggestion.message}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
