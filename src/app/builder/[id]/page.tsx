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
import { FaDownload, FaCrown, FaFileAlt, FaCheck, FaEdit, FaSpinner, FaMagic, FaChevronRight } from 'react-icons/fa';
import ProgressBar from '@/components/Builder/ProgressBar';
import { toast } from 'sonner';
import { convertToPlainText } from '@/lib/utils';
import { SAMPLE_DATA } from '@/lib/sampleData';
import ExtraSections from '@/components/Builder/ExtraSections';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

type BuilderMode = 'templates' | 'design' | 'content' | 'analysis' | 'finalize';

const contentSteps = [
    { id: 'personal', title: 'Personal Info', shortTitle: 'Contact' },
    { id: 'experience', title: 'Experience', shortTitle: 'Experience' },
    { id: 'education', title: 'Education', shortTitle: 'Education' },
    { id: 'skills', title: 'Skills', shortTitle: 'Skills' },
    { id: 'extra', title: 'Extra Sections', shortTitle: 'Extras' },
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
    const [aiUsageCount, setAiUsageCount] = useState(0);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resumeRes, planRes] = await Promise.all([
                    axios.get(`/api/resumes/${id}`),
                    axios.get('/api/user/plan')
                ]);
                const resumeData = {
                    ...resumeRes.data.data,
                    id: resumeRes.data.id,
                    title: resumeRes.data.title,
                    templateId: resumeRes.data.templateId || resumeRes.data.data.templateId || 'modern',
                };
                dispatch(setResume(resumeData));
                setUserPlan(planRes.data.plan);
                setAiUsageCount(planRes.data.aiUsageCount || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, dispatch, router]);

    const handleSave = async (silent = false) => {
        if (saving || loading) return;
        
        setSaving(true);
        try {
            await axios.put(`/api/resumes/${id}`, {
                title: resume.personalInfo?.fullName || 'My Resume',
                data: resume
            });
            if (!silent) toast.success('Progress saved!');
        } catch (error) {
            console.error('Error saving resume:', error);
            if (!silent) toast.error('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Autosave Effect
    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(() => {
            handleSave(true);
        }, 3000); // 3 second debounce

        return () => clearTimeout(timer);
    }, [resume, loading]);

    const handleNext = () => {
        handleSave();
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
        handleSave(true);
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

    const handleDownloadHtml = () => {
        const toastId = toast.loading('Generating HTML resume...');
        try {
            const { personalInfo, experiences, education, skills } = resume;
            const { certifications, languages, projects } = resume as any;

            const section = (title: string, content: string) => content.trim() ? `
                <div class="section">
                    <h2>${title}</h2>
                    <div class="section-content">${content}</div>
                </div>` : '';

            const experienceHtml = (experiences || []).map((exp: any) => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="entry-title">${exp.position || ''}</span>
                        <span class="entry-date">${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}</span>
                    </div>
                    <div class="entry-subtitle">${exp.company || ''}${exp.location ? ` · ${exp.location}` : ''}</div>
                    ${exp.description ? `<p class="entry-desc">${exp.description.replace(/\n/g, '<br/>')}</p>` : ''}
                </div>`).join('');

            const educationHtml = (education || []).map((edu: any) => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="entry-title">${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</span>
                        <span class="entry-date">${edu.startDate || ''} – ${edu.endDate || ''}</span>
                    </div>
                    <div class="entry-subtitle">${edu.school || ''}</div>
                    ${edu.gpa ? `<p class="entry-desc">GPA: ${edu.gpa}</p>` : ''}
                </div>`).join('');

            const projectsHtml = (projects || []).map((p: any) => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="entry-title">${p.name || ''}</span>
                        ${p.link ? `<a class="entry-link" href="${p.link}" target="_blank">${p.link}</a>` : ''}
                    </div>
                    ${p.description ? `<p class="entry-desc">${p.description}</p>` : ''}
                    ${p.technologies ? `<p class="entry-desc"><strong>Technologies:</strong> ${p.technologies}</p>` : ''}
                </div>`).join('');

            const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${personalInfo?.fullName || 'Resume'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; font-size: 14px; color: #1a1a1a; background: #fff; max-width: 800px; margin: 40px auto; padding: 40px; line-height: 1.6; }
  h1 { font-size: 28px; font-weight: bold; letter-spacing: 1px; color: #111; margin-bottom: 4px; }
  .contact { font-size: 12px; color: #555; margin-bottom: 8px; }
  .contact a { color: #2563eb; text-decoration: none; }
  .divider { height: 2px; background: #111; margin: 16px 0; }
  h2 { font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; color: #444; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  .section { margin-bottom: 24px; }
  .section-content { font-size: 13px; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
  .entry-title { font-weight: bold; font-size: 14px; color: #111; }
  .entry-date { font-size: 12px; color: #666; white-space: nowrap; }
  .entry-subtitle { font-size: 12px; color: #555; margin: 2px 0; font-style: italic; }
  .entry-desc { font-size: 13px; color: #333; margin-top: 4px; }
  .entry-link { font-size: 12px; color: #2563eb; text-decoration: none; }
  .skills-list { font-size: 13px; color: #333; }
  .summary-text { font-size: 13px; color: #333; font-style: italic; }
  @media print {
    body { margin: 0; padding: 24px; }
    @page { margin: 1.5cm; }
  }
</style>
</head>
<body>
  <h1>${personalInfo?.fullName || 'Resume'}</h1>
  ${personalInfo?.jobTitle ? `<p style="font-size:13px;color:#555;margin-bottom:6px;">${personalInfo.jobTitle}</p>` : ''}
  <p class="contact">
    ${[personalInfo?.email, personalInfo?.phone, personalInfo?.address].filter(Boolean).join('&nbsp;&nbsp;|&nbsp;&nbsp;')}
    ${personalInfo?.website ? `&nbsp;&nbsp;|&nbsp;&nbsp;<a href="${personalInfo.website}">${personalInfo.website}</a>` : ''}
    ${(personalInfo as any)?.linkedin ? `&nbsp;&nbsp;|&nbsp;&nbsp;<a href="${(personalInfo as any).linkedin}">${(personalInfo as any).linkedin}</a>` : ''}
  </p>
  <div class="divider"></div>
  ${personalInfo?.summary ? section('Professional Summary', `<p class="summary-text">${personalInfo.summary}</p>`) : ''}
  ${experienceHtml ? section('Experience', experienceHtml) : ''}
  ${educationHtml ? section('Education', educationHtml) : ''}
  ${projectsHtml ? section('Projects', projectsHtml) : ''}
  ${skills?.length > 0 ? section('Skills', `<p class="skills-list">${skills.join(' &nbsp;·&nbsp; ')}</p>`) : ''}
  ${(certifications || []).length > 0 ? section('Certifications', (certifications || []).map((c: any) => `<div class="entry"><span class="entry-title">${c.name || ''}</span>${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` <span class="entry-date">(${c.date})</span>` : ''}</div>`).join('')) : ''}
  ${(languages || []).length > 0 ? section('Languages', `<p class="skills-list">${(languages || []).map((l: any) => `${l.language || l}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' &nbsp;·&nbsp; ')}</p>`) : ''}
</body>
</html>`;

            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${personalInfo?.fullName || 'resume'}.html`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.dismiss(toastId);
            toast.success('Resume downloaded! Open the .html file in any browser. Use Ctrl+P to print/save as PDF.', { duration: 6000 });
        } catch (error) {
            console.error('HTML generation error:', error);
            toast.dismiss(toastId);
            toast.error('Failed to generate resume file. Please try again.');
        }
    };


    const handleSectionClick = (sectionId: string) => {
        // Zety-like auto-fill: if user clicks an empty section in the preview, instantiate the form with that sample data!
        if (sectionId === 'experience' && (!resume.experiences || resume.experiences.length === 0)) {
            dispatch(setResume({ ...resume, experiences: SAMPLE_DATA.experiences } as any));
            toast.success('Sample experiences loaded for editing!');
        } else if (sectionId === 'education' && (!resume.education || resume.education.length === 0)) {
            dispatch(setResume({ ...resume, education: SAMPLE_DATA.education } as any));
            toast.success('Sample education loaded for editing!');
        } else if (sectionId === 'skills' && (!resume.skills || resume.skills.length === 0)) {
            dispatch(setResume({ ...resume, skills: SAMPLE_DATA.skills } as any));
            toast.success('Sample skills loaded for editing!');
        } else if (sectionId === 'summary' && !resume.personalInfo?.summary) {
            dispatch(updatePersonalInfo({ summary: SAMPLE_DATA.personalInfo?.summary }));
            toast.success('Sample summary loaded for editing!');
        } else if (sectionId === 'personal' && !resume.personalInfo?.fullName) {
            dispatch(updatePersonalInfo({ ...SAMPLE_DATA.personalInfo } as any));
            toast.success('Sample details loaded for editing!');
        }

        setCurrentMode('content');
        const stepIndex = contentSteps.findIndex(s => s.id === sectionId);
        if (stepIndex !== -1) setCurrentContentStep(stepIndex);
        
        // Scroll the form into view if needed
        const editorArea = document.getElementById('editor-area');
        if (editorArea) {
            editorArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const toggleMobilePreview = () => setShowMobilePreview(!showMobilePreview);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <DashboardHeader />

            <div className="flex-1 flex overflow-hidden min-h-0 relative">
                <BuilderSidebar
                    currentMode={currentMode}
                    onModeChange={(mode) => {
                        handleSave(true);
                        setCurrentMode(mode);
                        if (mode === 'content') setCurrentContentStep(0);
                    }}
                />

                <main className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 ${showMobilePreview ? 'hidden xl:flex' : 'flex'}`}>
                    <ProgressBar
                        steps={contentSteps}
                        currentStep={currentContentStep}
                        currentMode={currentMode}
                    />
                    {/* Header Actions */}
                    <header className="flex-shrink-0 h-12 sm:h-14 lg:h-16 bg-white/80 backdrop-blur-md border-b border-surface-100 px-4 sm:px-8 flex justify-between items-center z-20">
                        <div className="flex items-center gap-4">
                            <h1 className="text-[9px] sm:text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">
                                {currentMode === 'content' ? `Step ${currentContentStep + 1}: ${contentSteps[currentContentStep].shortTitle}` : currentMode}
                            </h1>
                        </div>

                        <div className="flex gap-2 sm:gap-4">
                            <button
                                onClick={handleFillSampleData}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                            >
                                <FaEdit className="text-xs" /> Auto-Fill
                            </button>
                            
                            <div className="h-6 w-px bg-surface-100 my-auto hidden lg:block" />

                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadHtml}
                                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                >
                                    <FaDownload size={9} /> .HTML
                                </button>
                                {userPlan === 'PRO' ? (
                                    <PDFDownloadLink
                                        document={<ResumePDF data={resume} pages={resume.isMultiPage ? 2 : 1} />}
                                        fileName={`${resume.personalInfo?.fullName || 'resume'}.pdf`}
                                        className="btn-primary !px-4 sm:!px-6 !py-2 !rounded-xl !text-[10px] !font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary-600/20"
                                    >
                                        {({ loading }) => (
                                            <>
                                                <FaDownload size={10} className="hidden xs:block" /> {loading ? '...' : 'PDF'}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                ) : (
                                    <button
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        className="btn-primary !bg-amber-500 hover:!bg-amber-600 !px-4 sm:!px-6 !py-2 !rounded-xl !text-[10px] !font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-500/20"
                                    >
                                        <FaCrown size={10} className="hidden xs:block" /> Get Pro
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Mobile Step Slider — sits in the flex flow, below the header, no overlap */}
                    {currentMode === 'content' && (
                        <div className="flex-shrink-0 lg:hidden bg-white/90 backdrop-blur-xl border-b border-surface-100 z-10 flex items-center px-3 py-2.5 overflow-x-auto no-scrollbar gap-2 shadow-sm mask-horizontal">
                            {contentSteps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => {
                                        handleSave(true);
                                        setCurrentContentStep(index);
                                    }}
                                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 ${
                                        index === currentContentStep
                                            ? 'bg-surface-900 text-white shadow-lg shadow-surface-900/20'
                                            : 'bg-surface-50 text-surface-400 border border-transparent hover:border-surface-200'
                                    }`}
                                >
                                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[7px] font-black flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    {step.shortTitle}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Editor Area — scrolls independently, bottom bar stays pinned */}
                    <div id="editor-area" className="flex-1 overflow-y-auto min-h-0 pb-40 p-4 sm:p-10 scroll-smooth bg-surface-50/50">
                        <div className="max-w-4xl mx-auto">
                            {currentMode === 'content' && (
                                <div className="hidden lg:flex mb-10 gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {contentSteps.map((step, index) => (
                                        <button
                                            key={step.id}
                                            onClick={() => {
                                                handleSave(true);
                                                setCurrentContentStep(index);
                                            }}
                                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${index === currentContentStep
                                                ? 'bg-surface-900 text-white shadow-xl shadow-surface-900/20'
                                                : 'bg-white text-surface-400 border border-surface-100 hover:border-surface-200'
                                                }`}
                                        >
                                            {step.title}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className={`${currentMode === 'content' ? 'bg-white p-6 sm:p-10 lg:p-16' : ''} rounded-3xl lg:rounded-[2.5rem] shadow-premium border border-surface-100/50 relative overflow-hidden`}>
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
                                        {currentContentStep === 0 && <PersonalInfoForm 
                                            userPlan={userPlan} 
                                            aiUsageCount={aiUsageCount}
                                            onUsageUpdate={setAiUsageCount}
                                            onUpgrade={() => setIsUpgradeModalOpen(true)} 
                                        />}
                                        {currentContentStep === 1 && <ExperienceForm 
                                            userPlan={userPlan} 
                                            aiUsageCount={aiUsageCount}
                                            onUsageUpdate={setAiUsageCount}
                                            onUpgrade={() => setIsUpgradeModalOpen(true)} 
                                        />}
                                        {currentContentStep === 2 && <EducationForm />}
                                        {currentContentStep === 3 && <SkillsForm />}
                                        {currentContentStep === 4 && <ExtraSections />}

                                    </>
                                )}
                                {currentMode === 'analysis' && (
                                    <AtsScoreDisplay 
                                        userPlan={userPlan}
                                        aiUsageCount={aiUsageCount}
                                        onUsageUpdate={setAiUsageCount}
                                        onUpgrade={() => setIsUpgradeModalOpen(true)}
                                        onFixClick={handleSectionClick} 
                                    />
                                )}
                                {currentMode === 'finalize' && (
                                    <div className="text-center space-y-8 sm:space-y-12 py-8 sm:py-16 animate-fade-in-up">
                                        <div className="flex justify-center">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-premium ring-8 ring-green-50 text-green-500">
                                                    <FaCheck size={36} className="xs:text-[48px] animate-float" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl sm:text-4xl font-black text-surface-900 mb-2 sm:mb-3 tracking-tight">You're all set!</h2>
                                            <p className="text-surface-500 text-base sm:text-lg font-medium max-w-sm sm:max-w-md mx-auto">
                                                Your professional resume is polished and ready to make an impact.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                                            {/* HTML — available to all users, opens in any browser */}
                                            <button
                                                onClick={handleDownloadHtml}
                                                className="premium-card p-4 sm:p-6 flex flex-col items-center gap-4 border-blue-100 group"
                                            >
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <FaDownload size={20} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] sm:text-xs font-black text-surface-900 uppercase tracking-widest mb-1">HTML Resume</p>
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Open in Browser</span>
                                                </div>
                                            </button>

                                            {/* PDF — PRO only */}
                                            {userPlan === 'PRO' ? (
                                                <PDFDownloadLink
                                                    document={<ResumePDF data={resume} pages={resume.isMultiPage ? 2 : 1} />}
                                                    fileName={`${resume.personalInfo?.fullName || 'resume'}.pdf`}
                                                    className="premium-card p-4 sm:p-6 flex flex-col items-center gap-4 border-primary-100 group"
                                                >
                                                    {({ loading }) => (
                                                        <>
                                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                                <FaDownload size={20} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[10px] sm:text-xs font-black text-surface-900 uppercase tracking-widest mb-1">PDF Document</p>
                                                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest whitespace-nowrap">
                                                                    {loading ? '...' : 'Download .pdf'}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </PDFDownloadLink>
                                            ) : (
                                                <button
                                                    onClick={() => setIsUpgradeModalOpen(true)}
                                                    className="premium-card p-4 sm:p-6 flex flex-col items-center gap-4 border-amber-100 bg-amber-50/10 group"
                                                >
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                                                        <FaCrown size={20} />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] sm:text-xs font-black text-surface-900 uppercase tracking-widest mb-1">Unlock PDF</p>
                                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Upgrade to PRO</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <BuilderBottomBar
                        onBack={handleBack}
                        onNext={handleNext}
                        onSave={() => handleSave()}
                        isFirstStep={currentMode === 'templates'}
                        isLastStep={currentMode === 'finalize'}
                        saving={saving}
                        showPreview={showMobilePreview}
                        onTogglePreview={toggleMobilePreview}
                    />
                </main>

                {/* Preview Section — own scroll, never affects page */}
                <aside className={`flex flex-col xl:w-[45%] bg-gray-200 overflow-y-auto min-h-0 p-4 lg:p-12 border-l border-gray-300 transition-all duration-300 ${showMobilePreview ? 'flex w-full absolute inset-0 z-40 xl:relative xl:z-auto' : 'hidden xl:flex'}`}>
                    <div className="scale-[0.7] sm:scale-[0.85] xl:scale-90 origin-top transform transition-transform duration-300 mx-auto">
                        <ResumePreview onSectionClick={(id) => {
                            setShowMobilePreview(false);
                            handleSectionClick(id);
                        }} />
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
