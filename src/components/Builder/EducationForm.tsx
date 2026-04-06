'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addEducation, updateEducation, removeEducation, Education } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export default function EducationForm() {
    const dispatch = useAppDispatch();
    const education = useAppSelector((state) => state.resume.education);

    const handleAdd = () => {
        const newEdu: Education = {
            id: uuidv4(),
            school: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
        };
        dispatch(addEducation(newEdu));
    };

    const handleChange = (id: string, field: keyof Education, value: any) => {
        const edu = education?.find(e => e.id === id);
        if (edu) {
            dispatch(updateEducation({ ...edu, [field]: value }));
        }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-surface-900 mb-2">Education History</h2>
                    <p className="text-sm text-surface-500 font-medium">Your academic background and certifications.</p>
                </div>
                <div className="px-4 py-2 bg-primary-50 rounded-2xl border border-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest animate-pulse">
                    Step 3 of 5
                </div>
            </div>

            <div className="space-y-8">
                {education?.map((edu, index) => (
                    <div key={edu.id} className="premium-card p-8 relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <button
                            onClick={() => {
                                dispatch(removeEducation(edu.id));
                                toast.success('Education removed');
                            }}
                            className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                            <FaTrash size={16} />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-surface-900 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-black text-surface-900">Education</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor={`school-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">School / University</label>
                                <input
                                    id={`school-${edu.id}`}
                                    type="text"
                                    value={edu.school}
                                    onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Stanford University"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`degree-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Degree / Certification</label>
                                <input
                                    id={`degree-${edu.id}`}
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Master of Science"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`field-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Field of Study</label>
                                <input
                                    id={`field-${edu.id}`}
                                    type="text"
                                    value={edu.field}
                                    onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`location-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Location</label>
                                <input
                                    id={`location-${edu.id}`}
                                    type="text"
                                    value={edu.location}
                                    onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. Palo Alto, CA"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`startDate-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Start Date</label>
                                <input
                                    id={`startDate-${edu.id}`}
                                    type="text"
                                    value={edu.startDate}
                                    onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                                    className="w-full"
                                    placeholder="MM/YYYY"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`endDate-${edu.id}`} className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">End Date</label>
                                <input
                                    id={`endDate-${edu.id}`}
                                    type="text"
                                    value={edu.endDate}
                                    onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                                    disabled={edu.current}
                                    className="w-full"
                                    placeholder={edu.current ? 'Present' : 'MM/YYYY'}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="group w-full py-10 border-4 border-dashed border-surface-100 rounded-4xl text-surface-400 hover:border-primary-500/30 hover:bg-primary-50/30 hover:text-primary-600 transition-all duration-300 flex flex-col items-center justify-center gap-3 animate-fade-in"
            >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <FaPlus className="text-surface-300 group-hover:text-primary-600 transition-colors" size={20} />
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Add Education Record</span>
            </button>
        </div>
    );
}
