'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-primary-600 transition-colors">
                ResumeBuilder
            </Link>
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
        </nav>
    );
}
