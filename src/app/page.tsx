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
        <div className="bg-white overflow-x-hidden">

            {/* ── HERO ── */}
            <section className="relative isolate px-6 pt-20 pb-32 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
                {/* background blobs */}
                <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary-100/50 blur-3xl" />
                    <div className="absolute top-60 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
                </div>

                <div className="mx-auto max-w-4xl text-center">
                    {/* badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-8">
                        <FaRocket size={12} /> Trusted by 10,000+ job seekers
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.08]">
                        Build a resume that
                        <span className="block text-primary-600 mt-2">gets you hired.</span>
                    </h1>

                    <p className="mt-8 text-xl leading-8 text-gray-500 max-w-2xl mx-auto">
                        Create a professional, ATS-optimized resume in minutes. Choose from stunning templates,
                        customize every detail, and download as a perfect PDF — for free.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-600/25 hover:bg-primary-700 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Build My Resume — Free
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-5 text-sm text-gray-400">No credit card required &mdash; free forever on the base plan</p>
                </div>

                {/* hero visual — mock resume card */}
                <div className="mt-20 mx-auto max-w-5xl px-4">
                    <div className="relative rounded-3xl bg-white shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
                        {/* window chrome */}
                        <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-4 text-xs text-gray-400 font-mono">resumebuilder.app/builder</span>
                        </div>
                        {/* mock UI */}
                        <div className="grid grid-cols-3 gap-0 min-h-[340px]">
                            {/* sidebar */}
                            <div className="col-span-1 bg-gray-50 border-r border-gray-100 p-5 space-y-3">
                                <div className="h-3 w-20 bg-primary-200 rounded-full" />
                                {['Personal Info', 'Experience', 'Education', 'Skills'].map((label) => (
                                    <div key={label} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                                        <div className="w-6 h-6 rounded-lg bg-primary-100 flex-shrink-0" />
                                        <div className="h-2.5 bg-gray-200 rounded-full flex-1" />
                                    </div>
                                ))}
                                <div className="mt-4 p-3 rounded-xl bg-primary-600/10 border border-primary-100">
                                    <div className="text-[10px] font-bold text-primary-700 mb-1.5">ATS SCORE</div>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-black text-primary-600">87</span>
                                        <span className="text-xs text-primary-400 mb-0.5">/100</span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 rounded-full bg-primary-100 overflow-hidden">
                                        <div className="h-full w-[87%] bg-primary-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                            {/* resume preview */}
                            <div className="col-span-2 p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1.5">
                                        <div className="h-5 w-40 bg-gray-800 rounded-full" />
                                        <div className="h-3 w-28 bg-primary-400 rounded-full" />
                                        <div className="flex gap-2 mt-1">
                                            <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
                                            <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-primary-100 border-2 border-primary-200 flex-shrink-0" />
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                                    <div className="h-2.5 w-16 bg-primary-500 rounded-full" />
                                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                                    <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                                    <div className="h-2 w-4/6 bg-gray-100 rounded-full" />
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-2">
                                    <div className="h-2.5 w-20 bg-primary-500 rounded-full" />
                                    {[1, 2].map((i) => (
                                        <div key={i} className="pl-3 border-l-2 border-primary-200 space-y-1">
                                            <div className="h-2.5 w-36 bg-gray-300 rounded-full" />
                                            <div className="h-2 w-24 bg-gray-200 rounded-full" />
                                            <div className="h-2 w-full bg-gray-100 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    <div className="h-2.5 w-16 bg-primary-500 rounded-full mb-2" />
                                    <div className="flex flex-wrap gap-2">
                                        {[60, 80, 50, 70, 55].map((w, i) => (
                                            <div key={i} className="h-5 rounded-full bg-primary-50 border border-primary-100" style={{ width: `${w}px` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF STRIP ── */}
            <section className="py-10 bg-gray-900">
                <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20 text-center">
                    {[['10,000+', 'Resumes created'], ['95%', 'Interview success rate'], ['4.9 / 5', 'Average rating'], ['2 min', 'Avg. time to first resume']].map(([stat, label]) => (
                        <div key={label}>
                            <div className="text-3xl font-black text-white">{stat}</div>
                            <div className="text-sm text-gray-400 mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-28 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">Features</span>
                        <h2 className="mt-3 text-4xl sm:text-5xl font-black text-gray-900">Everything you need to land the job</h2>
                        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                            From blank page to job-ready PDF — we handle the hard parts so you can focus on your story.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="group p-8 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-primary-600/20">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
                            Just four simple steps to download your resume:
                        </h2>
                    </div>

                    {/* Steps row */}
                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">

                        {/* Dashed arcs — desktop only */}
                        <svg aria-hidden className="hidden md:block absolute top-[80px] left-0 w-full h-16 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 900 60">
                            <path d="M112,50 Q225,0 338,50" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 5" />
                            <path d="M338,50 Q451,0 562,50" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 5" />
                            <path d="M562,50 Q675,0 788,50" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 5" />
                            {/* arrowheads */}
                            <polygon points="336,44 342,52 330,52" fill="#cbd5e1" />
                            <polygon points="560,44 566,52 554,52" fill="#cbd5e1" />
                            <polygon points="786,44 792,52 780,52" fill="#cbd5e1" />
                        </svg>

                        {[
                            {
                                label: 'Pick a template.',
                                color: 'bg-blue-50',
                                accent: 'bg-primary-600',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        {/* mini resume card */}
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1">
                                            <div className="h-2.5 w-full bg-primary-600 rounded-sm" />
                                            <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                            <div className="h-1 w-4/6 bg-gray-100 rounded-full" />
                                            <div className="mt-1 h-1.5 w-1/2 bg-primary-400 rounded-full" />
                                            <div className="h-1 w-full bg-gray-100 rounded-full" />
                                            <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                        </div>
                                        {/* pointing hand */}
                                        <div className="absolute -bottom-1 -right-1 text-2xl select-none" style={{ transform: 'scaleX(-1)' }}>👆</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Fill in the blanks using expert tips.',
                                color: 'bg-indigo-50',
                                accent: 'bg-indigo-600',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1">
                                            <div className="h-2.5 w-full bg-indigo-600 rounded-sm" />
                                            <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0 mt-0.5" />
                                                    <div className="h-1 flex-1 bg-gray-100 rounded-full mt-0.5" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute -bottom-1 -right-2 text-2xl select-none">✏️</div>
                                    </div>
                                ),
                            },
                            {
                                label: 'Personalise your document.',
                                color: 'bg-teal-50',
                                accent: 'bg-teal-500',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1">
                                            <div className="h-2.5 w-full bg-teal-500 rounded-sm" />
                                            <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                                            <div className="flex gap-1 mt-1">
                                                {['bg-primary-400','bg-teal-400','bg-amber-400','bg-red-400'].map(c => (
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
                                label: 'Download in PDF.',
                                color: 'bg-amber-50',
                                accent: 'bg-amber-500',
                                illustration: (
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        {/* stacked cards to suggest multiple formats */}
                                        <div className="relative w-20">
                                            <div className="absolute top-2 left-2 w-20 bg-amber-100 rounded shadow border border-amber-200 p-1.5 space-y-1 opacity-60">
                                                <div className="h-2.5 w-full bg-amber-300 rounded-sm" />
                                                <div className="h-1 w-3/4 bg-amber-200 rounded-full" />
                                            </div>
                                            <div className="relative w-20 bg-white rounded shadow-md border border-gray-200 p-1.5 space-y-1">
                                                <div className="h-2.5 w-full bg-amber-500 rounded-sm" />
                                                <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
                                                <div className="h-1 w-full bg-gray-100 rounded-full" />
                                                <div className="h-1 w-5/6 bg-gray-100 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl select-none">⬇️</div>
                                    </div>
                                ),
                            },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-5">
                                {/* illustration box */}
                                <div className={`relative w-full aspect-[4/3] ${step.color} rounded-2xl flex items-center justify-center p-4 overflow-visible`}>
                                    {step.illustration}
                                </div>

                                {/* numbered bubble */}
                                <div className={`w-10 h-10 rounded-full ${step.accent} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                                    {i + 1}
                                </div>

                                <p className="text-gray-700 font-medium text-sm leading-snug max-w-[140px]">{step.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/register"
                            className="px-10 py-4 bg-primary-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-600/25 hover:bg-primary-700 hover:-translate-y-0.5 transition-all"
                        >
                            Create Your Resume
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-28 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">Testimonials</span>
                        <h2 className="mt-3 text-4xl sm:text-5xl font-black text-gray-900">People love ResumeBuilder</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-5">
                                <div className="flex gap-1">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <FaStar key={i} className="text-amber-400" size={16} />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed flex-1">&ldquo;{t.body}&rdquo;</p>
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-sm text-gray-400">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section className="py-28 bg-gray-50">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">Pricing</span>
                        <h2 className="mt-3 text-4xl sm:text-5xl font-black text-gray-900">Simple, transparent pricing</h2>
                        <p className="mt-4 text-lg text-gray-500">Start free. Upgrade only when you&apos;re ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Free */}
                        <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                                <div className="mt-3 flex items-end gap-1">
                                    <span className="text-5xl font-black text-gray-900">$0</span>
                                    <span className="text-gray-400 mb-2">forever</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {FREE_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-gray-600">
                                        <FaCheck className="text-green-500 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="block w-full text-center py-3.5 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="relative p-8 bg-primary-600 rounded-2xl shadow-2xl shadow-primary-600/30">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                                <FaCrown size={12} /> Most Popular
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white">Pro</h3>
                                <div className="mt-3 flex items-end gap-1">
                                    <span className="text-5xl font-black text-white">$5.95</span>
                                    <span className="text-primary-200 mb-2">/ month</span>
                                </div>
                                <p className="text-primary-200 text-sm mt-1">Billed annually at $71.40</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {PRO_FEATURES.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-primary-100">
                                        <FaCheck className="text-white flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className="block w-full text-center py-3.5 bg-white text-primary-600 rounded-xl font-black hover:bg-primary-50 transition-colors shadow-lg">
                                Start Pro Trial — $2.70
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 bg-gray-900 relative overflow-hidden">
                <div aria-hidden className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary-600/20 blur-3xl" />
                </div>
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-semibold">
                        <FaRocket size={12} /> Join 10,000+ job seekers
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                        Your dream job is one resume away.
                    </h2>
                    <p className="mt-6 text-lg text-gray-400">
                        Stop settling for generic templates. Build something that truly represents you — in minutes.
                    </p>
                    <Link
                        href="/register"
                        className="group inline-flex items-center gap-3 mt-10 px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-primary-600/30 hover:bg-primary-500 hover:-translate-y-1 transition-all duration-200"
                    >
                        Build My Resume Now
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-5 text-sm text-gray-500">Free to start. No credit card required.</p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-950 py-12 px-6">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                            R
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">RESUME<span className="text-primary-400">BUILDER</span></span>
                    </Link>

                    <div className="flex items-center gap-8 text-sm text-gray-500">
                        <Link href="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
                        <Link href="/register" className="hover:text-gray-300 transition-colors">Sign Up</Link>
                    </div>

                    <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
