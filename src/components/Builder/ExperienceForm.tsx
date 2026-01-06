'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addExperience, updateExperience, removeExperience, Experience } from '@/lib/features/resume/resumeSlice';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

export default function ExperienceForm() {
    const dispatch = useAppDispatch();
    const experiences = useAppSelector((state) => state.resume.experiences);

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

    const handleChange = (id: string, field: keyof Experience, value: any) => {
        const exp = experiences?.find(e => e.id === id);
        if (exp) {
            dispatch(updateExperience({ ...exp, [field]: value }));
        }
    };

    return (
        <div className="space-y-8">
            {experiences?.map((exp, index) => (
                <div key={exp.id} className="p-6 border border-gray-200 rounded-xl relative group bg-gray-50/50">
                    <button
                        onClick={() => dispatch(removeExperience(exp.id))}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <FaTrash size={16} />
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Experience #{index + 1}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
                            <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Senior Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                            <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Jan 2020"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                            <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                                disabled={exp.current}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-100"
                                placeholder="Present"
                            />
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-gray-700">
                                I currently work here
                            </label>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                value={exp.description}
                                onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center font-semibold"
            >
                <FaPlus className="mr-2" /> Add Experience
            </button>
        </div>
    );
}
