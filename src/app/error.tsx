'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-500 text-2xl font-black">!</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-3">Something went wrong</h1>
                <p className="text-gray-500 font-medium mb-8">
                    An unexpected error occurred. Please try again or go back to the dashboard.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
