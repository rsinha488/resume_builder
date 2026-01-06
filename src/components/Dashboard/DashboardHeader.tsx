'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaBell, FaFileImport } from 'react-icons/fa';
import ImportModal from './ImportModal';

export default function DashboardHeader() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            R
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">RESUME<span className="text-primary-600">BUILDER</span></span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-bold text-primary-600 border-b-2 border-primary-600 h-16 flex items-center">
                            My Documents
                        </Link>
                        <Link href="/templates" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                            Templates
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                        <FaFileImport /> Import Resume
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative" aria-label="Notifications">
                        <FaBell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="flex items-center gap-2 p-1 pl-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-all" aria-label="User Menu">
                        <span className="text-sm font-bold text-gray-700">My Account</span>
                        <FaUserCircle size={24} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </header>
    );
}
