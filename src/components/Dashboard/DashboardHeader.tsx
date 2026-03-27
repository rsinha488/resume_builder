'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaUserCircle, FaBell, FaFileImport, FaSignOutAlt, FaUser } from 'react-icons/fa';
import ImportModal from './ImportModal';

export default function DashboardHeader() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                            R
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">RESUME<span className="text-primary-600">BUILDER</span></span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 h-16">
                        <Link
                            href="/dashboard"
                            className={`text-sm font-bold h-full flex items-center px-1 border-b-2 transition-all ${pathname === '/dashboard'
                                ? 'text-primary-600 border-primary-600'
                                : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'}`}
                        >
                            My Documents
                        </Link>
                        <Link
                            href="/templates"
                            className={`text-sm font-bold h-full flex items-center px-1 border-b-2 transition-all ${pathname === '/templates'
                                ? 'text-primary-600 border-primary-600'
                                : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'}`}
                        >
                            Templates
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    >
                        <FaFileImport /> Import Resume
                    </button>

                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative group" aria-label="Notifications">
                        <FaBell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-1.5 pl-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <span className="text-sm font-bold text-gray-700">My Account</span>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                <FaUserCircle size={24} />
                            </div>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">User Account</p>
                                </div>
                                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <FaUser size={14} /> Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt size={14} /> Logout
                                </button>
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
