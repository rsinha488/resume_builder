'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setResume, updatePersonalInfo } from '@/lib/features/resume/resumeSlice';
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
import { FaDownload, FaCrown, FaFileAlt, FaCheck, FaEdit, FaSpinner, FaMagic } from 'react-icons/fa';
import ProgressBar from '@/components/Builder/ProgressBar';
import { toast } from 'sonner';
import { convertToPlainText } from '@/lib/utils';

type BuilderMode = 'templates' | 'design' | 'content' | 'analysis' | 'finalize';

import { SAMPLE_DATA } from '@/lib/sampleData';
import ExtraSections from '@/components/Builder/ExtraSections';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

const contentSteps = [
    { id: 'personal', title: 'Personal Info' },
    { id: 'experience', title: 'Experience' },
    { id: 'education', title: 'Education' },
    { id: 'skills', title: 'Skills' },
    { id: 'extra', title: 'Extra Sections' },
    { id: 'summary', title: 'Professional Summary' },
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
    const [generatingSummary, setGeneratingSummary] = useState(false);

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('/api/ai/generate-summary', {
                personalInfo: resume.personalInfo,
                experiences: resume.experiences,
                skills: resume.skills,
            }, { headers: { Authorization: `Bearer ${token}` } });
            dispatch(updatePersonalInfo({ summary: res.data.summary }));
            toast.success('Summary generated!');
        } catch {
            toast.error('Failed to generate summary.');
        } finally {
            setGeneratingSummary(false);
        }
    };

    // Lock body scroll while builder is mounted — each panel scrolls independently
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

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
            toast.success('Resume saved successfully!');
        } catch (error) {
            console.error('Error saving resume:', error);
            toast.error('Failed to save resume. Please try again.');
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
        else if (currentMode === 'analysis') setCurrentMode('finalize');
    };

    const handleBack = () => {
        if (currentMode === 'finalize') setCurrentMode('analysis');
        else if (currentMode === 'analysis') {
            setCurrentContentStep(contentSteps.length - 1);
            setCurrentMode('content');
        }
        else if (currentMode === 'content') {
            if (currentContentStep > 0) {
                setCurrentContentStep(prev => prev - 1);
            } else {
                setCurrentMode('design');
            }
        }
        else if (currentMode === 'design') setCurrentMode('templates');
    };

    const handleFillSampleData = () => {
        dispatch(setResume({
            ...resume,
            ...SAMPLE_DATA,
            personalInfo: { ...resume.personalInfo, ...SAMPLE_DATA.personalInfo },
        } as any));
        toast.success('Resume filled with sample data!');
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

    const handleDownloadDocx = async () => {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
        const { personalInfo, experiences, education, skills } = resume;

        const children = [
            new Paragraph({ text: personalInfo.fullName, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${personalInfo.email}  |  ${personalInfo.phone}  |  ${personalInfo.address}`, size: 20 })] }),
            ...(personalInfo.website ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: personalInfo.website, size: 20 })] })] : []),
            new Paragraph({}),
        ];

        if (personalInfo.summary) {
            children.push(new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2 }));
            children.push(new Paragraph({ text: personalInfo.summary }));
            children.push(new Paragraph({}));
        }

        if (experiences?.length > 0) {
            children.push(new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2 }));
            experiences.forEach((exp) => {
                children.push(new Paragraph({ children: [new TextRun({ text: `${exp.position} — ${exp.company}`, bold: true })] }));
                children.push(new Paragraph({ children: [new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, italics: true, size: 20 })] }));
                if (exp.description) children.push(new Paragraph({ text: exp.description }));
                children.push(new Paragraph({}));
            });
        }

        if (education?.length > 0) {
            children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }));
            education.forEach((edu) => {
                children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true })] }));
                children.push(new Paragraph({ children: [new TextRun({ text: `${edu.school}  |  ${edu.startDate} - ${edu.endDate}`, italics: true, size: 20 })] }));
                children.push(new Paragraph({}));
            });
        }

        if (skills?.length > 0) {
            children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }));
            children.push(new Paragraph({ text: skills.join(', ') }));
        }

        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${personalInfo.fullName || 'resume'}.docx`;
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
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <DashboardHeader />

            <div className="flex-1 flex overflow-hidden min-h-0">
                <BuilderSidebar
                    currentMode={currentMode}
                    onModeChange={(mode) => {
                        setCurrentMode(mode);
                        if (mode === 'content') setCurrentContentStep(0);
                    }}
                />

                <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <ProgressBar
                        steps={contentSteps}
                        currentStep={currentContentStep}
                        currentMode={currentMode}
                    />
                    {/* Header Actions */}
                    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-8 flex justify-between items-center z-10">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-bold text-gray-900">
                                {currentMode === 'content' ? contentSteps[currentContentStep].title : currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
                            </h1>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleFillSampleData}
                                className="inline-flex items-center px-3 py-1.5 text-sm border border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                            >
                                <FaEdit className="mr-2" /> Fill Sample
                            </button>
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

                    {/* Editor Area — scrolls independently, bottom bar stays pinned */}
                    <div className="flex-1 overflow-y-auto min-h-0 pb-24 p-8">
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
                                        {currentContentStep === 4 && <ExtraSections />}
                                        {currentContentStep === 5 && (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label htmlFor="summary-large" className="block text-sm font-semibold text-gray-700">Professional Summary</label>
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateSummary}
                                                        disabled={generatingSummary}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {generatingSummary
                                                            ? <><FaSpinner className="animate-spin" size={10} /> Generating...</>
                                                            : <><FaMagic size={10} /> Generate with AI</>
                                                        }
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">Write a short, catchy summary that highlights your best qualities and experiences.</p>
                                                <textarea
                                                    id="summary-large"
                                                    value={resume.personalInfo?.summary}
                                                    onChange={(e) => dispatch(updatePersonalInfo({ summary: e.target.value }))}
                                                    rows={10}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none text-lg"
                                                    placeholder="e.g. Passionate Software Engineer with 5+ years of experience..."
                                                />
                                            </div>
                                        )}

                                    </>
                                )}
                                {currentMode === 'analysis' && <AtsScoreDisplay />}
                                {currentMode === 'finalize' && (
                                    <div className="text-center space-y-8 py-12">
                                        <div className="flex justify-center">
                                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                                <FaCheck size={48} />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 mb-2">You're all set!</h2>
                                            <p className="text-gray-600 text-lg">Your professional resume is ready for download.</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                            <button
                                                onClick={handleDownloadTxt}
                                                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center"
                                            >
                                                <FaFileAlt className="mr-2" /> Download .TXT
                                            </button>

                                            {userPlan === 'PRO' ? (
                                                <>
                                                    <button
                                                        onClick={handleDownloadDocx}
                                                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center"
                                                    >
                                                        <FaFileAlt className="mr-2" /> Download .DOCX
                                                    </button>
                                                    <PDFDownloadLink
                                                        document={<ResumePDF data={resume} />}
                                                        fileName={`${resume.personalInfo?.fullName || 'resume'}.pdf`}
                                                        className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center"
                                                    >
                                                        {({ loading }) => (
                                                            <>
                                                                <FaDownload className="mr-2" /> {loading ? 'Generating...' : 'Download PDF'}
                                                            </>
                                                        )}
                                                    </PDFDownloadLink>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setIsUpgradeModalOpen(true)}
                                                    className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center animate-bounce"
                                                >
                                                    <FaCrown className="mr-2" /> Upgrade to Download PDF
                                                </button>
                                            )}
                                        </div>

                                        {userPlan !== 'PRO' && (
                                            <p className="text-sm text-gray-500 italic">
                                                Free users can download in .TXT format. Upgrade for PDF and Word formats.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <BuilderBottomBar
                        onBack={handleBack}
                        onNext={handleNext}
                        onSave={handleSave}
                        isFirstStep={currentMode === 'templates'}
                        isLastStep={currentMode === 'finalize'}
                        saving={saving}
                    />
                </main>

                {/* Preview Section — own scroll, never affects page */}
                <aside className="hidden xl:flex xl:flex-col w-[45%] bg-gray-200 overflow-y-auto min-h-0 p-12 border-l border-gray-300">
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
        </div >
    );
}
