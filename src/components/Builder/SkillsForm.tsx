'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateSkills } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function SkillsForm() {
    const dispatch = useAppDispatch();
    const skills = useAppSelector((state) => state.resume.skills);
    const [newSkill, setNewSkill] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills?.includes(newSkill.trim())) {
            dispatch(updateSkills([...skills, newSkill.trim()]));
            setNewSkill('');
        }
    };

    const handleRemove = (skillToRemove: string) => {
        dispatch(updateSkills(skills?.filter(s => s !== skillToRemove)));
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Add a skill (e.g. React, Project Management)"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center"
                >
                    <FaPlus className="mr-2" /> Add
                </button>
            </form>

            <div className="flex flex-wrap gap-3">
                {skills?.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold border border-primary-100 group"
                    >
                        {skill}
                        <button
                            onClick={() => handleRemove(skill)}
                            className="ml-2 text-primary-400 hover:text-primary-600 transition-colors"
                        >
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {skills?.length === 0 && (
                <p className="text-center text-gray-500 py-8 italic">
                    No skills added yet. Add your top skills to stand out!
                </p>
            )}
        </div>
    );
}
