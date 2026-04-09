'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { FaCrown, FaCheck, FaTimes, FaSpinner, FaLock, FaBolt } from 'react-icons/fa';
import { toast } from 'sonner';

interface UpgradeModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onUpgradeSuccess: () => void;
}

type PlanType = 'TRIAL' | 'ANNUAL';

const PLANS = [
    {
        type: 'TRIAL' as PlanType,
        name: '14-Day Trial',
        tagline: 'Try everything risk-free',
        price: '$2.70',
        billingNote: 'one-time payment',
        icon: FaBolt,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50',
        badgeBg: '',
        borderClass: 'border-surface-200 hover:border-emerald-300',
        cardBg: 'bg-white',
        ctaClass: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-white',
        ctaLabel: 'Start Trial',
        features: [
            'Access to all 20+ Premium Templates',
            'Unlimited PDF & Word Downloads',
            'AI-powered Content Suggestions',
            'ATS Score Checker',
        ],
        featureColor: 'text-emerald-500',
        highlight: false,
    },
    {
        type: 'ANNUAL' as PlanType,
        name: 'Annual Plan',
        tagline: 'Best value for job seekers',
        price: '$5.95',
        billingNote: '/month · billed $71.40/year',
        icon: FaCrown,
        iconColor: 'text-primary-600',
        iconBg: 'bg-primary-50',
        badgeBg: 'bg-primary-600',
        borderClass: 'border-primary-500',
        cardBg: 'bg-gradient-to-b from-primary-50 to-white',
        ctaClass: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30',
        ctaLabel: 'Get Started',
        features: [
            'Everything in Trial',
            '1 Year of Unlimited Updates',
            'Priority ATS Optimization',
            'Dedicated Email Support',
        ],
        featureColor: 'text-primary-600',
        highlight: true,
    },
];

export default function UpgradeModal({ isOpen, onClose, onUpgradeSuccess }: UpgradeModalProps) {
    const [loading, setLoading] = useState<PlanType | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleUpgrade = async (type: PlanType) => {
        setLoading(type);
        setErrorMsg(null);
        try {
            const response = await axios.post('/api/checkout', { subscriptionType: type });

            if (response.data.url) {
                globalThis.location.href = response.data.url;
            } else {
                throw new Error('No checkout URL was returned. Please try again.');
            }
        } catch (err) {
            const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
            const backendMsg =
                axiosErr.response?.data?.error ||
                axiosErr.response?.data?.message ||
                (err instanceof Error ? err.message : null) ||
                'Something went wrong. Please try again.';

            setErrorMsg(backendMsg);
            toast.error(backendMsg);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                {/* Header */}
                <div className="bg-white border-b border-surface-100 flex items-center justify-between px-6 py-4 z-10">
                    <div>
                        <h2 className="text-lg font-black text-surface-900 tracking-tight">Upgrade to PRO</h2>
                        <p className="text-xs text-surface-400 font-medium mt-0.5">Choose the plan that fits your job search</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-all"
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FaTimes size={8} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-700">Checkout Failed</p>
                            <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
                        </div>
                    </div>
                )}

                {/* Plans */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isLoading = loading === plan.type;
                        const isDisabled = !!loading;

                        return (
                            <div
                                key={plan.type}
                                className={`relative rounded-2xl border-2 p-5 transition-all duration-200 ${plan.cardBg} ${plan.borderClass}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary-600 text-white text-micro px-3 py-1 rounded-full shadow-lg">
                                            Best Value
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4 mt-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={plan.iconColor} size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-lg font-black text-surface-900 uppercase tracking-widest">{plan.name}</h3>
                                            <p className="text-tiny text-surface-500">{plan.tagline}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <div className="text-xl sm:text-2xl font-black text-surface-900">{plan.price}</div>
                                        <div className="text-micro text-surface-400 leading-tight max-w-[90px]">{plan.billingNote}</div>
                                    </div>
                                </div>

                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2.5 text-sm text-surface-700">
                                            <FaCheck className={`${plan.featureColor} flex-shrink-0`} size={11} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    onClick={() => handleUpgrade(plan.type)}
                                    disabled={isDisabled}
                                    className={`w-full py-3.5 rounded-xl text-nav transition-all duration-200 flex items-center justify-center gap-2 ${plan.ctaClass} disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]`}
                                    aria-label={`Select ${plan.name}`}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} aria-hidden="true" />
                                            Redirecting to Checkout...
                                        </>
                                    ) : (
                                        <>
                                            <Icon size={13} aria-hidden="true" />
                                            {plan.ctaLabel}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-1 flex items-center justify-center gap-2 text-xs text-surface-400">
                    <FaLock size={10} />
                    <span>Secure checkout powered by Stripe &middot; Cancel anytime</span>
                </div>
            </div>
        </div>
    );
}
