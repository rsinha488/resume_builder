'use client';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPlus, FaSearch, FaCrown, FaExternalLinkAlt } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DocumentCard from '@/components/Dashboard/DocumentCard';
import EmptyState from '@/components/Dashboard/EmptyState';
import { ResumePDF } from '@/components/Builder/ResumePDF';
import { toast } from 'sonner';

function UpgradeToast() {
    const searchParams = useSearchParams();
    useEffect(() => {
        const upgrade = searchParams.get('upgrade');
        if (upgrade === 'success') {
            toast.success('🎉 Welcome to PRO! Your plan has been activated.');
            window.history.replaceState({}, '', '/dashboard');
        }
    }, [searchParams]);
    return null;
}

export default function DashboardPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'resumes' | 'coverLetters'>('resumes');
    const [searchQuery, setSearchQuery] = useState('');
    const [userPlan, setUserPlan] = useState<{ plan: string; subscriptionType: string; planExpiry: string | null } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resumesRes, clRes] = await Promise.all([
                    axios.get('/api/resumes'),
                    axios.get('/api/cover-letters')
                ]);
                setResumes(resumesRes.data);
                setCoverLetters(clRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load documents. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axios.get('/api/user/plan');
                setUserPlan(res.data);
            } catch { /* silent */ }
        };
        fetchPlan();
    }, []);

    const createNewResume = async () => {
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
                    templateId: 'modern'
                }
            });
            router.push(`/builder/${response.data.id}`);
        } catch (error) {
            console.error('Error creating resume:', error);
            toast.error('Failed to create resume. Please try again.');
        }
    };

    const createNewCoverLetter = async () => {
        try {
            const response = await axios.post('/api/cover-letters', {
                title: 'Untitled Cover Letter',
                data: {
                    personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', address: '' },
                    recipientInfo: { name: '', company: '', address: '' },
                    content: '',
                    themeColor: '#2563eb',
                    fontFamily: 'Inter, sans-serif',
                    templateId: 'modern'
                }
            });
            router.push(`/cover-letter/${response.data.id}`);
        } catch (error) {
            console.error('Error creating cover letter:', error);
            toast.error('Failed to create cover letter. Please try again.');
        }
    };

    const handleManageBilling = async () => {
        try {
            const res = await axios.post('/api/checkout/portal');
            if (res.data.url) window.location.href = res.data.url;
        } catch {
            toast.error('Could not open billing portal. Please try again.');
        }
    };

    const deleteResume = async (id: string) => {
        try {
            await axios.delete(`/api/resumes/${id}`);
            setResumes(resumes.filter(r => r.id !== id));
            toast.success('Resume deleted.');
        } catch (error) {
            console.error('Error deleting resume:', error);
            toast.error('Failed to delete resume.');
        }
    };

    const deleteCoverLetter = async (id: string) => {
        try {
            await axios.delete(`/api/cover-letters/${id}`);
            setCoverLetters(coverLetters.filter(cl => cl.id !== id));
            toast.success('Cover letter deleted.');
        } catch (error) {
            console.error('Error deleting cover letter:', error);
            toast.error('Failed to delete cover letter.');
        }
    };

    const duplicateResume = async (id: string) => {
        const original = resumes.find(r => r.id === id);
        if (!original) return;
        try {
            const response = await axios.post('/api/resumes', {
                title: `${original.title} (Copy)`,
                data: original.data,
            });
            setResumes([response.data, ...resumes]);
            toast.success('Resume duplicated!');
        } catch (error) {
            console.error('Error duplicating resume:', error);
            toast.error('Failed to duplicate resume.');
        }
    };

    const duplicateCoverLetter = async (id: string) => {
        const original = coverLetters.find(cl => cl.id === id);
        if (!original) return;
        try {
            const response = await axios.post('/api/cover-letters', {
                title: `${original.title} (Copy)`,
                data: original.data,
            });
            setCoverLetters([response.data, ...coverLetters]);
            toast.success('Cover letter duplicated!');
        } catch (error) {
            console.error('Error duplicating cover letter:', error);
            toast.error('Failed to duplicate cover letter.');
        }
    };

    const downloadResume = async (id: string) => {
        const doc = resumes.find(r => r.id === id);
        if (!doc) return;
        try {
            toast.loading('Generating PDF...');
            const blob = await pdf(<ResumePDF data={doc.data} pages={doc.data?.isMultiPage ? 2 : 1} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${doc.data?.personalInfo?.fullName || doc.title}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            toast.dismiss();
            toast.success('PDF downloaded!');
        } catch (error) {
            console.error('Error downloading resume:', error);
            toast.dismiss();
            toast.error('Failed to generate PDF.');
        }
    };

    const filteredDocuments = (activeTab === 'resumes' ? resumes : coverLetters).filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Suspense fallback={null}><UpgradeToast /></Suspense>
            <DashboardHeader />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                {/* Plan Status Banner */}
                {userPlan && userPlan.plan === 'PRO' && (
                    <div className="mb-8 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <FaCrown className="text-yellow-500" size={20} />
                            <div>
                                <span className="font-bold text-gray-900">PRO Plan Active</span>
                                <span className="ml-2 text-sm text-gray-500">
                                    {userPlan.subscriptionType === 'TRIAL' && userPlan.planExpiry
                                        ? `Trial expires ${new Date(userPlan.planExpiry).toLocaleDateString()}`
                                        : 'Annual subscription'}
                                </span>
                            </div>
                        </div>
                        {userPlan.subscriptionType === 'ANNUAL' && (
                            <button
                                onClick={handleManageBilling}
                                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Manage Billing <FaExternalLinkAlt size={12} />
                            </button>
                        )}
                    </div>
                )}
                {/* Dashboard Title & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-16 gap-6 md:gap-10">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight mb-2 md:mb-4">My Documents</h1>
                        <p className="text-sm md:text-xl text-surface-500 font-medium leading-relaxed max-w-lg">Manage and optimize your professional career documents with AI-powered precision.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto">
                        <div className="group flex-1 sm:w-80 flex items-center bg-white border border-surface-100 rounded-2xl px-6 focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all shadow-sm hover:border-surface-200">
                            <FaSearch className="text-surface-400 group-focus-within:text-primary-600 transition-colors flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none pl-4 py-4 uppercase text-[11px] font-black tracking-[0.1em] placeholder:text-surface-300"
                            />
                        </div>
                        <button
                            onClick={activeTab === 'resumes' ? createNewResume : createNewCoverLetter}
                            className="btn-primary !py-4 !px-8 shadow-2xl !text-[11px] !font-black uppercase tracking-[0.2em]"
                        >
                            <FaPlus className="mr-3" /> New {activeTab === 'resumes' ? 'Resume' : 'Letter'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-10">
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'resumes'
                            ? 'text-primary-600'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Resumes ({resumes.length})
                        {activeTab === 'resumes' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('coverLetters')}
                        className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'coverLetters'
                            ? 'text-primary-600'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Cover Letters ({coverLetters.length})
                        {activeTab === 'coverLetters' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />}
                    </button>
                </div>

                {/* Content Grid */}
                {filteredDocuments.length === 0 ? (
                    <EmptyState
                        type={activeTab}
                        onCreate={activeTab === 'resumes' ? createNewResume : createNewCoverLetter}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredDocuments.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                id={doc.id}
                                title={doc.title}
                                updatedAt={doc.updatedAt}
                                type={activeTab === 'resumes' ? 'resume' : 'coverLetter'}
                                templateId={doc.templateId}
                                resumeData={doc.data}
                                onDelete={activeTab === 'resumes' ? deleteResume : deleteCoverLetter}
                                onDuplicate={activeTab === 'resumes' ? duplicateResume : duplicateCoverLetter}
                                onDownload={activeTab === 'resumes' ? downloadResume : () => toast.error('PDF download is only available for resumes.')}
                            />
                        ))}
                    </div>
                )}
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
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
