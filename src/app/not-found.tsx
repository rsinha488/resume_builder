import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-8xl font-black text-primary-600 mb-4">404</h1>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Page not found</h2>
                <p className="text-gray-500 font-medium mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all inline-block"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
