'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addProject, updateProject, removeProject, Project } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTrash, FaLink, FaLayerGroup, FaChevronDown, FaChevronUp, FaGripVertical } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export default function ProjectForm() {
    const dispatch = useAppDispatch();
    const projects = useAppSelector((state) => state.resume.projects || []);
    const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

    const handleAdd = () => {
        const newId = uuidv4();
        dispatch(addProject({
            id: newId,
            name: '',
            description: '',
            link: '',
            technologies: ''
        }));
        setExpandedId(newId);
    };

    const handleChange = (id: string, field: keyof Project, value: string) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            dispatch(updateProject({ ...project, [field]: value }));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-surface-900 uppercase tracking-tight">Project Portfolio</h2>
                <p className="text-sm text-surface-500 font-medium leading-relaxed">
                    Showcase your best work, side projects, and open-source contributions to demonstrate your hands-on experience.
                </p>
            </div>

            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`bg-white rounded-2xl border transition-all duration-300 ${
                            expandedId === project.id 
                            ? 'border-primary-200 shadow-xl ring-4 ring-primary-50' 
                            : 'border-surface-100 hover:border-surface-200 shadow-sm'
                        }`}
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                            className="w-full px-6 py-5 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-surface-400 group-hover:text-primary-600 transition-colors">
                                    <span className="text-[10px] font-black">{index + 1}</span>
                                </div>
                                <div className="text-left truncate">
                                    <h3 className={`text-sm font-black uppercase tracking-widest transition-colors ${
                                        project.name ? 'text-surface-900' : 'text-surface-400'
                                    }`}>
                                        {project.name || 'Untitled Project'}
                                    </h3>
                                    {project.technologies && (
                                        <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-1">
                                            {project.technologies}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeProject(project.id));
                                        toast.success('Project removed');
                                    }}
                                    className="p-2 text-surface-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <FaTrash size={14} />
                                </button>
                                <div className="text-surface-300">
                                    {expandedId === project.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </div>
                            </div>
                        </button>

                        {expandedId === project.id && (
                            <div className="px-6 pb-8 pt-2 space-y-6 animate-slide-down">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Project Name</label>
                                        <input
                                            type="text"
                                            value={project.name}
                                            onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                                            placeholder="e.g., E-commerce Platform"
                                            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-bold transition-all"
                                        />
                                    </div>

                                    {/* Link */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 flex items-center gap-2">
                                            <FaLink size={10} /> Live Link / Github
                                        </label>
                                        <input
                                            type="url"
                                            value={project.link || ''}
                                            onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-bold transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 flex items-center gap-2">
                                        <FaLayerGroup size={10} /> Tech Stack
                                    </label>
                                    <input
                                        type="text"
                                        value={project.technologies || ''}
                                        onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-bold transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Description & Impact</label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                                        placeholder="Describe what you built and the results you achieved..."
                                        rows={4}
                                        className="w-full px-4 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-medium transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleAdd}
                    className="w-full py-6 border-2 border-dashed border-surface-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-surface-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                        <FaPlus size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Project</span>
                </button>
            </div>
        </div>
    );
}
