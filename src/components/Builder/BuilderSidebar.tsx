'use client';
import { FaFileAlt, FaPalette, FaEdit, FaChartBar, FaCheck } from 'react-icons/fa';

interface BuilderSidebarProps {
    readonly currentMode: 'templates' | 'design' | 'content' | 'analysis' | 'finalize';
    readonly onModeChange: (mode: 'templates' | 'design' | 'content' | 'analysis' | 'finalize') => void;
}

const MODES = [
    { id: 'templates', icon: FaFileAlt, label: 'Templates' },
    { id: 'design', icon: FaPalette, label: 'Design' },
    { id: 'content', icon: FaEdit, label: 'Content' },
    { id: 'analysis', icon: FaChartBar, label: 'Analysis' },
    { id: 'finalize', icon: FaCheck, label: 'Finalize' },
] as const;

export default function BuilderSidebar({ currentMode, onModeChange }: BuilderSidebarProps) {
    return (
        <aside className="w-24 bg-surface-950 flex flex-col items-center py-10 gap-8 border-r border-white/5 z-20">
            {/* Logo placeholder/Small Logo */}
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-600/20 mb-4 animate-fade-in">
                R
            </div>

            <nav className="flex flex-col gap-6">
                {MODES.map((mode, i) => {
                    const Icon = mode.icon;
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`group relative p-4 rounded-2xl transition-all duration-300 animate-fade-in-up ${isActive
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30'
                                : 'text-surface-500 hover:text-white hover:bg-white/5'
                                }`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <Icon size={22} className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                            <span className="absolute left-full ml-5 px-3 py-1.5 bg-surface-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-50 transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl">
                                {mode.label}
                                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-surface-800 rotate-45 border-l border-b border-white/10" />
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
