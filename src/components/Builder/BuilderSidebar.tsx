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
        <aside className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-4 border-r border-gray-800 z-20">
            <nav className="flex flex-col gap-4">
                {MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`group relative p-4 rounded-xl transition-all ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                {mode.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
