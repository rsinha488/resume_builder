'use client';
import { COLOR_PALETTES, FONT_PAIRINGS } from '@/lib/themes';
import { FaLock, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRef } from 'react';
import {
    updateThemeColor,
    updateFontFamily,
    updateFontSize,
    updateLineSpacing,
    updateSectionSpacing,
    updateMargins
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
        margins
    } = useAppSelector((state) => state.resume);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleCustomColorClick = () => {
        if (userPlan === 'FREE') {
            onUpgrade();
            return;
        }
        colorInputRef.current?.click();
    };

    const isCustomColor = !COLOR_PALETTES.some(p => p.primary === themeColor);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            {/* Color Palettes */}
            <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Color Palette</h3>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                    {COLOR_PALETTES.map((palette) => {
                        const isLocked = palette.premium && userPlan === 'FREE';
                        const isSelected = themeColor === palette.primary;

                        return (
                            <button
                                key={palette.id}
                                onClick={() => !isLocked && dispatch(updateThemeColor(palette.primary))}
                                className={`relative group flex flex-col items-center gap-2 transition-all ${isLocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-110'}`}
                                title={palette.name}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: palette.primary }}
                                >
                                    {isSelected && <FaCheckCircle className="text-white drop-shadow-md" size={14} />}
                                    {isLocked && <FaLock className="text-white/80" size={12} />}
                                </div>
                                {isLocked && (
                                    <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] font-black text-white px-1 rounded uppercase tracking-tighter shadow-sm">
                                        Pro
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {/* Custom Color Picker */}
                    <div className="relative group flex flex-col items-center gap-2">
                        <button
                            onClick={handleCustomColorClick}
                            className={`w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center transition-all ${userPlan === 'FREE' ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 hover:border-primary-400 hover:bg-gray-50'
                                } ${isCustomColor ? 'border-primary-600 ring-2 ring-primary-100' : ''}`}
                            style={isCustomColor ? { backgroundColor: themeColor } : {}}
                            title="Custom Color"
                        >
                            {isCustomColor ? (
                                <FaCheckCircle className="text-white drop-shadow-md" size={14} />
                            ) : (
                                <FaPlus className="text-gray-400" size={12} />
                            )}
                            {userPlan === 'FREE' && <FaLock className="absolute text-gray-400/50" size={10} />}
                        </button>
                        <input
                            ref={colorInputRef}
                            type="color"
                            className="sr-only"
                            value={isCustomColor ? themeColor : '#2563eb'}
                            onChange={(e) => dispatch(updateThemeColor(e.target.value))}
                        />
                        {userPlan === 'FREE' && (
                            <span className="absolute -top-1 -right-1 bg-amber-400 text-[8px] font-black text-white px-1 rounded uppercase tracking-tighter shadow-sm">
                                Pro
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Font Pairings */}
            <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Typography</h3>
                <div className="space-y-3">
                    {FONT_PAIRINGS.map((pairing) => {
                        const isLocked = pairing.premium && userPlan === 'FREE';
                        const isSelected = fontFamily === pairing.heading;

                        return (
                            <button
                                key={pairing.id}
                                onClick={() => !isLocked && dispatch(updateFontFamily(pairing.heading))}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? 'border-primary-600 bg-primary-50/30'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                    } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-bold text-gray-900" style={{ fontFamily: pairing.heading }}>
                                        {pairing.name}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {pairing.heading.split(',')[0]} + {pairing.body.split(',')[0]}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isLocked && (
                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                                            <FaLock size={8} /> Pro
                                        </span>
                                    )}
                                    {isSelected && <FaCheckCircle className="text-primary-600" size={18} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Advanced Controls */}
            <div className="space-y-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Advanced Controls</h3>

                {/* Font Size */}
                <fieldset className="space-y-4">
                    <legend className="text-xs font-bold text-gray-500 uppercase tracking-widest">Font Size</legend>
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => dispatch(updateFontSize(size))}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${fontSize === size
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </fieldset>

                {/* Line Spacing */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="line-spacing" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Line Spacing</label>
                        <span className="text-xs font-black text-primary-600">{lineSpacing}x</span>
                    </div>
                    <input
                        id="line-spacing"
                        type="range"
                        min="1.0"
                        max="2.0"
                        step="0.05"
                        value={lineSpacing}
                        onChange={(e) => dispatch(updateLineSpacing(Number.parseFloat(e.target.value)))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                </div>

                {/* Section Spacing */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="section-spacing" className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            Section Spacing
                            {userPlan === 'FREE' && <FaLock className="text-amber-400" size={10} />}
                        </label>
                        <span className="text-xs font-black text-primary-600">{sectionSpacing}px</span>
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
                        className={`w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600 ${userPlan === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Margins */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="page-margins" className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            Page Margins
                            {userPlan === 'FREE' && <FaLock className="text-amber-400" size={10} />}
                        </label>
                        <span className="text-xs font-black text-primary-600">{margins}px</span>
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
                        className={`w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600 ${userPlan === 'FREE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </div>

            {/* Upgrade Prompt */}
            {userPlan === 'FREE' && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <h4 className="text-amber-900 font-black mb-2 flex items-center gap-2">
                        <FaLock className="text-amber-500" /> Unlock Premium Controls
                    </h4>
                    <p className="text-amber-800/70 text-sm font-medium mb-4">
                        Get access to all professional color palettes, font pairings, and advanced spacing controls.
                    </p>
                    <button
                        onClick={onUpgrade}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs"
                    >
                        Upgrade to Pro
                    </button>
                </div>
            )}
        </div>
    );
}
