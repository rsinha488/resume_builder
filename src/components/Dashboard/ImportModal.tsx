'use client';
import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileWord, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ImportModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB limit.');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/resumes/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            // After parsing, we create the resume in the database
            const createResponse = await axios.post('/api/resumes', {
                title: response.data.title,
                data: response.data.data
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            router.push(`/builder/${createResponse.data.id}`);
            onClose();
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error || 'Failed to import resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Import Existing Resume</h2>
                        <p className="text-gray-500 font-medium">Upload your PDF or DOCX file to get started.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {file ? (
                        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    {file.type === 'application/pdf' ? (
                                        <FaFilePdf className="text-red-500" size={24} />
                                    ) : (
                                        <FaFileWord className="text-blue-500" size={24} />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 truncate max-w-[300px]">{file.name}</p>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                            className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            aria-label="Upload resume file"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.docx,.doc"
                            />
                            <FaCloudUploadAlt className="mx-auto h-16 w-16 text-gray-300 group-hover:text-primary-400 transition-colors mb-4" />
                            <p className="text-lg font-bold text-gray-700 mb-1">Click or drag and drop to upload</p>
                            <p className="text-sm text-gray-400">PDF, DOCX (Max 5MB)</p>
                        </button>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="flex-1 px-6 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" /> Importing...
                                </>
                            ) : (
                                'Start Importing'
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        By uploading your resume, you agree to our terms. Our smart parser will attempt to extract your information, but we recommend reviewing the final result for accuracy.
                    </p>
                </div>
            </div>
        </div>
    );
}
