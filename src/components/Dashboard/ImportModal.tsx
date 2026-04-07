'use client';
import { useState, useRef, useCallback } from 'react';
import {
    FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileWord,
    FaSpinner, FaCheckCircle, FaExclamationTriangle,
    FaInfoCircle, FaRedo, FaArrowRight
} from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ImportModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

type ImportStatus = 'idle' | 'selected' | 'uploading' | 'parsing' | 'success' | 'error';

interface ErrorDetail {
    title: string;
    message: string;
    hint?: string;
    canRetry: boolean;
}

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function classifyError(err: unknown): ErrorDetail {
    const axiosErr = err as AxiosError<{ error?: string; message?: string }>;

    // Network error — no response at all
    if (axiosErr.code === 'ERR_NETWORK' || !axiosErr.response) {
        return {
            title: 'Connection Failed',
            message: 'Unable to reach the server. Please check your internet connection.',
            hint: 'Try refreshing the page if the problem persists.',
            canRetry: true,
        };
    }

    const status = axiosErr.response?.status;
    const backendMsg = axiosErr.response?.data?.error || axiosErr.response?.data?.message;

    if (status === 401) {
        return {
            title: 'Session Expired',
            message: 'Your session has timed out. Please log in again and try importing.',
            canRetry: false,
        };
    }

    if (status === 413) {
        return {
            title: 'File Too Large',
            message: `Your file exceeds the ${MAX_SIZE_MB}MB upload limit.`,
            hint: 'Try compressing your PDF or saving your Word document as a smaller file.',
            canRetry: false,
        };
    }

    if (status === 400) {
        // Map specific backend messages to friendly text
        if (backendMsg?.includes('too large') || backendMsg?.includes('5MB')) {
            return {
                title: 'File Too Large',
                message: `Your file exceeds the ${MAX_SIZE_MB}MB limit.`,
                hint: 'Compress your PDF or reduce image quality in your Word document.',
                canRetry: false,
            };
        }
        if (backendMsg?.includes('Unsupported') || backendMsg?.includes('format')) {
            return {
                title: 'Unsupported File Format',
                message: 'Only PDF and DOCX files are supported.',
                hint: 'Save your resume as a .pdf or .docx and try again.',
                canRetry: false,
            };
        }
        if (backendMsg?.includes('extract') || backendMsg?.includes('text')) {
            return {
                title: 'Could Not Read File',
                message: 'We couldn\'t extract text from your file. It may be image-only or password protected.',
                hint: 'Make sure your PDF has selectable text (not a scanned image) and is not password locked.',
                canRetry: true,
            };
        }
        if (backendMsg?.includes('malicious') || backendMsg?.includes('Invalid')) {
            return {
                title: 'Invalid File',
                message: 'The file you uploaded does not appear to be a valid resume file.',
                hint: 'Please upload an authentic PDF or DOCX resume file.',
                canRetry: false,
            };
        }
        return {
            title: 'Upload Rejected',
            message: backendMsg || 'The file could not be processed.',
            hint: 'Check that your file is a valid PDF or Word document and try again.',
            canRetry: true,
        };
    }

    if (status === 500) {
        return {
            title: 'Server Error',
            message: 'Something went wrong on our end while processing your resume.',
            hint: 'This is usually temporary — please wait a moment and try again.',
            canRetry: true,
        };
    }

    return {
        title: 'Import Failed',
        message: backendMsg || 'An unexpected error occurred.',
        hint: 'Please try again or contact support if the issue continues.',
        canRetry: true,
    };
}

function validateFile(file: File): ErrorDetail | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);

    if (!isValidType) {
        return {
            title: 'Unsupported File Type',
            message: `"${file.name}" is not a supported format.`,
            hint: 'Please upload a .pdf or .docx file. Other formats are not currently supported.',
            canRetry: false,
        };
    }
    if (file.size > MAX_SIZE_BYTES) {
        return {
            title: 'File Too Large',
            message: `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB — exceeds the ${MAX_SIZE_MB}MB limit.`,
            hint: 'Try using a PDF compressor tool online, or save a lighter version of your Word document.',
            canRetry: false,
        };
    }
    if (file.size === 0) {
        return {
            title: 'Empty File',
            message: 'The selected file appears to be empty.',
            hint: 'Make sure your resume has content before uploading.',
            canRetry: false,
        };
    }
    return null;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<ImportStatus>('idle');
    const [error, setError] = useState<ErrorDetail | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    if (!isOpen) return null;

    const resetState = () => {
        setFile(null);
        setStatus('idle');
        setError(null);
    };

    const selectFile = (selected: File) => {
        const validationError = validateFile(selected);
        if (validationError) {
            setError(validationError);
            setStatus('error');
            return;
        }
        setFile(selected);
        setError(null);
        setStatus('selected');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) selectFile(selected);
        // Reset input so the same file can be re-selected after removal
        e.target.value = '';
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) selectFile(dropped);
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        let parsingTimer: NodeJS.Timeout | null = null;
        try {
            setStatus('uploading');
            setError(null);

            // Give users a staged progress feel
            const uploadPromise = axios.post('/api/resumes/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Small delay before switching to "parsing" label
            parsingTimer = setTimeout(() => setStatus('parsing'), 1200);
            const response = await uploadPromise;
            if (parsingTimer) clearTimeout(parsingTimer);

            setStatus('success');
            toast.success('Resume imported successfully!');

            // Brief success state before navigating
            setTimeout(() => {
                router.push(`/builder/${response.data.id}`);
                onClose();
            }, 800);
        } catch (err) {
            if (parsingTimer) clearTimeout(parsingTimer);
            const classified = classifyError(err);
            setError(classified);
            setStatus('error');
            toast.error(classified.title);
        }
    };

    const fileIcon = file?.type === 'application/pdf'
        ? <FaFilePdf className="text-red-500" size={22} />
        : <FaFileWord className="text-blue-500" size={22} />;

    const isProcessing = status === 'uploading' || status === 'parsing';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && !isProcessing && onClose()}
        >
            <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
                    <div>
                        <h2 className="text-base font-black text-surface-900 tracking-tight">Import Resume</h2>
                        <p className="text-xs text-surface-400 font-medium mt-0.5">PDF or DOCX · up to {MAX_SIZE_MB}MB</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-9 h-9 flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-all disabled:opacity-40"
                        aria-label="Close"
                    >
                        <FaTimes size={15} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {/* Success state */}
                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-green-500" size={28} />
                            </div>
                            <p className="font-black text-surface-900 text-lg">Import Successful!</p>
                            <p className="text-sm text-surface-500">Opening your resume editor...</p>
                        </div>
                    )}

                    {/* Processing states */}
                    {isProcessing && (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                            <div className="relative w-14 h-14">
                                <div className="absolute inset-0 bg-primary-50 rounded-full animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaSpinner className="animate-spin text-primary-600" size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="font-black text-surface-900">
                                    {status === 'uploading' ? 'Uploading your file...' : 'Parsing resume content...'}
                                </p>
                                <p className="text-sm text-surface-400 mt-1">
                                    {status === 'uploading'
                                        ? 'Securely transferring your document'
                                        : 'Extracting your experience, skills & education'}
                                </p>
                            </div>
                            <div className="w-48 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-primary-500 rounded-full transition-all duration-700 ${status === 'parsing' ? 'w-full' : 'w-1/2'}`} />
                            </div>
                        </div>
                    )}

                    {/* Drop zone — shown when idle */}
                    {(status === 'idle' || status === 'error') && !file && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                isDragging
                                    ? 'border-primary-500 bg-primary-50 scale-[1.01]'
                                    : 'border-surface-200 hover:border-primary-400 hover:bg-primary-50/30'
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.docx"
                            />
                            <FaCloudUploadAlt
                                className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-primary-500' : 'text-surface-300'}`}
                                size={40}
                            />
                            <p className="text-sm font-black text-surface-700 mb-1">
                                {isDragging ? 'Drop it here!' : 'Click to upload or drag & drop'}
                            </p>
                            <p className="text-xs text-surface-400">PDF or DOCX · max {MAX_SIZE_MB}MB</p>
                        </div>
                    )}

                    {/* Selected file card */}
                    {file && !isProcessing && status !== 'success' && (
                        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                {fileIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-surface-900 text-sm truncate">{file.name}</p>
                                <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mt-0.5">
                                    {file.size < 1024 * 1024
                                        ? `${(file.size / 1024).toFixed(1)} KB`
                                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetState}
                                className="text-xs font-black text-red-500 hover:text-red-700 transition-colors px-2 py-1 hover:bg-red-50 rounded-lg"
                            >
                                Remove
                            </button>
                        </div>
                    )}

                    {/* Error banner */}
                    {error && status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1.5">
                            <div className="flex items-start gap-3">
                                <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
                                <div>
                                    <p className="text-sm font-black text-red-800">{error.title}</p>
                                    <p className="text-sm text-red-600 mt-0.5">{error.message}</p>
                                </div>
                            </div>
                            {error.hint && (
                                <div className="flex items-start gap-3 pl-5">
                                    <FaInfoCircle className="text-red-400 flex-shrink-0 mt-0.5" size={12} />
                                    <p className="text-xs text-red-400 leading-relaxed">{error.hint}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    {!isProcessing && status !== 'success' && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 border border-surface-200 text-surface-600 font-black text-sm rounded-xl hover:bg-surface-50 transition-all uppercase tracking-widest"
                            >
                                Cancel
                            </button>

                            {status === 'error' && error?.canRetry && file && (
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    className="flex-1 py-3.5 bg-primary-600 text-white font-black text-sm rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-primary-600/20"
                                >
                                    <FaRedo size={11} /> Try Again
                                </button>
                            )}

                            {status === 'error' && !file && (
                                <button
                                    type="button"
                                    onClick={() => { setError(null); setStatus('idle'); }}
                                    className="flex-1 py-3.5 bg-surface-900 text-white font-black text-sm rounded-xl hover:bg-surface-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                    Choose File
                                </button>
                            )}

                            {(status === 'selected' || (status === 'error' && error?.canRetry && !file)) && file && (
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={!file}
                                    className="flex-1 py-3.5 bg-primary-600 text-white font-black text-sm rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 uppercase tracking-widest active:scale-[0.98]"
                                    aria-label="Start importing resume"
                                >
                                    Import Resume <FaArrowRight size={11} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer note */}
                {status !== 'success' && !isProcessing && (
                    <div className="px-6 pb-5 pt-1">
                        <p className="text-[11px] text-surface-400 leading-relaxed text-center">
                            Your file is processed securely. We recommend reviewing imported data for accuracy.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
