'use client';
import { FaTrash, FaTimes } from 'react-icons/fa';

interface ConfirmModalProps {
    readonly isOpen: boolean;
    readonly title: string;
    readonly message: string;
    readonly confirmLabel?: string;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm shadow-premium">
            {/* Backdrop for desktop */}
            <button
                className="hidden sm:block absolute inset-0 cursor-default"
                onClick={onCancel}
                aria-label="Close"
            />
            {/* Modal */}
            <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-3xl p-8 flex flex-col justify-center sm:block animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    aria-label="Close"
                >
                    <FaTimes size={16} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FaTrash className="text-red-500" size={20} />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight">{title}</h2>
                </div>

                <p className="text-xs sm:text-base text-gray-500 font-medium mb-10 leading-relaxed uppercase tracking-widest">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
