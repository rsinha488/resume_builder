'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import UpgradeModal from '@/components/UpgradeModal';
import { FaUser, FaEnvelope, FaLock, FaCrown, FaCalendar, FaCamera, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Profile {
    email: string;
    name: string | null;
    avatarUrl: string | null;
    plan: string;
    subscriptionType: string;
    planExpiry: string | null;
    createdAt: string;
}

function getCompletionSteps(profile: Profile, hasPassword: boolean) {
    return [
        { label: 'Email verified', done: !!profile.email },
        { label: 'Display name set', done: !!profile.name },
        { label: 'Profile photo uploaded', done: !!profile.avatarUrl },
        { label: 'Password secured', done: hasPassword },
    ];
}

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [savingName, setSavingName] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }
        axios.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setProfile(res.data);
                setName(res.data.name || '');
            })
            .catch(() => { toast.error('Failed to load profile.'); router.push('/dashboard'); })
            .finally(() => setLoading(false));
    }, [router]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB.'); return; }

        setUploadingAvatar(true);
        const token = localStorage.getItem('token');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await axios.post('/api/upload', formData);
            const avatarUrl = uploadRes.data.secure_url;

            const res = await axios.patch('/api/user/profile', { avatarUrl }, { headers: { Authorization: `Bearer ${token}` } });
            setProfile(prev => prev ? { ...prev, avatarUrl: res.data.avatarUrl } : prev);
            window.dispatchEvent(new Event('profile-updated'));
            toast.success('Profile photo updated.');
        } catch {
            toast.error('Failed to upload photo. Please try again.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveName = async () => {
        const token = localStorage.getItem('token');
        setSavingName(true);
        try {
            const res = await axios.patch('/api/user/profile', { name }, { headers: { Authorization: `Bearer ${token}` } });
            setProfile(prev => prev ? { ...prev, name: res.data.name } : prev);
            window.dispatchEvent(new Event('profile-updated'));
            toast.success('Name updated successfully.');
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to update name.');
        } finally {
            setSavingName(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) { toast.error('New passwords do not match.'); return; }
        if (newPassword.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
        const token = localStorage.getItem('token');
        setSavingPassword(true);
        try {
            await axios.patch('/api/user/profile', { currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Password changed successfully.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to change password.');
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
    );

    const steps = getCompletionSteps(profile!, true);
    const completedCount = steps.filter(s => s.done).length;
    const completionPct = Math.round((completedCount / steps.length) * 100);
    const planLabel = profile?.plan === 'PRO'
        ? profile.subscriptionType === 'TRIAL' ? 'PRO — Trial' : 'PRO — Annual'
        : 'Free';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12 space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your profile and security settings.</p>
                </div>

                {/* Profile Completion */}
                {completionPct < 100 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-blue-800">Profile Completion</p>
                            <span className="text-sm font-black text-blue-600">{completionPct}%</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {steps.map(step => (
                                <div key={step.label} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-500' : 'bg-blue-200'}`}>
                                        {step.done && <FaCheck size={8} className="text-white" />}
                                    </div>
                                    <span className={`text-xs ${step.done ? 'text-gray-500 line-through' : 'text-blue-800 font-semibold'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {completionPct === 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <FaCheck className="text-white" size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-green-800">Profile complete!</p>
                            <p className="text-xs text-green-600">Your profile is fully set up.</p>
                        </div>
                    </div>
                )}

                {/* Avatar + Name Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Profile</h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 flex items-center justify-center">
                                {profile?.avatarUrl ? (
                                    <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-primary-600">
                                        {profile?.name ? profile.name.charAt(0).toUpperCase() : profile?.email.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50"
                                title="Upload photo"
                            >
                                <FaCamera size={10} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{profile?.name || 'No name set'}</p>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                            >
                                {uploadingAvatar ? 'Uploading...' : 'Change photo'}
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            <FaEnvelope className="inline mr-2 text-gray-400" size={12} />Email
                        </label>
                        <input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            <FaUser className="inline mr-2 text-gray-400" size={12} />Display Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                        />
                    </div>

                    <button
                        onClick={handleSaveName}
                        disabled={savingName || name.trim() === (profile?.name || '')}
                        className="px-6 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {savingName ? 'Saving...' : 'Save Name'}
                    </button>
                </div>

                {/* Subscription */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Subscription</h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaCrown className={profile?.plan === 'PRO' ? 'text-yellow-500' : 'text-gray-300'} size={20} />
                            <div>
                                <p className="font-bold text-gray-900">{planLabel}</p>
                                {profile?.plan === 'PRO' && profile.subscriptionType === 'TRIAL' && profile.planExpiry && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                        <FaCalendar size={10} /> Expires {new Date(profile.planExpiry).toLocaleDateString()}
                                    </p>
                                )}
                                {profile?.plan === 'FREE' && (
                                    <p className="text-xs text-gray-500 mt-0.5">Upgrade to unlock PDF downloads and premium templates.</p>
                                )}
                            </div>
                        </div>
                        {profile?.plan === 'FREE' && (
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition-colors"
                            >
                                Upgrade
                            </button>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                        <FaCalendar size={10} />
                        Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <FaLock className="inline mr-2" size={12} />Change Password
                    </h2>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                            <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none" />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none" />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleChangePassword}
                        disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </main>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgradeSuccess={() => {
                    setIsUpgradeModalOpen(false);
                    // Optionally refresh profile here
                    window.location.reload();
                }}
            />
        </div>
    );
}
