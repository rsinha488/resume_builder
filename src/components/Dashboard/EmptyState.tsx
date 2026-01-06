'use client';
import { FaPlus, FaFileAlt } from 'react-icons/fa';

interface EmptyStateProps {
    readonly type: 'resumes' | 'coverLetters';
    readonly onCreate: () => void;
}

export default function EmptyState({ type, onCreate }: EmptyStateProps) {
    return (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100 max-w-4xl mx-auto px-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
                No {type === 'resumes' ? 'resumes' : 'cover letters'} yet
            </h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
                Create your first {type === 'resumes' ? 'professional resume' : 'matching cover letter'} and land your dream job.
            </p>
            <button
                onClick={onCreate}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl shadow-primary-600/20"
            >
                <FaPlus className="mr-3" /> Create New {type === 'resumes' ? 'Resume' : 'Letter'}
            </button>
        </div>
    );
}
