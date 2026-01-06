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
import ThemeSelector from '@/components/Builder/ThemeSelector';
import ResumePreview from '@/components/Builder/ResumePreview';
import AtsScoreDisplay from '@/components/Builder/AtsScoreDisplay';
import { ResumePDF } from '@/components/Builder/ResumePDF';
import UpgradeModal from '@/components/UpgradeModal';
import BuilderSidebar from '@/components/Builder/BuilderSidebar';
import BuilderBottomBar from '@/components/Builder/BuilderBottomBar';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaDownload, FaCrown, FaFileAlt } from 'react-icons/fa';
import { convertToPlainText } from '@/lib/utils';

type BuilderMode = 'templates' | 'design' | 'content' | 'analysis';

const contentSteps = [
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

    const [currentMode, setCurrentMode] = useState<BuilderMode>('templates');
    const [currentContentStep, setCurrentContentStep] = useState(0);
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
                const resumeRes = await axios.get(`/api/resumes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setResume(resumeRes.data.data));

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
                title: resume.personalInfo?.fullName || 'My Resume',
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

    const handleNext = () => {
        if (currentMode === 'templates') setCurrentMode('design');
        else if (currentMode === 'design') setCurrentMode('content');
        else if (currentMode === 'content') {
            if (currentContentStep < contentSteps.length - 1) {
                setCurrentContentStep(prev => prev + 1);
            } else {
                setCurrentMode('analysis');
            }
        }
    };

    const handleBack = () => {
        if (currentMode === 'analysis') setCurrentMode('content');
        else if (currentMode === 'content') {
            if (currentContentStep > 0) {
                setCurrentContentStep(prev => prev - 1);
            } else {
                setCurrentMode('design');
            }
        }
        else if (currentMode === 'design') setCurrentMode('templates');
    };

    const handleDownloadTxt = () => {
        const text = convertToPlainText(resume);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.personalInfo?.fullName || 'resume'}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleDownloadDocx = () => {
        const text = convertToPlainText(resume);
        const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.personalInfo?.fullName || 'resume'}.docx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <BuilderSidebar
                currentMode={currentMode}
                onModeChange={(mode) => {
                    setCurrentMode(mode);
                    if (mode === 'content') setCurrentContentStep(0);
                }}
            />

            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header Actions */}
                <header className="h-16 bg-white border-b border-gray-200 px-8 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-gray-900">
                            {currentMode === 'content' ? contentSteps[currentContentStep].title : currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadTxt}
                            className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <FaFileAlt className="mr-2" /> .TXT
                        </button>
                        {userPlan === 'PRO' ? (
                            <>
                                <button
                                    onClick={handleDownloadDocx}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <FaFileAlt className="mr-2" /> .DOCX
                                </button>
                                <PDFDownloadLink
                                    document={<ResumePDF data={resume} />}
                                    fileName={`${resume.personalInfo?.fullName || 'resume'}.pdf`}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    {({ loading }) => (
                                        <>
                                            <FaDownload className="mr-2" /> {loading ? '...' : 'PDF'}
                                        </>
                                    )}
                                </PDFDownloadLink>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                            >
                                <FaCrown className="mr-2" /> Upgrade
                            </button>
                        )}
                    </div>
                </header>

                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto pb-24 p-8">
                    <div className="max-w-3xl mx-auto">
                        {currentMode === 'content' && (
                            <div className="flex mb-8 gap-4 overflow-x-auto pb-2">
                                {contentSteps.map((step, index) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setCurrentContentStep(index)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${index === currentContentStep
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {step.title}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            {currentMode === 'templates' && (
                                <TemplateSelector
                                    userPlan={userPlan}
                                    onUpgradeRequired={() => setIsUpgradeModalOpen(true)}
                                />
                            )}
                            {currentMode === 'design' && (
                                <ThemeSelector
                                    userPlan={userPlan}
                                    onUpgrade={() => setIsUpgradeModalOpen(true)}
                                />
                            )}
                            {currentMode === 'content' && (
                                <>
                                    {currentContentStep === 0 && <PersonalInfoForm />}
                                    {currentContentStep === 1 && <ExperienceForm />}
                                    {currentContentStep === 2 && <EducationForm />}
                                    {currentContentStep === 3 && <SkillsForm />}
                                </>
                            )}
                            {currentMode === 'analysis' && <AtsScoreDisplay />}
                        </div>
                    </div>
                </div>

                <BuilderBottomBar
                    onBack={handleBack}
                    onNext={handleNext}
                    onSave={handleSave}
                    isFirstStep={currentMode === 'templates'}
                    isLastStep={currentMode === 'analysis'}
                    saving={saving}
                />
            </main>

            {/* Preview Section */}
            <aside className="hidden xl:block w-[45%] bg-gray-200 overflow-y-auto p-12 border-l border-gray-300">
                <div className="scale-[0.85] origin-top transform transition-transform duration-300">
                    <ResumePreview />
                </div>
            </aside>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgradeSuccess={() => setUserPlan('PRO')}
            />
        </div>
    );
}
