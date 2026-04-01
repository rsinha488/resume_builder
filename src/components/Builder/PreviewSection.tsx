'use client';
import { ReactNode } from 'react';
import { FaEdit } from 'react-icons/fa';

interface PreviewSectionProps {
    readonly children: ReactNode;
    readonly sectionId: string;
    readonly onClick?: (sectionId: string) => void;
    readonly title?: string;
}

export default function PreviewSection({ children, sectionId, onClick, title }: PreviewSectionProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(sectionId);
        }
    };

    return (
        <div 
            className="group relative cursor-pointer outline-none transition-all duration-300"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(sectionId);
            }}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Edit ${title || 'Section'}`}
        >
            <div className="rounded-lg transition-all duration-300 group-hover:ring-2 group-hover:ring-primary-400 group-hover:bg-primary-50/10">
                {children}
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 border-2 border-white/20 uppercase tracking-widest">
                        <FaEdit size={12} /> Edit {title || 'Section'}
                    </div>
                </div>
            </div>
        </div>
    );
}
