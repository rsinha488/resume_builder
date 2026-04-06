'use client';
import { useAppSelector } from '@/lib/hooks';
import { calculateAtsScore } from '@/lib/atsScorer';
import { FaExclamationCircle, FaLightbulb, FaCheckCircle, FaMagic, FaSpinner, FaBullseye, FaChartBar, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

interface AtsScoreDisplayProps {
    readonly userPlan: 'FREE' | 'PRO';
    readonly aiUsageCount: number;
    readonly onUsageUpdate: (count: number) => void;
    readonly onUpgrade: () => void;
    readonly onFixClick?: (section: string) => void;
}

export default function AtsScoreDisplay({ userPlan, aiUsageCount, onUsageUpdate, onUpgrade, onFixClick }: AtsScoreDisplayProps) {
    const resume = useAppSelector((state: { resume: ResumeState }) => state.resume);
    const [jobDescription, setJobDescription] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [deepAnalysis, setDeepAnalysis] = useState<any>(null);

    const { score: rawScore, suggestions } = calculateAtsScore(resume);
    const score = Number.isNaN(rawScore) ? 0 : rawScore;

    const handleDeepScan = async () => {
        if (!jobDescription.trim()) {
            toast.error('Please paste a job description first!');
            return;
        }

        if (userPlan === 'FREE' && aiUsageCount >= 50) {
            onUpgrade();
            return;
        }

        setAnalyzing(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('/api/ai/analyze-ats', {
                resume,
                jobDescription
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setDeepAnalysis(res.data.analysis);
            if (res.data.newUsageCount !== undefined) {
                onUsageUpdate(res.data.newUsageCount);
            }
            toast.success('Deep scan complete! Check your updated report below.');
        } catch (error: any) {
            console.error('Deep scan error:', error);
            const msg = error.response?.data?.error || 'Analysis failed. Please try again.';
            toast.error(msg);
        } finally {
            setAnalyzing(false);
        }
    };

    const getBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50';
        if (score >= 50) return 'bg-amber-50';
        return 'bg-red-50';
    };

    const getScoreVariant = (val: number) => {
        if (val >= 80) return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
        if (val >= 50) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    };

    const criticalItems = suggestions.filter(s => s.type === 'critical');
    const optimizationItems = suggestions.filter(s => s.type === 'improvement');
    const successItems = suggestions.filter(s => s.type === 'success');

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* AI Deep Scan Controller */}
            <div className="premium-card p-8 bg-gradient-to-br from-surface-950 to-surface-900 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-primary-600/20 transition-all duration-1000" />
                
                <div className="relative space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <FaMagic className="text-primary-400" />
                            </div>
                            <div>
                                <h3 className="font-black tracking-tight">AI Analysis Studio</h3>
                                <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">Market-Grade Deep Scan</p>
                            </div>
                        </div>
                        {userPlan === 'FREE' && (
                            <span className="text-[10px] font-bold text-surface-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                                Free AI Uses: {aiUsageCount}/50
                            </span>
                        )}
                    </div>

                    <div className="relative pt-2">
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-surface-400 focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none resize-none transition-all"
                            placeholder="Paste the Job Description (JD) here for a specific match rate analysis..."
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={handleDeepScan}
                                disabled={analyzing || !jobDescription.trim()}
                                className="group/btn relative px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-800 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-600/20 transition-all disabled:opacity-50 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                <span className="relative flex items-center gap-2">
                                    {analyzing 
                                        ? <><FaSpinner className="animate-spin" aria-hidden="true" /> Analyzing...</> 
                                        : <><FaSearch aria-hidden="true" /> Run Deep Scan</>
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Analysis Results Rendering */}
            {deepAnalysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    {/* Match Rate & Gauge */}
                    <div className={`premium-card p-10 flex flex-col items-center text-center ${getScoreVariant(deepAnalysis.matchRate).bg}`}>
                        <div className="relative w-40 h-40 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-white/40 stroke-current" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path
                                    className={`${getScoreVariant(deepAnalysis.matchRate).color} stroke-current transition-all duration-1000`}
                                    strokeWidth="2.5"
                                    strokeDasharray={`${deepAnalysis.matchRate}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black">{deepAnalysis.matchRate}%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Match Rate</span>
                            </div>
                        </div>
                        <h4 className="font-black text-surface-900 mb-1">JD Compatibility</h4>
                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Against specific job description</p>
                    </div>

                    {/* Impact Meter */}
                    <div className={`premium-card p-10 flex flex-col items-center text-center ${getScoreVariant(deepAnalysis.impactScore).bg}`}>
                        <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-white/40 shadow-inner" />
                            <div className="flex flex-col items-center animate-pulse">
                                <FaBullseye className={`text-4xl ${getScoreVariant(deepAnalysis.impactScore).color} mb-1`} />
                                <span className="text-2xl font-black">{deepAnalysis.impactScore}</span>
                            </div>
                        </div>
                        <h4 className="font-black text-surface-900 mb-1">Impact Scorer</h4>
                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Strength of accomplishments</p>
                    </div>

                    {/* Keyword Gap Analysis */}
                    <div className="premium-card p-10 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-surface-900 text-white flex items-center justify-center">
                                <FaChartBar size={14} />
                            </div>
                            <h4 className="font-black text-surface-900">Keyword Gap Analysis</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest ml-1">Matched Keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {deepAnalysis.foundKeywords?.map((kw: string) => (
                                        <span key={kw} className="px-4 py-2 bg-green-50 text-green-700 text-[10px] font-bold rounded-xl border border-green-100 flex items-center gap-2">
                                            <FaCheckCircle size={10} /> {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Missing from Resume</p>
                                <div className="flex flex-wrap gap-2">
                                    {deepAnalysis.missingKeywords?.map((kw: string) => (
                                        <span key={kw} className="px-4 py-2 bg-red-50 text-red-700 text-[10px] font-bold rounded-xl border border-red-100 flex items-center gap-2">
                                            <FaExclamationCircle size={10} /> {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* General Best Practice Section */}
            {!deepAnalysis && (
                <div className={`p-10 rounded-4xl ${getScoreVariant(score).bg} border border-white/50 shadow-premium flex flex-col items-center text-center relative overflow-hidden transition-all duration-500`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full -mr-10 -mt-10 ${getScoreVariant(score).color.replace('text-', 'bg-')}`} />
                    
                    <div className="relative w-40 h-40 mb-6 drop-shadow-xl">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/40 stroke-current" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path
                                className={`${getScoreVariant(score).color} stroke-current transition-all duration-1000 ease-in-out`}
                                strokeWidth="2.5"
                                strokeDasharray={`${score}, 100`}
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-black ${getScoreVariant(score).color} tracking-tighter`}>{score}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${getScoreVariant(score).color} opacity-70 mt-1`}>Score</span>
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-surface-900 mb-2">Overall Quality Score</h3>
                    <p className="text-sm text-surface-600 font-medium max-w-md leading-relaxed">
                        Industry-standard formatting and context analysis.
                    </p>
                </div>
            )}

            {/* Suggestions Sections */}
            <div className="space-y-10">
                {criticalItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] ml-2">Critical Fixes</h4>
                        <div className="grid gap-3">
                            {criticalItems.map((item: any, i: number) => (
                                <SuggestionCard key={i} item={item} onFixClick={onFixClick} />
                            ))}
                        </div>
                    </div>
                )}

                {optimizationItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] ml-2">Optimization Opportunities</h4>
                        <div className="grid gap-3">
                            {optimizationItems.map((item: any, i: number) => (
                                <SuggestionCard key={i} item={item} onFixClick={onFixClick} />
                            ))}
                        </div>
                    </div>
                )}

                {successItems.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] ml-2">Completed</h4>
                        <div className="grid gap-3">
                            {successItems.map((item: any, i: number) => (
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
                    type="button"
                    onClick={() => onFixClick(item.targetSection)}
                    className="shrink-0 px-4 py-2 bg-white/50 hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-black/5 transition-all active:scale-95 shadow-sm"
                    aria-label={`Fix issue: ${item.message}`}
                >
                    Fix Now
                </button>
            )}
        </div>
    );
}
