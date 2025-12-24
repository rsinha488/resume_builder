'use client';
import { useState } from 'react';
import axios from 'axios';
import { FaCrown, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgradeSuccess: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgradeSuccess }: UpgradeModalProps) {
    const [loading, setLoading] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleUpgrade = async (type: 'TRIAL' | 'ANNUAL') => {
        setLoading(type);
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/user/plan', {
                plan: 'PRO',
                subscriptionType: type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpgradeSuccess();
            onClose();
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Failed to upgrade. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="relative p-8 lg:p-12">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    >
                        <FaTimes size={24} />
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Plan</h2>
                        <p className="text-xl text-gray-600">Get hired faster with a professional resume.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Trial Plan */}
                        <div className="relative flex flex-col p-8 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-primary-200 transition-all">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">14-Day Trial</h3>
                            <p className="text-gray-500 mb-6">Full access to all features for two weeks.</p>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-gray-900">$2.70</span>
                                <span className="text-gray-500 ml-2">one-time</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-start text-gray-700">
                                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                                    <span>Access to all 20+ Premium Templates</span>
                                </li>
                                <li className="flex items-start text-gray-700">
                                    <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                                    <span>Unlimited PDF & Word Downloads</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleUpgrade('TRIAL')}
                                disabled={!!loading}
                                className="w-full py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading === 'TRIAL' ? <FaSpinner className="animate-spin mr-2" /> : null}
                                Select Trial
                            </button>
                        </div>

                        {/* Annual Plan */}
                        <div className="relative flex flex-col p-8 bg-primary-50 rounded-2xl border-2 border-primary-500 shadow-xl scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                Best Value
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual Plan</h3>
                            <p className="text-gray-500 mb-6">The most popular choice for job seekers.</p>
                            <div className="mb-8">
                                <span className="text-4xl font-black text-gray-900">$5.95</span>
                                <span className="text-gray-500 ml-2">/ month</span>
                                <p className="text-xs text-primary-600 font-semibold mt-1">Billed annually at $71.40</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                <li className="flex items-start text-gray-700">
                                    <FaCheck className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                                    <span className="font-semibold">Everything in Trial</span>
                                </li>
                                <li className="flex items-start text-gray-700">
                                    <FaCheck className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>1 Year of Unlimited Updates</span>
                                </li>
                                <li className="flex items-start text-gray-700">
                                    <FaCheck className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Priority ATS Optimization</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleUpgrade('ANNUAL')}
                                disabled={!!loading}
                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading === 'ANNUAL' ? <FaSpinner className="animate-spin mr-2" /> : <FaCrown className="mr-2" />}
                                Get Started Now
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-400 italic">
                        Secure checkout. Cancel anytime. Simulated payment for demonstration.
                    </p>
                </div>
            </div>
        </div>
    );
}
