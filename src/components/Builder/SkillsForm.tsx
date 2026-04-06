'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateSkills } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

export default function SkillsForm() {
    const dispatch = useAppDispatch();
    const skills = useAppSelector((state) => state.resume.skills);
    const [newSkill, setNewSkill] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills?.includes(newSkill.trim())) {
            dispatch(updateSkills([...skills, newSkill.trim()]));
            setNewSkill('');
            toast.success('Skill added');
        }
    };

    const handleRemove = (skillToRemove: string) => {
        dispatch(updateSkills(skills?.filter(s => s !== skillToRemove)));
        toast.success('Skill removed');
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-surface-900 mb-2">Technical Skills</h2>
                    <p className="text-sm text-surface-500 font-medium">What are your core strengths?</p>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-2xl border border-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest animate-pulse">
                    Step 4 of 5
                </div>
            </div>

            <div className="premium-card p-8 space-y-8">
                <form onSubmit={handleAdd} className="flex gap-4">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="w-full pl-6 pr-12 py-4 bg-surface-50 border-surface-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                            placeholder="e.g. React, Python, UI Design..."
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-surface-300">
                            <FaPlus size={14} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn-primary !px-8 !py-4 !rounded-2xl !text-xs !font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        Add Skill
                    </button>
                </form>

                <div className="flex flex-wrap gap-3">
                    {skills?.map((skill, index) => (
                        <div
                            key={skill}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-surface-100 text-surface-700 text-xs font-bold shadow-sm hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="uppercase tracking-wider">{skill}</span>
                            <button
                                onClick={() => handleRemove(skill)}
                                className="w-5 h-5 rounded-lg flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    ))}
                    
                    {skills?.length === 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center text-surface-300 gap-4 border-2 border-dashed border-surface-100 rounded-3xl">
                            <div className="w-16 h-16 rounded-full bg-surface-50 flex items-center justify-center">
                                <FaPlus size={20} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Add your top skills to stand out</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-6 bg-primary-50/50 rounded-3xl border border-primary-100/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                    💡
                </div>
                <div>
                    <h4 className="text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Pro Tip</h4>
                    <p className="text-xs text-primary-700 leading-relaxed font-medium"> List skills mentioned in the job description to increase your chances of passing ATS systems.</p>
                </div>
            </div>
        </div>
    );
}
