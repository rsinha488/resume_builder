'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaFileAlt, FaTrash } from 'react-icons/fa';

export default function DashboardPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResumes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get('/api/resumes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResumes(response.data);
            } catch (error) {
                console.error('Error fetching resumes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, [router]);

    const createNewResume = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/resumes', {
                title: 'My New Resume',
                data: {}
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push(`/builder/${response.data.id}`);
        } catch (error) {
            console.error('Error creating resume:', error);
        }
    };

    const deleteResume = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/resumes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes(resumes.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Resumes</h1>
                <button
                    onClick={createNewResume}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
                >
                    <FaPlus className="mr-2" /> Create New
                </button>
            </div>

            {resumes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
                    <FaFileAlt className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                    <p className="text-gray-500 mb-8">Get started by creating your first professional resume.</p>
                    <button
                        onClick={createNewResume}
                        className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
                    >
                        Create your first resume &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {resumes.map((resume) => (
                        <div key={resume.id} className="group relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center p-8">
                                <FaFileAlt className="h-24 w-24 text-gray-200 group-hover:text-primary-100 transition-colors duration-300" />
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{resume.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                                <div className="flex justify-between items-center">
                                    <Link
                                        href={`/builder/${resume.id}`}
                                        className="text-primary-600 font-semibold hover:text-primary-700 text-sm"
                                    >
                                        Edit Resume
                                    </Link>
                                    <button
                                        onClick={() => deleteResume(resume.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete resume"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
