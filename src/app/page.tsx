'use client';
import Link from 'next/link';
import {
    FaRocket, FaMagic, FaDownload, FaCheck, FaCrown,
    FaFileAlt, FaBolt, FaShieldAlt, FaStar, FaArrowRight, FaChartBar
} from 'react-icons/fa';

const FEATURES = [
    {
        icon: <FaMagic className="text-white" size={20} />,
        title: 'AI-Powered Builder',
        desc: 'Our smart builder guides you step-by-step and suggests content improvements to make your resume stand out.',
    },
    {
        icon: <FaFileAlt className="text-white" size={20} />,
        title: '10+ Premium Templates',
        desc: 'Recruiter-approved designs crafted for every industry — from tech to finance, creative to executive.',
    },
    {
        icon: <FaChartBar className="text-white" size={20} />,
        title: 'ATS Score Checker',
        desc: 'Instantly see how your resume performs against Applicant Tracking Systems and fix issues before applying.',
    },
    {
        icon: <FaDownload className="text-white" size={20} />,
        title: 'Instant PDF Export',
        desc: 'Download a pixel-perfect PDF in seconds. Ready to send to recruiters the moment you\'re done.',
    },
    {
        icon: <FaBolt className="text-white" size={20} />,
        title: 'Import Existing Resume',
        desc: 'Upload your old PDF or DOCX and we\'ll parse it automatically — no starting from scratch.',
    },
    {
        icon: <FaShieldAlt className="text-white" size={20} />,
        title: 'Privacy First',
        desc: 'Your data is yours. We never share your personal information with third parties.',
    },
];

const TESTIMONIALS = [
    {
        name: 'Priya S.',
        role: 'Software Engineer',
        body: 'I landed 3 interviews in a week after switching to ResumeBuilder. The ATS checker is a game changer.',
        rating: 5,
    },
    {
        name: 'Marcus T.',
        role: 'Product Manager',
        body: 'Cleanest resume tool I\'ve ever used. Took me 20 minutes to go from blank to PDF-ready.',
        rating: 5,
    },
    {
        name: 'Aisha K.',
        role: 'UX Designer',
        body: 'The templates are gorgeous and the customization options are exactly what I needed to show my personality.',
        rating: 5,
    },
];

const FREE_FEATURES = [
    '1 resume & cover letter',
    '3 free templates',
    'PDF download',
    'ATS score checker',
];

const PRO_FEATURES = [
    'Unlimited resumes & cover letters',
    '10+ premium templates',
    'All premium color themes & fonts',
    'Priority support',
    'Import from PDF / DOCX',
];

export default function HomePage() {
    return (
        <div className="bg-surface-50 min-h-screen selection:bg-primary-100 selection:text-primary-900">

            {/* ── HERO ── */}
            <section className="relative isolate px-6 pt-32 pb-40 lg:px-8 bg-gradient-to-b from-white to-surface-50 overflow-hidden">
                {/* background blobs */}
                <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary-100/30 blur-[100px] animate-pulse" />
                    <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-100/20 blur-[80px]" />
                </div>

                <div className="mx-auto max-w-4xl text-center">
                    {/* badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-200 text-surface-600 text-sm font-medium mb-10 shadow-sm animate-fade-in">
                        <FaRocket className="text-primary-600" size={12} /> Trusted by 10,000+ job seekers
                    </div>

                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-surface-900 leading-[0.95] mb-8 animate-fade-in-up [animation-delay:200ms]">
                        Build a resume that
                        <span className="block text-primary-600 mt-2">gets you hired.</span>
                    </h1>

                    <p className="mt-10 text-xl leading-relaxed text-surface-500 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms]">
                        Create a professional, ATS-optimized resume in minutes. Choose from stunning templates,
                        customize every detail, and download as a perfect PDF.
                    </p>

                    <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:600ms]">
                        <Link
                            href="/register"
                            className="btn-primary text-lg !px-10 !py-5"
                        >
                            Build My Resume — Free
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="btn-secondary text-lg !px-10 !py-5"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-surface-400 animate-fade-in [animation-delay:800ms]">No credit card required &mdash; free forever on the base plan</p>
                </div>

                {/* hero visual — mock resume card */}
                <div className="mt-24 mx-auto max-w-5xl px-4 animate-fade-in-up [animation-delay:1000ms]">
                    <div className="relative rounded-4xl bg-white shadow-2xl border border-surface-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                        {/* window chrome */}
                        <div className="flex items-center gap-2 px-6 py-4 bg-surface-50/50 border-b border-surface-100 backdrop-blur-sm">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-6 text-xs text-surface-400 font-mono tracking-widest uppercase">resumebuilder.app/builder</span>
                        </div>
                        {/* mock UI */}
                        <div className="grid grid-cols-3 gap-0 min-h-[400px]">
                            {/* sidebar */}
                            <div className="col-span-1 bg-surface-50/30 border-r border-surface-100 p-8 space-y-4">
                                <div className="h-4 w-28 bg-primary-100 rounded-lg mb-6" />
                                {['Personal Info', 'Experience', 'Education', 'Skills'].map((label) => (
                                    <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-surface-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-xl bg-primary-50 flex-shrink-0" />
                                        <div className="h-3 bg-surface-100 rounded-full flex-1" />
                                    </div>
                                ))}
                                <div className="mt-8 p-5 rounded-3xl bg-primary-600 text-white shadow-xl shadow-primary-600/30">
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">ATS SCORE</div>
                                    <div className="flex items-end gap-1">
                                        <span className="text-3xl font-black">87</span>
                                        <span className="text-xs mb-1 opacity-70">/100</span>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                                        <div className="h-full w-[87%] bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                            {/* resume preview */}
                            <div className="col-span-2 p-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div className="h-8 w-56 bg-surface-900 rounded-xl" />
                                        <div className="h-4 w-36 bg-primary-500 rounded-lg" />
                                        <div className="flex gap-3">
                                            <div className="h-3 w-24 bg-surface-200 rounded-full" />
                                            <div className="h-3 w-32 bg-surface-200 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="w-20 h-20 rounded-3xl bg-surface-100 border border-surface-200 animate-float" />
                                </div>
                                <div className="border-t border-surface-100 pt-6 space-y-3">
                                    <div className="h-3 w-20 bg-primary-600 rounded-lg" />
                                    <div className="h-2.5 w-full bg-surface-50 rounded-full" />
                                    <div className="h-2.5 w-5/6 bg-surface-50 rounded-full" />
                                    <div className="h-2.5 w-4/6 bg-surface-50 rounded-full" />
                                </div>
                                <div className="border-t border-surface-100 pt-6 space-y-4">
                                    <div className="h-3 w-32 bg-primary-600 rounded-lg" />
                                    {[1, 2].map((i) => (
                                        <div key={i} className="pl-4 border-l-2 border-primary-100 space-y-2">
                                            <div className="h-3 w-48 bg-surface-300 rounded-lg" />
                                            <div className="h-2.5 w-full bg-surface-50 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF STRIP ── */}
            <section className="py-12 bg-surface-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 text-center">
                    {[
                        ['10,000+', 'Resumes created'],
                        ['95%', 'Interview success rate'],
                        ['4.9 / 5', 'Average rating'],
                        ['2 min', 'Avg. time to first resume']
                    ].map(([stat, label]) => (
                        <div key={label} className="animate-fade-in">
                            <div className="text-4xl font-black text-white mb-1">{stat}</div>
                            <div className="text-xs font-bold text-surface-400 uppercase tracking-widest">{label}</div>
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            </section>

            {/* ── FEATURES ── */}
            <section className="py-32 bg-white relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-[0.3em] mb-4 block">Capabilities</span>
                        <h2 className="text-4xl sm:text-6xl font-black text-surface-900 leading-[1.1]">Everything you need to <br />land the job</h2>
                        <p className="mt-6 text-xl text-surface-500 max-w-2xl mx-auto">
                            From blank page to job-ready PDF — we handle the hard parts so you can focus on your story.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {FEATURES.map((f, i) => (
                            <div key={f.title} className="premium-card p-10 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-primary-600/20">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-surface-900 mb-4">{f.title}</h3>
                                <p className="text-surface-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-32 bg-surface-50/50">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-black text-surface-900 leading-tight">
                            Just four simple steps to <br />your dream job
                        </h2>
                    </div>

                    {/* Steps row */}
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            {
                                label: 'Pick a template.',
                                color: 'bg-blue-50',
                                accent: 'bg-primary-600',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1 transform -rotate-3 transition-transform group-hover:rotate-0">
                                            <div className="h-2.5 w-full bg-primary-600 rounded-sm" />
                                            <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                            <div className="mt-1 h-1.5 w-1/2 bg-primary-400 rounded-full" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl select-none" style={{ transform: 'scaleX(-1)' }}>👆</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Fill in the blanks.',
                                color: 'bg-indigo-50',
                                accent: 'bg-indigo-600',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1 transform rotate-2">
                                            <div className="h-2.5 w-full bg-indigo-600 rounded-sm" />
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0 mt-0.5" />
                                                    <div className="h-1 flex-1 bg-gray-100 rounded-full mt-0.5" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute -bottom-1 -right-2 text-2xl select-none">✏️</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Personalise style.',
                                color: 'bg-violet-50',
                                accent: 'bg-violet-500',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1 transform -rotate-2">
                                            <div className="flex gap-1 mb-1">
                                                {['bg-primary-400', 'bg-violet-400', 'bg-amber-400'].map(c => (
                                                    <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                                                ))}
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl select-none">🎨</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Download PDF.',
                                color: 'bg-amber-50',
                                accent: 'bg-amber-500',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1 transform rotate-3">
                                            <div className="h-2.5 w-full bg-amber-500 rounded-sm" />
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl select-none">⬇️</div>
                                    </div>
                                ),
                            },
                        ].map((step, i) => (
                            <div key={step.label} className="flex flex-col items-center text-center gap-6 group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className={`relative w-full aspect-[4/3] ${step.color} rounded-3xl flex items-center justify-center p-6 border border-surface-100`}>
                                    {step.illustration}
                                </div>
                                <div className={`w-12 h-12 rounded-full ${step.accent} text-white font-black text-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                    {i + 1}
                                </div>
                                <p className="text-surface-900 font-bold text-lg leading-snug">{step.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-20 flex justify-center">
                        <Link
                            href="/register"
                            className="btn-primary !rounded-full !px-12 !py-4 text-sm uppercase tracking-[0.2em]"
                        >
                            Create Your Resume
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-[0.3em] mb-4 block">Success Stories</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-surface-900 leading-tight">People love ResumeBuilder</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={t.name} className="p-10 rounded-3xl bg-surface-50 border border-surface-100 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="flex gap-1.5">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <FaStar key={j} className="text-amber-400" size={18} />
                                    ))}
                                </div>
                                <p className="text-surface-700 leading-relaxed italic text-lg flex-1">&ldquo;{t.body}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-surface-900">{t.name}</div>
                                        <div className="text-sm text-surface-400 font-medium">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section className="py-32 bg-surface-50/50">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-[0.3em] mb-4 block">Fair Pricing</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-surface-900 leading-tight">Simple, transparent plans</h2>
                        <p className="mt-6 text-xl text-surface-500">Start free. Upgrade only when you&apos;re ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        {/* Free */}
                        <div className="p-12 bg-white rounded-4xl border border-surface-200 shadow-premium group hover:-translate-y-2 transition-all duration-300">
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-surface-900 mb-4">Basic</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black text-surface-900">$0</span>
                                    <span className="text-surface-400 font-bold uppercase tracking-widest text-sm">forever</span>
                                </div>
                            </div>
                            <ul className="space-y-5 mb-12">
                                {FREE_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-4 text-surface-600 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="text-green-600" size={10} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="btn-secondary w-full !rounded-2xl !py-4 text-lg">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="relative p-12 bg-primary-600 rounded-4xl shadow-2xl shadow-primary-600/40 text-white group hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <FaCrown size={120} />
                            </div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-surface-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg z-10">
                                <FaCrown size={14} /> Recommended
                            </div>
                            <div className="mb-10 relative z-10">
                                <h3 className="text-2xl font-bold text-white/90 mb-4">Professional</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black text-white">$5.95</span>
                                    <span className="text-primary-100 font-bold uppercase tracking-widest text-sm">/ month</span>
                                </div>
                                <p className="text-primary-100 text-sm mt-2 font-medium opacity-80">Billed annually at $71.40</p>
                            </div>
                            <ul className="space-y-5 mb-12 relative z-10">
                                {PRO_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-4 text-primary-50 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="text-white" size={10} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="block w-full text-center py-4 bg-white text-primary-600 rounded-2xl font-black text-lg hover:bg-primary-50 transition-all shadow-xl group-hover:scale-[1.02]">
                                Start Pro Trial — $2.70
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 bg-surface-900 relative overflow-hidden">
                <div aria-hidden className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-primary-600/20 blur-[120px] animate-pulse" />
                </div>
                <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-sm font-bold uppercase tracking-widest">
                        <FaRocket size={14} /> Join 10,000+ job seekers
                    </div>
                    <h2 className="text-5xl sm:text-7xl font-black text-white leading-[1.1] mb-10">
                        Your dream job is <br />one resume away.
                    </h2>
                    <p className="text-xl text-surface-400 mb-14 max-w-2xl mx-auto font-medium">
                        Stop settling for generic templates. Build something that truly represents you — in minutes.
                    </p>
                    <Link
                        href="/register"
                        className="group inline-flex items-center gap-4 px-12 py-6 bg-primary-600 text-white rounded-3xl font-black text-2xl shadow-[0_20px_50px_-15px_rgba(124,58,237,0.5)] hover:bg-primary-500 hover:-translate-y-2 transition-all duration-300"
                    >
                        Build My Resume Now
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <p className="mt-8 text-surface-500 font-medium">Free to start. No credit card required.</p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-surface-950 py-20 px-6 border-t border-white/5">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                R
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white uppercase italic">RESUME<span className="text-primary-500">BUILDER</span></span>
                        </Link>

                        <div className="flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-surface-500">
                            <Link href="/login" className="hover:text-primary-400 transition-colors">Sign In</Link>
                            <Link href="/register" className="hover:text-primary-400 transition-colors">Sign Up</Link>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
                        <p className="text-sm text-surface-600 font-medium">&copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
                        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-surface-600">
                            <Link href="#" className="hover:text-surface-400 transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-surface-400 transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
