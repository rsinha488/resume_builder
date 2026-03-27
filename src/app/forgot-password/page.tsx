'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import Link from 'next/link';

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/forgot-password', { email: data.email });
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                {submitted ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                        <p className="text-gray-600 text-sm">
                            If an account exists for that email, we&apos;ve sent a password reset link. It expires in 1 hour.
                        </p>
                        <Link href="/login" className="inline-block mt-4 text-primary-600 hover:text-primary-500 font-medium text-sm">
                            ← Back to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">Forgot password?</h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-md"
                            >
                                {loading ? 'Sending...' : 'Send reset link'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                    ← Back to sign in
                                </Link>
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
