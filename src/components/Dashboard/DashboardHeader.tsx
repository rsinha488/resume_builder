'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaUserCircle, FaBell, FaFileImport, FaSignOutAlt, FaUser } from 'react-icons/fa';
import ImportModal from './ImportModal';

export default function DashboardHeader() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchProfile = () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                setUserName(data.name || null);
                setUserEmail(data.email || null);
                setUserAvatar(data.avatarUrl || null);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchProfile();
        globalThis.addEventListener('profile-updated', fetchProfile);
        return () => globalThis.removeEventListener('profile-updated', fetchProfile);
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('token');
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-surface-100 sticky top-0 z-40">
            <div className="max-w-full mx-auto px-8 h-20 flex justify-between items-center">
                <div className="flex items-center gap-16">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            R
                        </div>
                        <span className="text-xl font-black tracking-tight text-surface-900 group-hover:text-primary-600 transition-colors">RESUME<span className="text-primary-600">BUILDER</span></span>
                    </Link>
 
                    <nav className="hidden lg:flex items-center gap-10 h-20">
                        <Link
                            href="/dashboard"
                            className={`text-[10px] font-black uppercase tracking-[0.2em] h-full flex items-center px-1 border-b-2 transition-all relative group/nav ${pathname === '/dashboard'
                                ? 'text-primary-600 border-primary-600'
                                : 'text-surface-400 border-transparent hover:text-surface-900'}`}
                        >
                            My Documents
                            {pathname !== '/dashboard' && <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover/nav:w-full transition-all duration-300" />}
                        </Link>
                        <Link
                            href="/templates"
                            className={`text-[10px] font-black uppercase tracking-[0.2em] h-full flex items-center px-1 border-b-2 transition-all relative group/nav ${pathname === '/templates'
                                ? 'text-primary-600 border-primary-600'
                                : 'text-surface-400 border-transparent hover:text-surface-900'}`}
                        >
                            Templates
                            {pathname !== '/templates' && <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover/nav:w-full transition-all duration-300" />}
                        </Link>
                    </nav>
                </div>
 
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-transparent hover:border-primary-100"
                    >
                        <FaFileImport className="text-xs" /> Import Resume
                    </button>
 
                    <button className="relative w-10 h-10 flex items-center justify-center text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group" aria-label="Notifications">
                        <FaBell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
 
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`flex items-center gap-4 p-1 rounded-2xl border transition-all duration-300 ${
                                isUserMenuOpen 
                                ? 'bg-surface-50 border-primary-200 ring-4 ring-primary-500/10' 
                                : 'border-surface-100 hover:border-surface-200 hover:bg-surface-50'
                            }`}
                        >
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary-100 flex items-center justify-center text-primary-700 font-black text-sm flex-shrink-0 shadow-inner">
                                {(() => {
                                    if (userAvatar) return <Image src={userAvatar} alt="avatar" width={36} height={36} className="object-cover w-full h-full" />;
                                    if (userName) return userName.charAt(0).toUpperCase();
                                    return <FaUserCircle size={22} />;
                                })()}
                            </div>
                            <div className="hidden sm:block text-left pr-4">
                                <p className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none mb-1">{userName || 'My Account'}</p>
                                <p className="text-[9px] font-bold text-surface-400 uppercase tracking-widest leading-none">Settings</p>
                            </div>
                        </button>
 
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-premium border border-surface-100 py-3 animate-fade-in-up">
                                <div className="px-6 py-4 border-b border-surface-50">
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2">Authenticated as</p>
                                    <p className="text-sm font-black text-surface-900 truncate">
                                        {userName || 'My Account'}
                                    </p>
                                    {userEmail && <p className="text-xs font-medium text-surface-400 truncate mt-1">{userEmail}</p>}
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-surface-600 hover:bg-surface-50 hover:text-primary-600 rounded-2xl transition-all group">
                                        <div className="w-8 h-8 rounded-xl bg-surface-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                            <FaUser size={12} />
                                        </div>
                                        Personal Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <FaSignOutAlt size={12} />
                                        </div>
                                        Sign Out Safely
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </header>
    );
}
