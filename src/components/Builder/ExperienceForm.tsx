'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addExperience, updateExperience, removeExperience, Experience } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTrash, FaMagic, FaSpinner } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useState } from 'react';
import axios from 'axios';

interface ExperienceFormProps {
    readonly userPlan: 'FREE' | 'PRO';
    readonly aiUsageCount?: number;
    readonly onUsageUpdate?: (count: number) => void;
    readonly onUpgrade: () => void;
}

const MONTHS = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
];

const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function ExperienceForm({ userPlan, aiUsageCount, onUsageUpdate, onUpgrade }: ExperienceFormProps) {
    const dispatch = useAppDispatch();
    const experiences = useAppSelector((state) => state.resume.experiences);
    const personalInfo = useAppSelector((state) => state.resume.personalInfo);

    // Add state per experience (keyed by experience id)
    const [rewriting, setRewriting] = useState<string | null>(null);

    const handleAdd = () => {
        const newExp: Experience = {
            id: uuidv4(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        };
        dispatch(addExperience(newExp));
    };

    const parseDateValue = (dateStr: string | undefined) => {
        if (!dateStr) return { month: '', year: '' };
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            return { month: parts[0] || '', year: parts[1] || '' };
        }
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            // Legacy YYYY-MM
            if (parts[0].length === 4) return { month: parts[1] || '', year: parts[0] };
            return { month: parts[0] || '', year: parts[1] || '' };
        }
        return { month: '', year: '' };
    };

    const handleChange = (id: string, field: keyof Experience, value: any) => {
        const exp = experiences?.find(e => e.id === id);
        if (exp) {
            dispatch(updateExperience({ ...exp, [field]: value }));
        }
    };

    const handleDateChange = (id: string, field: 'startDate' | 'endDate', month: string, year: string) => {
        // Save whatever we have so the UI updates the dropdown immediately
        handleChange(id, field, `${month}/${year}`);
    };

    const handleRewriteBullet = async (expId: string, description: string, jobTitle: string) => {
        if (userPlan === 'FREE' && (aiUsageCount || 0) >= 50) {
            onUpgrade();
            return;
        }

        setRewriting(expId);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('/api/ai/rewrite-bullet',
                { description, jobTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const exp = experiences?.find(e => e.id === expId);
            if (exp) {
                dispatch(updateExperience({ ...exp, description: res.data.rewritten }));
            }
            if (onUsageUpdate && res.data.newUsageCount !== undefined) {
                onUsageUpdate(res.data.newUsageCount);
            }
            toast.success('Description rewritten!');
        } catch (error: any) {
            console.error('Rewrite bullet error:', error);
            const msg = error.response?.data?.error || 'Failed to rewrite. Please try again.';
            toast.error(msg);
        } finally {
            setRewriting(null);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-surface-900 mb-2">Work Experience</h2>
                    <p className="text-sm text-surface-500 font-medium">Highlight your career achievements.</p>
                </div>
                <div className="flex items-center gap-3">
                    {userPlan === 'FREE' && (
                        <span className="text-[10px] font-bold text-surface-500 bg-surface-50 border border-surface-200 px-3 py-1.5 rounded-xl shadow-sm">
                            Free AI Uses: {aiUsageCount || 0}/50
                        </span>
                    )}
                    <div className="px-4 py-2 bg-primary-50 rounded-2xl border border-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest animate-pulse">
                        Step 2 of 5
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {experiences?.map((exp, index) => (
                    <div key={exp.id} className="premium-card p-8 relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <button
                            type="button"
                            aria-label="Remove experience"
                            onClick={() => {
                                dispatch(removeExperience(exp.id));
                                toast.success('Experience removed');
                            }}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                            <FaTrash size={16} />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-surface-900 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-black text-surface-900">Experience</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor={`company-${exp.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Company / Organization</label>
                                <input
                                    id={`company-${exp.id}`}
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`position-${exp.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Your Job Title</label>
                                <input
                                    id={`position-${exp.id}`}
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Senior Product Designer"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Start Date</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={parseDateValue(exp.startDate).month}
                                        onChange={(e) => handleDateChange(exp.id, 'startDate', e.target.value, parseDateValue(exp.startDate).year)}
                                        className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="" disabled>Month</option>
                                        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <select
                                        value={parseDateValue(exp.startDate).year}
                                        onChange={(e) => handleDateChange(exp.id, 'startDate', parseDateValue(exp.startDate).month, e.target.value)}
                                        className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="" disabled>Year</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">End Date</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        disabled={exp.current}
                                        value={exp.current ? '' : parseDateValue(exp.endDate).month}
                                        onChange={(e) => handleDateChange(exp.id, 'endDate', e.target.value, parseDateValue(exp.endDate).year)}
                                        className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-surface-50 disabled:text-surface-300"
                                    >
                                        <option value="" disabled>{exp.current ? 'Present' : 'Month'}</option>
                                        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <select
                                        disabled={exp.current}
                                        value={exp.current ? '' : parseDateValue(exp.endDate).year}
                                        onChange={(e) => handleDateChange(exp.id, 'endDate', parseDateValue(exp.endDate).month, e.target.value)}
                                        className="w-full bg-white border border-surface-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-surface-50 disabled:text-surface-300"
                                    >
                                        <option value="" disabled>{exp.current ? 'Present' : 'Year'}</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-100 transition-colors hover:border-primary-200">
                                <input
                                    type="checkbox"
                                    id={`current-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                                    className="h-5 w-5 !rounded-lg text-primary-600 focus:ring-primary-500 border-surface-300"
                                />
                                <label htmlFor={`current-${exp.id}`} className="text-sm font-bold text-surface-700 select-none cursor-pointer">
                                    I currently work here
                                </label>
                            </div>
                            <div className="sm:col-span-2 space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor={`description-${exp.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest">Job Description</label>
                                    <button
                                        type="button"
                                        aria-label="Rewrite description with AI"
                                        onClick={() => handleRewriteBullet(exp.id, exp.description, personalInfo?.jobTitle || '')}
                                        disabled={rewriting === exp.id || !exp.description?.trim()}
                                        className="flex items-center gap-2 group/magic"
                                    >
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                            rewriting === exp.id 
                                            ? 'bg-surface-100 text-surface-400' 
                                            : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-600/20 active:scale-95'
                                        }`}>
                                            {rewriting === exp.id
                                                ? <><FaSpinner className="animate-spin" size={10} /> Rewriting...</>
                                                : <><FaMagic size={10} className="group-hover/magic:rotate-12 transition-transform" /> Rewrite with Groq AI</>
                                            }
                                        </div>
                                    </button>
                                </div>
                                <textarea
                                    id={`description-${exp.id}`}
                                    value={exp.description}
                                    onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                                    rows={5}
                                    className="w-full resize-none p-5"
                                    placeholder="Focus on achievements and quantifiable results (e.g. Increased sales by 20%...)"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                aria-label="Add work experience"
                onClick={handleAdd}
                className="group w-full py-10 border-4 border-dashed border-surface-100 rounded-4xl text-surface-400 hover:border-primary-500/30 hover:bg-primary-50/30 hover:text-primary-600 transition-all duration-300 flex flex-col items-center justify-center gap-3 animate-fade-in"
            >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <FaPlus className="text-surface-300 group-hover:text-primary-600 transition-colors" size={20} />
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Add Work Experience</span>
            </button>
        </div>
    );
}
