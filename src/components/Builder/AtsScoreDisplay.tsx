'use client';
import { useAppSelector } from '@/lib/hooks';
import { calculateAtsScore } from '@/lib/atsScorer';
import { FaExclamationCircle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

export default function AtsScoreDisplay({ onFixClick }: { readonly onFixClick?: (section: string) => void }) {
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

    const criticalItems = suggestions.filter(s => s.type === 'critical');
    const optimizationItems = suggestions.filter(s => s.type === 'improvement');
    const successItems = suggestions.filter(s => s.type === 'success');

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

            {/* Suggestions Sections */}
            <div className="space-y-10">
                {criticalItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] ml-2">Critical Fixes</h4>
                        <div className="grid gap-3">
                            {criticalItems.map((item, i) => (
                                <SuggestionCard key={i} item={item} onFixClick={onFixClick} />
                            ))}
                        </div>
                    </div>
                )}

                {optimizationItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] ml-2">Optimization Opportunities</h4>
                        <div className="grid gap-3">
                            {optimizationItems.map((item, i) => (
                                <SuggestionCard key={i} item={item} onFixClick={onFixClick} />
                            ))}
                        </div>
                    </div>
                )}

                {successItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] ml-2">Completed</h4>
                        <div className="grid gap-3">
                            {successItems.map((item, i) => (
                                <SuggestionCard key={i} item={item} onFixClick={onFixClick} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SuggestionCard({ item, onFixClick }: { item: any, onFixClick?: (s: string) => void }) {
    let bgColorClass = 'bg-green-50/30 border-green-100 text-green-900';
    let icon = <FaCheckCircle className="text-green-500 text-lg" />;

    if (item.type === 'critical') {
        bgColorClass = 'bg-red-50/50 border-red-100 text-red-900';
        icon = <FaExclamationCircle className="text-red-500 text-lg" />;
    } else if (item.type === 'improvement') {
        bgColorClass = 'bg-amber-50/50 border-amber-100 text-amber-900';
        icon = <FaLightbulb className="text-amber-500 text-lg" />;
    }

    return (
        <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 hover:shadow-md ${bgColorClass}`}>
            <div className="flex gap-4 items-center">
                <div className="shrink-0">{icon}</div>
                <p className="text-sm font-bold leading-relaxed">{item.message}</p>
            </div>
            {item.targetSection && onFixClick && (
                <button
                    onClick={() => onFixClick(item.targetSection)}
                    className="shrink-0 px-4 py-2 bg-white/50 hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-black/5 transition-all active:scale-95 shadow-sm"
                >
                    Fix Now
                </button>
            )}
        </div>
    );
}
