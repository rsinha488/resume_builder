'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const check = () => setIsLoggedIn(!!localStorage.getItem('token'));
        check();
        window.addEventListener('storage', check);
        return () => window.removeEventListener('storage', check);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; max-age=0';
        setIsLoggedIn(false);
        router.push('/login');
    };

    // Hide navbar on dashboard, builder, and templates pages
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/builder') || pathname.startsWith('/templates')) {
        return null;
    }

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                    R
                </div>
                <span className="text-xl font-black tracking-tight text-gray-900">RESUME<span className="text-primary-600">BUILDER</span></span>
            </Link>
            {!isAuthPage && isLoggedIn !== null && (
                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="px-4 py-2 text-primary-600 border border-primary-600 rounded-md font-medium hover:bg-primary-50 transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors shadow-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
