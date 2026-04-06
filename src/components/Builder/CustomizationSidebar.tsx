'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateThemeColor, updateFontFamily } from '@/lib/features/resume/resumeSlice';
import { FaPalette, FaFont } from 'react-icons/fa';

const COLORS = [
    '#2563eb', '#1a365d', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#4b5563', '#000000'
];

const FONTS = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Lora', value: 'Lora, serif' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
];

export default function CustomizationSidebar() {
    const dispatch = useAppDispatch();
    const { themeColor, fontFamily } = useAppSelector((state) => state.resume);

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Color Picker */}
            <section>
                <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <FaPalette className="text-primary-500" /> Theme Palette
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => dispatch(updateThemeColor(color))}
                            className={`w-10 h-10 rounded-xl transition-all duration-300 relative group ${themeColor === color 
                                ? 'scale-110 ring-2 ring-primary-500 ring-offset-4 ring-offset-white shadow-lg shadow-primary-500/20' 
                                : 'hover:scale-105'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        >
                            {themeColor === color && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Font Picker */}
            <section>
                <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <FaFont className="text-primary-500" /> Typography
                </h3>
                <div className="space-y-3">
                    {FONTS.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => dispatch(updateFontFamily(font.value))}
                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 group ${fontFamily === font.value
                                    ? 'border-primary-500 bg-primary-50/50 text-surface-900 shadow-sm'
                                    : 'border-surface-100 hover:border-surface-200 text-surface-500 hover:text-surface-700 bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`${fontFamily === font.value ? 'font-black' : 'font-medium'}`} style={{ fontFamily: font.value }}>
                                    {font.name}
                                </span>
                                {fontFamily === font.value && (
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
