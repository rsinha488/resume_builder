'use client';
import { COLOR_PALETTES, FONT_PAIRINGS } from '@/lib/themes';
import { FaLock, FaCheckCircle, FaPlus, FaMagic, FaCrown } from 'react-icons/fa';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRef } from 'react';
import {
    updateThemeColor,
    updateFontFamily,
    updateFontSize,
    updateLineSpacing,
    updateSectionSpacing,
    updateMargins,
    updateIsMultiPage
} from '@/lib/features/resume/resumeSlice';

interface ThemeSelectorProps {
    readonly userPlan: 'FREE' | 'PRO';
    readonly onUpgrade: () => void;
}

export default function ThemeSelector({ userPlan, onUpgrade }: ThemeSelectorProps) {
    const dispatch = useAppDispatch();
    const {
        themeColor,
        fontFamily,
        fontSize,
        lineSpacing,
        sectionSpacing,
        margins,
        isMultiPage
    } = useAppSelector((state) => state.resume);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleCustomColorClick = () => {
        if (userPlan === 'FREE') {
            onUpgrade();
            return;
        }
        colorInputRef.current?.click();
    };

    const isCustomColor = themeColor && !COLOR_PALETTES.some(p => p.primary === themeColor);

    return (
        <div className="space-y-16 animate-fade-in-up pb-20">
            {/* Color Palettes */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Design Identity</h3>
                </div>
                
                <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-4">
                    {COLOR_PALETTES.map((palette) => {
                        const isLocked = palette.premium && userPlan === 'FREE';
                        const isSelected = themeColor === palette.primary;

                        return (
                            <button
                                key={palette.id}
                                onClick={() => !isLocked && dispatch(updateThemeColor(palette.primary))}
                                className={`relative group flex flex-col items-center gap-2 transition-all duration-300 ${isLocked ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                title={palette.name}
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center shadow-sm ${
                                        isSelected 
                                        ? 'border-white ring-4 ring-primary-500/20 scale-110' 
                                        : 'border-transparent group-hover:border-white group-hover:shadow-lg'
                                    }`}
                                    style={{ backgroundColor: palette.primary }}
                                >
                                    {isSelected && <FaCheckCircle className="text-white drop-shadow-lg" size={16} />}
                                    {isLocked && <FaLock className="text-white/40 backdrop-blur-sm" size={12} />}
                                </div>
                                {isLocked && (
                                    <div className="absolute -top-2 -right-2 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-lg border border-white">
                                        PRO
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    {/* Custom Color Picker */}
                    <div className="relative group flex flex-col items-center gap-2">
                        <button
                            onClick={handleCustomColorClick}
                            className={`w-12 h-12 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                                isCustomColor 
                                ? 'border-white ring-4 ring-primary-500/20 scale-110' 
                                : 'border-surface-200 hover:border-primary-400 hover:bg-surface-50'
                            } ${userPlan === 'FREE' ? 'cursor-not-allowed opacity-60' : ''}`}
                            style={isCustomColor ? { backgroundColor: themeColor } : {}}
                            title="Custom Color"
                        >
                            {isCustomColor ? (
                                <FaCheckCircle className="text-white drop-shadow-lg" size={16} />
                            ) : (
                                <FaPlus className="text-surface-400 group-hover:text-primary-600" size={16} />
                            )}
                        </button>
                        <input
                            ref={colorInputRef}
                            type="color"
                            className="sr-only"
                            value={isCustomColor ? themeColor : '#2563eb'}
                            onChange={(e) => dispatch(updateThemeColor(e.target.value))}
                        />
                        {userPlan === 'FREE' && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-lg border border-white">
                                PRO
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Font Pairings */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Typography Scale</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FONT_PAIRINGS.map((pairing) => {
                        const isLocked = pairing.premium && userPlan === 'FREE';
                        const isSelected = fontFamily === pairing.heading;

                        return (
                            <button
                                key={pairing.id}
                                onClick={() => !isLocked && dispatch(updateFontFamily(pairing.heading))}
                                className={`group relative w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                                    isSelected
                                    ? 'border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/5'
                                    : 'border-surface-100 hover:border-surface-200 bg-white hover:shadow-xl hover:-translate-y-0.5'
                                    } ${isLocked ? 'cursor-not-allowed' : ''}`}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-lg font-black text-surface-900 group-hover:text-primary-600 transition-colors" style={{ fontFamily: pairing.heading }}>
                                        {pairing.name}
                                    </span>
                                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest leading-none">
                                        {pairing.heading.split(',')[0]} + {pairing.body.split(',')[0]}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isLocked ? (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                                            <FaLock size={8} /> 
                                            <span className="text-[8px] font-black uppercase tracking-widest">PRO</span>
                                        </div>
                                    ) : (
                                        isSelected && <FaCheckCircle className="text-primary-600 scale-110" size={20} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Advanced Controls */}
            <section className="space-y-12">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Global Spacing</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Font Size */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-surface-900 uppercase tracking-[0.2em] block">Base Typography Size</label>
                        <div className="flex p-1.5 bg-surface-100/50 rounded-2xl border border-surface-100">
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => dispatch(updateFontSize(size))}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${fontSize === size
                                        ? 'bg-white text-primary-600 shadow-premium'
                                        : 'text-surface-400 hover:text-surface-600'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Page Layout Toggle */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-surface-900 uppercase tracking-[0.2em] flex items-center gap-2">
                            Document Scope
                            {userPlan === 'FREE' && <FaLock className="text-amber-500" size={10} />}
                        </label>
                        <div className="flex p-1.5 bg-surface-100/50 rounded-2xl border border-surface-100">
                            <button
                                type="button"
                                onClick={() => {
                                    if (userPlan === 'FREE') onUpgrade();
                                    else dispatch(updateIsMultiPage(false));
                                }}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${!isMultiPage
                                    ? 'bg-white text-primary-600 shadow-premium'
                                    : 'text-surface-400 hover:text-surface-600'
                                    } ${userPlan === 'FREE' ? 'opacity-50' : ''}`}
                            >
                                Single Page
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (userPlan === 'FREE') onUpgrade();
                                    else dispatch(updateIsMultiPage(true));
                                }}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${isMultiPage
                                    ? 'bg-white text-primary-600 shadow-premium'
                                    : 'text-surface-400 hover:text-surface-600'
                                    } ${userPlan === 'FREE' ? 'opacity-50' : ''}`}
                            >
                                Multi-Page
                            </button>
                        </div>
                    </div>

                    {/* Sliders Container */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Line Spacing */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <label htmlFor="line-spacing" className="text-[10px] font-black text-surface-900 uppercase tracking-widest">Line height</label>
                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{lineSpacing}x</span>
                            </div>
                            <input
                                id="line-spacing"
                                type="range"
                                min="1"
                                max="2"
                                step="0.05"
                                value={lineSpacing}
                                onChange={(e) => dispatch(updateLineSpacing(Number.parseFloat(e.target.value)))}
                                className="premium-range"
                            />
                        </div>

                        {/* Section Spacing */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label htmlFor="section-spacing" className="text-[10px] font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
                                    Section Gaps
                                    {userPlan === 'FREE' && <FaLock className="text-amber-500" size={10} />}
                                </label>
                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{sectionSpacing}px</span>
                            </div>
                            <input
                                id="section-spacing"
                                type="range"
                                min="8"
                                max="64"
                                step="4"
                                value={sectionSpacing}
                                disabled={userPlan === 'FREE'}
                                onChange={(e) => dispatch(updateSectionSpacing(Number.parseInt(e.target.value, 10)))}
                                className={`premium-range ${userPlan === 'FREE' ? 'opacity-30 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        {/* Margins */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label htmlFor="page-margins" className="text-[10px] font-black text-surface-900 uppercase tracking-widest flex items-center gap-2">
                                    Page Margins
                                    {userPlan === 'FREE' && <FaLock className="text-amber-500" size={10} />}
                                </label>
                                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{margins}px</span>
                            </div>
                            <input
                                id="page-margins"
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={margins}
                                disabled={userPlan === 'FREE'}
                                onChange={(e) => dispatch(updateMargins(Number.parseInt(e.target.value, 10)))}
                                className={`premium-range ${userPlan === 'FREE' ? 'opacity-30 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Fit to One Page Button */}
                <div className="pt-8">
                    <button
                        onClick={() => {
                            if (userPlan === 'FREE') {
                                onUpgrade();
                                return;
                            }

                            const content = document.getElementById('resume-content');
                            if (!content) return;

                            const A4_HEIGHT = 1122;
                            let currentHeight = content.scrollHeight;

                            if (currentHeight <= A4_HEIGHT) {
                                toast.success('Perfect! Your resume already fits on one page.');
                                return;
                            }

                            if (sectionSpacing > 12) dispatch(updateSectionSpacing(12));
                            if (lineSpacing > 1) dispatch(updateLineSpacing(1));
                            if (fontSize === 'large') dispatch(updateFontSize('medium'));
                            else if (fontSize === 'medium') dispatch(updateFontSize('small'));
                            if (margins > 40) dispatch(updateMargins(40));

                            toast.success('Optimized layout to fit on one page!');
                        }}
                        className={`group relative w-full py-6 rounded-[2rem] bg-surface-950 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary-600 transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 overflow-hidden ${userPlan === 'FREE' ? 'grayscale opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <FaMagic className="text-primary-400 group-hover:rotate-12 transition-transform" /> 
                        <span className="relative z-10">Magic Fit to Single Page</span>
                        {userPlan === 'FREE' && <FaLock size={10} className="relative z-10 text-amber-500" />}
                    </button>
                    <p className="text-[10px] text-surface-400 mt-6 text-center font-bold uppercase tracking-widest opacity-60">
                        Intelligently recalibrates geometry for maximum spatial efficiency.
                    </p>
                </div>
            </section>

            {/* Upgrade Prompt */}
            {userPlan === 'FREE' && (
                <div className="relative overflow-hidden group bg-gradient-to-br from-amber-500 to-orange-600 p-10 rounded-[2.5rem] shadow-2xl shadow-amber-500/20 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <FaCrown className="text-white text-2xl animate-float" />
                                <h4 className="text-2xl font-black tracking-tight">Unlock Creative Freedom</h4>
                            </div>
                            <p className="text-amber-50 text-sm font-medium max-w-md">
                                Get unlimited access to professional color palettes, artisan font pairings, and surgical spacing controls.
                            </p>
                        </div>
                        <button
                            onClick={onUpgrade}
                            className="btn-primary !bg-white !text-amber-600 !px-8 !py-4 !rounded-2xl !text-[10px] !font-black uppercase tracking-widest hover:!bg-amber-50 active:scale-95 shadow-xl shrink-0"
                        >
                            Upgrade to Pro Experience
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
