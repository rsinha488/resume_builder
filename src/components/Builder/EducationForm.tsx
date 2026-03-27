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
        <div className="space-y-8">
            {education?.map((edu, index) => (
                <div key={edu.id} className="p-6 border border-gray-200 rounded-xl relative group bg-gray-50/50">
                    <button
                        onClick={() => {
                            dispatch(removeEducation(edu.id));
                            toast.success('Education removed');
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <FaTrash size={16} />
                    </button>
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Education #{index + 1}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor={`school-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">School / University</label>
                            <input
                                id={`school-${edu.id}`}
                                type="text"
                                value={edu.school}
                                onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Harvard University"
                            />
                        </div>
                        <div>
                            <label htmlFor={`degree-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">Degree</label>
                            <input
                                id={`degree-${edu.id}`}
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Bachelor of Science"
                            />
                        </div>
                        <div>
                            <label htmlFor={`field-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">Field of Study</label>
                            <input
                                id={`field-${edu.id}`}
                                type="text"
                                value={edu.field}
                                onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Computer Science"
                            />
                        </div>
                        <div>
                            <label htmlFor={`location-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                            <input
                                id={`location-${edu.id}`}
                                type="text"
                                value={edu.location}
                                onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Cambridge, MA"
                            />
                        </div>
                        <div>
                            <label htmlFor={`startDate-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                            <input
                                id={`startDate-${edu.id}`}
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Sep 2016"
                            />
                        </div>
                        <div>
                            <label htmlFor={`endDate-${edu.id}`} className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                            <input
                                id={`endDate-${edu.id}`}
                                type="text"
                                value={edu.endDate}
                                onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                                disabled={edu.current}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-100"
                                placeholder="May 2020"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center font-semibold"
            >
                <FaPlus className="mr-2" /> Add Education
            </button>
        </div>
    );
}
