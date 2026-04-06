'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaEllipsisV, FaEdit, FaTrash, FaCopy, FaDownload, FaFileAlt, FaSpinner } from 'react-icons/fa';
import ResumePreview from '@/components/Builder/ResumePreview';
import ConfirmModal from '@/components/ConfirmModal';

interface DocumentCardProps {
    readonly id: string;
    readonly title: string;
    readonly updatedAt: string;
    readonly type: 'resume' | 'coverLetter';
    readonly templateId?: string;
    readonly resumeData?: any;
    readonly onDelete: (id: string) => void;
    readonly onDuplicate: (id: string) => void;
    readonly onDownload: (id: string) => void;
}

export default function DocumentCard({ id, title, updatedAt, type, templateId, resumeData, onDelete, onDuplicate, onDownload }: DocumentCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingAction, setLoadingAction] = useState<'duplicate' | 'download' | 'delete' | null>(null);

    const editUrl = type === 'resume' ? `/builder/${id}` : `/cover-letter/${id}`;

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col">
            {/* Preview */}
            <Link href={editUrl} className="aspect-[3/4] bg-gray-100 relative overflow-hidden block rounded-t-2xl">
                {templateId && resumeData ? (
                    <>
                        <div className="absolute inset-0 overflow-hidden flex items-start justify-center pt-2">
                            <div style={{
                                width: '794px',
                                minHeight: '1123px',
                                transform: 'scale(0.27)',
                                transformOrigin: 'top center',
                                flexShrink: 0,
                                pointerEvents: 'none',
                            }}>
                                <ResumePreview templateId={templateId} data={{ ...resumeData, templateId }} />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-primary-600/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                                Edit {type === 'resume' ? 'Resume' : 'Letter'}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-12 group-hover:bg-primary-50/30 transition-colors">
                        <div className="relative">
                            <FaFileAlt className="h-32 w-32 text-gray-200 group-hover:text-primary-100 transition-colors duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                                    Edit {type === 'resume' ? 'Resume' : 'Letter'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate flex-1" title={title}>
                        {title}
                    </h3>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            aria-label="Document actions"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                        >
                            <FaEllipsisV size={14} aria-hidden="true" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <button
                                    className="fixed inset-0 z-10 w-full h-full cursor-default outline-none"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Close menu"
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
                                    <Link
                                        href={editUrl}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <FaEdit className="text-gray-400" /> Edit
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        onClick={async () => { 
                                            setLoadingAction('duplicate');
                                            await onDuplicate(id); 
                                            setLoadingAction(null);
                                            setIsMenuOpen(false); 
                                        }}
                                        aria-label="Duplicate this document"
                                        aria-busy={loadingAction === 'duplicate'}
                                    >
                                        {loadingAction === 'duplicate' ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaCopy className="text-gray-400" aria-hidden="true" />} Duplicate
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        onClick={async () => { 
                                            setLoadingAction('download');
                                            await onDownload(id); 
                                            setLoadingAction(null);
                                            setIsMenuOpen(false); 
                                        }}
                                        aria-label="Download as PDF"
                                        aria-busy={loadingAction === 'download'}
                                    >
                                        {loadingAction === 'download' ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaDownload className="text-gray-400" aria-hidden="true" />} Download
                                    </button>
                                    <div className="h-px bg-gray-100 my-1" />
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        onClick={() => { setShowConfirm(true); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        aria-label="Delete this document"
                                    >
                                        <FaTrash aria-hidden="true" /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-auto">
                    Updated {new Date(updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title={`Delete ${type === 'resume' ? 'Resume' : 'Cover Letter'}`}
                message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={async () => { 
                    setLoadingAction('delete');
                    await onDelete(id); 
                    setLoadingAction(null);
                    setShowConfirm(false); 
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}
