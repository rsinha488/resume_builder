'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCoverLetter } from '@/lib/features/coverLetter/coverLetterSlice';
import CoverLetterPersonalInfoForm from '@/components/Builder/CoverLetterPersonalInfoForm';
import CoverLetterRecipientForm from '@/components/Builder/CoverLetterRecipientForm';
import CoverLetterContentForm from '@/components/Builder/CoverLetterContentForm';
import CoverLetterTemplateSelector from '@/components/Builder/CoverLetterTemplateSelector';
import CoverLetterCustomizationSidebar from '@/components/Builder/CoverLetterCustomizationSidebar';
import CoverLetterPreview from '@/components/Builder/CoverLetterPreview';
import UpgradeModal from '@/components/UpgradeModal';
import { FaSave, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const steps = [
    { id: 'templates', title: 'Choose Template' },
    { id: 'design', title: 'Design & Colors' },
    { id: 'personal', title: 'Personal Info' },
    { id: 'recipient', title: 'Recipient Info' },
    { id: 'content', title: 'Letter Content' },
];

export default function CoverLetterBuilderPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const coverLetter = useAppSelector((state) => state.coverLetter);

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
                // Fetch Cover Letter
                const clRes = await axios.get(`/api/cover-letters/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setCoverLetter(clRes.data.data));

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
            await axios.put(`/api/cover-letters/${id}`, {
                title: coverLetter.title || 'My Cover Letter',
                data: coverLetter
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Cover letter saved successfully!');
        } catch (error) {
            console.error('Error saving cover letter:', error);
            alert('Failed to save cover letter');
        } finally {
            setSaving(false);
        }
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
                            <CoverLetterTemplateSelector
                                userPlan={userPlan}
                                onUpgradeRequired={() => setIsUpgradeModalOpen(true)}
                            />
                        )}
                        {currentStep === 1 && <CoverLetterCustomizationSidebar />}
                        {currentStep === 2 && <CoverLetterPersonalInfoForm />}
                        {currentStep === 3 && <CoverLetterRecipientForm />}
                        {currentStep === 4 && <CoverLetterContentForm />}
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
                                disabled={saving}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium shadow-md"
                            >
                                {saving ? 'Saving...' : 'Finish & Save'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-1/2 bg-gray-200 p-6 lg:p-12 overflow-y-auto max-h-[calc(100vh-72px)] hidden lg:block">
                <div className="sticky top-0">
                    <CoverLetterPreview />
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
