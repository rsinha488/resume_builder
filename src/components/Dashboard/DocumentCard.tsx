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
        <div className="premium-card flex flex-col h-full bg-white group/card overflow-hidden">
            {/* Preview Section */}
            <Link 
                href={editUrl} 
                className="aspect-[3/4] bg-surface-50 relative overflow-hidden block border-b border-surface-100"
            >
                {templateId && resumeData ? (
                    <div className="absolute inset-0 flex items-start justify-center pt-2 group-hover/card:scale-105 transition-transform duration-700 ease-out">
                        <div style={{
                            width: '794px',
                            minHeight: '1123px',
                            transform: 'scale(0.25)',
                            transformOrigin: 'top center',
                            flexShrink: 0,
                            pointerEvents: 'none',
                        }}>
                            <ResumePreview templateId={templateId} data={{ ...resumeData, templateId }} />
                        </div>
                        <div className="absolute inset-0 bg-primary-600/5 sm:bg-primary-600/0 sm:group-hover/card:bg-primary-600/60 transition-all duration-300 flex items-center justify-center">
                            <span className="opacity-0 sm:group-hover/card:opacity-100 bg-white text-primary-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                                Open Editor
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-surface-50 group-hover/card:bg-primary-50/30 transition-colors duration-500">
                        <FaFileAlt className="h-24 w-24 text-surface-200 group-hover/card:text-primary-200 transition-all duration-500 transform group-hover/card:scale-110" />
                        <span className="mt-6 bg-white text-surface-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-surface-100">
                            No Preview
                        </span>
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-surface-900 truncate uppercase tracking-widest group-hover/card:text-primary-600 transition-colors" title={title}>
                            {title}
                        </h3>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-1">
                            {type === 'resume' ? 'RESUME' : 'COVER LETTER'}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                                isMenuOpen ? 'bg-surface-100 text-surface-900 shadow-inner' : 'text-surface-400 hover:text-surface-900 hover:bg-surface-50'
                            }`}
                            aria-label="Document actions"
                        >
                            <FaEllipsisV size={14} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <button className="fixed inset-0 z-10 w-full h-full" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 mt-3 w-56 glass-premium rounded-2xl py-2 z-20 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                                    <Link
                                        href={editUrl}
                                        className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-all"
                                    >
                                        <FaEdit className="text-surface-400" /> Edit Document
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-all disabled:opacity-50"
                                        onClick={async () => { 
                                            setLoadingAction('duplicate');
                                            await onDuplicate(id); 
                                            setLoadingAction(null);
                                            setIsMenuOpen(false); 
                                        }}
                                    >
                                        {loadingAction === 'duplicate' ? <FaSpinner className="animate-spin" /> : <FaCopy className="text-surface-400" />} Duplicate
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-all disabled:opacity-50"
                                        onClick={async () => { 
                                            setLoadingAction('download');
                                            await onDownload(id); 
                                            setLoadingAction(null);
                                            setIsMenuOpen(false); 
                                        }}
                                    >
                                        {loadingAction === 'download' ? <FaSpinner className="animate-spin" /> : <FaDownload className="text-surface-400" />} Export as PDF
                                    </button>
                                    <div className="h-px bg-surface-100/50 my-1 mx-2" />
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        onClick={() => { setShowConfirm(true); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <FaTrash /> Delete Permanently
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-full opacity-20" />
                    </div>
                    <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest whitespace-nowrap">
                        Last edited {new Date(updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>
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
