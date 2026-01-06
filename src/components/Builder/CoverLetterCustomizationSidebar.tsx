'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateThemeColor, updateFontFamily } from '@/lib/features/coverLetter/coverLetterSlice';
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

export default function CoverLetterCustomizationSidebar() {
    const dispatch = useAppDispatch();
    const { themeColor, fontFamily } = useAppSelector((state) => state.coverLetter);

    return (
        <div className="space-y-8">
            {/* Color Picker */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaPalette className="text-primary-600" /> Theme Color
                </h3>
                <div className="grid grid-cols-4 gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => dispatch(updateThemeColor(color))}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${themeColor === color ? 'border-primary-600 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </section>

            {/* Font Picker */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaFont className="text-primary-600" /> Typography
                </h3>
                <div className="space-y-2">
                    {FONTS.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => dispatch(updateFontFamily(font.value))}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${fontFamily === font.value
                                ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold'
                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                }`}
                            style={{ fontFamily: font.value }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
