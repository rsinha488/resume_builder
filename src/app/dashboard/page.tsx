'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSearch } from 'react-icons/fa';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DocumentCard from '@/components/Dashboard/DocumentCard';
import EmptyState from '@/components/Dashboard/EmptyState';

export default function DashboardPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'resumes' | 'coverLetters'>('resumes');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const [resumesRes, clRes] = await Promise.all([
                    axios.get('/api/resumes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/cover-letters', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setResumes(resumesRes.data);
                setCoverLetters(clRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // TODO: Add toast notification for error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const createNewResume = async () => {
        const token = localStorage.getItem('token');
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
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push(`/builder/${response.data.id}`);
        } catch (error) {
            console.error('Error creating resume:', error);
            alert('Failed to create resume. Please try again.');
        }
    };

    const createNewCoverLetter = async () => {
        const token = localStorage.getItem('token');
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
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push(`/cover-letter/${response.data.id}`);
        } catch (error) {
            console.error('Error creating cover letter:', error);
            alert('Failed to create cover letter. Please try again.');
        }
    };

    const deleteResume = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/resumes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes(resumes.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume.');
        }
    };

    const deleteCoverLetter = async (id: string) => {
        if (!confirm('Are you sure you want to delete this cover letter? This action cannot be undone.')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/cover-letters/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoverLetters(coverLetters.filter(cl => cl.id !== id));
        } catch (error) {
            console.error('Error deleting cover letter:', error);
            alert('Failed to delete cover letter.');
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
            <DashboardHeader />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                {/* Dashboard Title & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Documents</h1>
                        <p className="text-lg text-gray-500 font-medium">Manage and optimize your professional career documents.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 sm:w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={activeTab === 'resumes' ? createNewResume : createNewCoverLetter}
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all transform hover:scale-105 whitespace-nowrap"
                        >
                            <FaPlus className="mr-2" /> New {activeTab === 'resumes' ? 'Resume' : 'Letter'}
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
                                onDelete={activeTab === 'resumes' ? deleteResume : deleteCoverLetter}
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
