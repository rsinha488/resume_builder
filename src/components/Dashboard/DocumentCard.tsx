'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaEllipsisV, FaEdit, FaTrash, FaCopy, FaDownload, FaFileAlt, FaSpinner, FaCrown, FaLock } from 'react-icons/fa';
import ResumePreview from '@/components/Builder/ResumePreview';
import ConfirmModal from '@/components/ConfirmModal';

interface DownloadInfo {
    pdfDownloadCount: number;
    limit: number;
    remaining: number | null;
    isPro: boolean;
    canDownload: boolean;
}

interface DocumentCardProps {
    readonly id: string;
    readonly title: string;
    readonly updatedAt: string;
    readonly type: 'resume' | 'coverLetter';
    readonly templateId?: string;
    readonly resumeData?: any;
    readonly isPro?: boolean;
    readonly downloadInfo?: DownloadInfo | null;
    readonly onDelete: (id: string) => void;
    readonly onDuplicate: (id: string) => void;
    readonly onDownload: (id: string) => void;
    readonly onUpgradeRequired?: () => void;
}

export default function DocumentCard({
    id, title, updatedAt, type, templateId, resumeData,
    isPro = false, downloadInfo, onDelete, onDuplicate, onDownload, onUpgradeRequired
}: DocumentCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingAction, setLoadingAction] = useState<'duplicate' | 'download' | 'delete' | null>(null);

    const editUrl = type === 'resume' ? `/builder/${id}` : `/cover-letter/${id}`;

    // Download access logic
    const isResume = type === 'resume';
    const canDownload = !isResume || isPro || (downloadInfo?.canDownload ?? true);
    const remaining = downloadInfo?.remaining ?? null;
    const isLimitReached = isResume && !isPro && remaining !== null && remaining <= 0;

    const handleDownloadClick = async () => {
        if (isLimitReached) {
            onUpgradeRequired?.();
            setIsMenuOpen(false);
            return;
        }
        setLoadingAction('download');
        await onDownload(id);
        setLoadingAction(null);
        setIsMenuOpen(false);
    };

    // Quota badge color
    const quotaBadgeClass = () => {
        if (!isResume || isPro) return '';
        if (remaining === null) return '';
        if (remaining <= 1) return 'text-red-500 bg-red-50 border-red-200';
        if (remaining <= 2) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    };

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
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-surface-900 truncate uppercase tracking-widest group-hover/card:text-primary-600 transition-colors" title={title}>
                            {title}
                        </h3>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-0.5">
                            {type === 'resume' ? 'Resume' : 'Cover Letter'}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                                isMenuOpen ? 'bg-surface-100 text-surface-900 shadow-inner' : 'text-surface-400 hover:text-surface-900 hover:bg-surface-50'
                            }`}
                            aria-label="Document actions"
                        >
                            <FaEllipsisV size={13} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <button className="fixed inset-0 z-10 w-full h-full" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-52 glass-premium rounded-2xl py-2 z-20 animate-in fade-in zoom-in slide-in-from-top-2 duration-200 shadow-xl">
                                    <Link
                                        href={editUrl}
                                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-all"
                                    >
                                        <FaEdit className="text-surface-400" size={12} /> Edit Document
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-all disabled:opacity-50"
                                        onClick={async () => {
                                            setLoadingAction('duplicate');
                                            await onDuplicate(id);
                                            setLoadingAction(null);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        {loadingAction === 'duplicate' ? <FaSpinner className="animate-spin" size={12} /> : <FaCopy className="text-surface-400" size={12} />}
                                        Duplicate
                                    </button>

                                    {/* Download menu item */}
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${
                                            isLimitReached
                                                ? 'text-amber-600 hover:bg-amber-50'
                                                : 'text-surface-600 hover:bg-surface-50 hover:text-primary-600'
                                        }`}
                                        onClick={handleDownloadClick}
                                    >
                                        {loadingAction === 'download'
                                            ? <FaSpinner className="animate-spin" size={12} />
                                            : isLimitReached
                                                ? <FaLock className="text-amber-500" size={12} />
                                                : <FaDownload className="text-surface-400" size={12} />
                                        }
                                        <span className="flex-1 text-left">Export as PDF</span>
                                        {isLimitReached && (
                                            <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-black uppercase">PRO</span>
                                        )}
                                    </button>

                                    <div className="h-px bg-surface-100/50 my-1.5 mx-3" />
                                    <button
                                        type="button"
                                        disabled={!!loadingAction}
                                        onClick={() => { setShowConfirm(true); setIsMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <FaTrash size={12} /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Download Button (visible on card hover) + Quota indicator */}
                <div className="mt-auto space-y-2">
                    {/* Download button */}
                    {isResume && (
                        <button
                            type="button"
                            disabled={!!loadingAction}
                            onClick={handleDownloadClick}
                            title={isLimitReached ? 'Upgrade to PRO for unlimited PDF downloads' : 'Download PDF'}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-60 ${
                                isLimitReached
                                    ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                                    : 'bg-surface-50 text-surface-600 border border-surface-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
                            }`}
                        >
                            {loadingAction === 'download' ? (
                                <FaSpinner className="animate-spin" size={11} />
                            ) : isLimitReached ? (
                                <><FaCrown size={11} className="text-amber-500" /> Upgrade for PDF</>
                            ) : (
                                <><FaDownload size={11} /> Download PDF</>
                            )}
                        </button>
                    )}

                    {/* Quota badge for FREE users */}
                    {isResume && !isPro && remaining !== null && (
                        <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${quotaBadgeClass()}`}>
                            <span>Free Downloads</span>
                            <span>{remaining} / {downloadInfo?.limit ?? 5} left</span>
                        </div>
                    )}

                    {/* PRO unlimited badge */}
                    {isResume && isPro && (
                        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-100 text-[9px] font-black uppercase tracking-widest text-primary-600">
                            <FaCrown size={9} /> Unlimited Downloads
                        </div>
                    )}

                    {/* Last edited */}
                    <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 h-px bg-surface-100" />
                        <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest whitespace-nowrap">
                            {new Date(updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
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
