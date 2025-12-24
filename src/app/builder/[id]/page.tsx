'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setResume } from '@/lib/features/resume/resumeSlice';
import PersonalInfoForm from '@/components/Builder/PersonalInfoForm';
import ExperienceForm from '@/components/Builder/ExperienceForm';
import EducationForm from '@/components/Builder/EducationForm';
import SkillsForm from '@/components/Builder/SkillsForm';
import TemplateSelector from '@/components/Builder/TemplateSelector';
import CustomizationSidebar from '@/components/Builder/CustomizationSidebar';
import ResumePreview from '@/components/Builder/ResumePreview';
import { ResumePDF } from '@/components/Builder/ResumePDF';
import UpgradeModal from '@/components/UpgradeModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaSave, FaChevronLeft, FaChevronRight, FaDownload, FaCrown, FaFileAlt, FaPalette } from 'react-icons/fa';
import { convertToPlainText } from '@/lib/utils';

const steps = [
    { id: 'templates', title: 'Choose Template' },
    { id: 'design', title: 'Design & Colors' },
    { id: 'personal', title: 'Personal Info' },
    { id: 'experience', title: 'Experience' },
    { id: 'education', title: 'Education' },
    { id: 'skills', title: 'Skills' },
];

export default function BuilderPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const resume = useAppSelector((state) => state.resume);

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch Resume
                const resumeRes = await axios.get(`/api/resumes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setResume(resumeRes.data.data));

                // Fetch User Plan
                const planRes = await axios.get('/api/user/plan', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserPlan(planRes.data.plan);
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, dispatch, router]);

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/resumes/${id}`, {
                title: resume.personalInfo.fullName || 'My Resume',
                data: resume
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Resume saved successfully!');
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadTxt = () => {
        const text = convertToPlainText(resume);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.personalInfo.fullName || 'resume'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadDocx = () => {
        // Simulated DOCX download
        const text = convertToPlainText(resume);
        const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.personalInfo.fullName || 'resume'}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gray-50 flex flex-col lg:flex-row">
            {/* Editor Sidebar */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto max-h-[calc(100vh-72px)]">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h1>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownloadTxt}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                                title="Download as Plain Text (Free)"
                            >
                                <FaFileAlt className="mr-2" /> .TXT
                            </button>
                            {userPlan === 'PRO' ? (
                                <>
                                    <button
                                        onClick={handleDownloadDocx}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                        title="Download as Word Document (Pro)"
                                    >
                                        <FaFileAlt className="mr-2" /> .DOCX
                                    </button>
                                    <PDFDownloadLink
                                        document={<ResumePDF data={resume} />}
                                        fileName={`${resume.personalInfo.fullName || 'resume'}.pdf`}
                                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                                    >
                                        {({ loading }) => (
                                            <>
                                                <FaDownload className="mr-2" /> {loading ? 'Preparing...' : 'Download PDF'}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm"
                                >
                                    <FaCrown className="mr-2" /> Upgrade to Download
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <FaSave className="mr-2" /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex mb-8 gap-2">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`h-2 flex-1 rounded-full transition-colors ${index <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                        {currentStep === 0 && (
                            <TemplateSelector
                                userPlan={userPlan}
                                onUpgradeRequired={() => setIsUpgradeModalOpen(true)}
                            />
                        )}
                        {currentStep === 1 && <CustomizationSidebar />}
                        {currentStep === 2 && <PersonalInfoForm />}
                        {currentStep === 3 && <ExperienceForm />}
                        {currentStep === 4 && <EducationForm />}
                        {currentStep === 5 && <SkillsForm />}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium"
                        >
                            <FaChevronLeft className="mr-2" /> Previous
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-md"
                            >
                                Next <FaChevronRight className="ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md"
                            >
                                Finish & Save
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-1/2 bg-gray-200 p-6 lg:p-12 overflow-y-auto max-h-[calc(100vh-72px)] hidden lg:block">
                <div className="sticky top-0">
                    <ResumePreview />
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgradeSuccess={() => setUserPlan('PRO')}
            />
        </div>
    );
}
