'use client';
import { FaPlus, FaFileAlt } from 'react-icons/fa';

interface EmptyStateProps {
    readonly type: 'resumes' | 'coverLetters';
    readonly onCreate: () => void;
    readonly onImport?: () => void;
}

export default function EmptyState({ type, onCreate, onImport }: EmptyStateProps) {
    return (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100 max-w-4xl mx-auto px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FaFileAlt className="h-8 w-8 sm:h-10 sm:w-10 text-gray-200" />
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                No {type === 'resumes' ? 'resumes' : 'cover letters'} yet
            </h3>
            <p className="text-xs sm:text-lg text-gray-500 mb-12 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-widest">
                Create your first {type === 'resumes' ? 'professional resume' : 'matching cover letter'} and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={onCreate}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4.5 bg-primary-600 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-600/20"
                >
                    <FaPlus className="mr-3 text-xs" /> New {type === 'resumes' ? 'Resume' : 'Letter'}
                </button>
                
                {type === 'resumes' && onImport && (
                    <button
                        onClick={onImport}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4.5 bg-white border-2 border-surface-100 text-surface-600 rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-surface-50 hover:border-surface-200 transition-all hover:scale-103 active:scale-97"
                    >
                        Import Existing
                    </button>
                )}
            </div>
        </div>
    );
}
