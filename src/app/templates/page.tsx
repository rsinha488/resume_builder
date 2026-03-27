'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { TEMPLATES } from '@/lib/templates';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import ResumePreview from '@/components/Builder/ResumePreview';
import { FaCrown, FaMagic, FaArrowRight } from 'react-icons/fa';
import { toast } from 'sonner';

export default function TemplatesPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleUseTemplate = async (templateId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(templateId);
        try {
            const response = await axios.post('/api/resumes', {
                title: 'Untitled Resume',
                data: {
                    personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', address: '', summary: '' },
                    experiences: [],
                    education: [],
                    skills: [],
                    themeColor: '#2563eb',
                    fontFamily: 'Inter, sans-serif',
                    templateId: templateId,
                    margins: 96,
                    lineSpacing: 1.5,
                    sectionSpacing: 24,
                    fontSize: 'medium'
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('New resume created with selected template!');
            router.push(`/builder/${response.data.id}`);
        } catch (error) {
            console.error('Error creating resume:', error);
            toast.error('Failed to create resume. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Choose Your <span className="text-primary-600">Template</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Select from our professionally designed, ATS-optimized templates to get started on your career journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {TEMPLATES.map((template) => (
                        <div
                            key={template.id}
                            className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Template Preview Area */}
                            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                                <div className="absolute inset-0 flex flex-col items-center p-8">
                                    <div className="w-[210mm] min-h-[297mm] transform scale-[0.18] origin-top shadow-2xl border border-gray-200 bg-white transition-transform duration-500 group-hover:scale-[0.20]">
                                        <ResumePreview templateId={template.id} />
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-primary-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8">
                                    <button
                                        onClick={() => handleUseTemplate(template.id)}
                                        disabled={loading !== null}
                                        className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-3"
                                    >
                                        {loading === template.id ? (
                                            <div className="w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Use This Template <FaArrowRight /></>
                                        )}
                                    </button>
                                </div>

                                {template.isPremium && (
                                    <div className="absolute top-6 right-6 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm">
                                        <FaCrown /> Premium
                                    </div>
                                )}

                                {template.isRecommended && (
                                    <div className="absolute top-6 left-6 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm">
                                        <FaMagic /> Recommended
                                    </div>
                                )}
                            </div>

                            {/* Template Info */}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-2xl font-black text-gray-900">{template.name}</h3>
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                                    {template.description}
                                </p>
                                <button
                                    onClick={() => handleUseTemplate(template.id)}
                                    disabled={loading !== null}
                                    className="w-full py-4 rounded-xl font-bold border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {loading === template.id ? 'Creating...' : 'Select Template'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white font-bold text-xs">
                            R
                        </div>
                        <span className="text-sm font-bold text-gray-900 tracking-tight">RESUMEBUILDER</span>
                    </div>
                    <p className="text-sm text-gray-500">© 2025 ResumeBuilder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
