'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    updateSections,
    toggleSectionVisibility,
    addCustomSection,
    removeCustomSection,
    SectionConfig
} from '@/lib/features/resume/resumeSlice';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    FaGripVertical, 
    FaEye, 
    FaEyeSlash, 
    FaTrash, 
    FaPlus, 
    FaEdit, 
    FaExclamationTriangle,
    FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface SortableItemProps {
    id: string;
    section: SectionConfig;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}

function SortableItem({ id, section, onToggle, onDelete, onEdit }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all duration-200 ${
                isDragging 
                ? 'shadow-2xl border-primary-500 ring-2 ring-primary-100 scale-[1.02] cursor-grabbing' 
                : 'border-surface-100 hover:border-surface-200 shadow-sm hover:shadow-md cursor-default'
            }`}
        >
            <button
                {...attributes}
                {...listeners}
                className="text-surface-300 hover:text-primary-500 cursor-grab active:cursor-grabbing p-1.5 transition-colors"
                aria-label="Drag to reorder"
            >
                <FaGripVertical size={18} />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-black uppercase tracking-widest truncate transition-colors ${
                        section.isVisible ? 'text-surface-900' : 'text-surface-400'
                    }`}>
                        {section.name}
                    </h4>
                    {section.type === 'custom' && (
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[8px] font-black uppercase tracking-widest rounded-full">
                            Custom
                        </span>
                    )}
                </div>
                {section.id === 'personal' && (
                    <p className="text-[10px] text-surface-400 font-medium">Required Core Section</p>
                )}
            </div>

            <div className="flex items-center gap-1">
                {section.type === 'custom' && onEdit && (
                    <button
                        onClick={() => onEdit(section.id)}
                        className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        title="Edit Custom Section"
                    >
                        <FaEdit size={14} />
                    </button>
                )}
                
                <button
                    onClick={() => onToggle(section.id)}
                    className={`p-2 rounded-xl transition-all ${
                        section.isVisible 
                        ? 'text-surface-400 hover:text-amber-600 hover:bg-amber-50' 
                        : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                    }`}
                    title={section.isVisible ? 'Hide Section' : 'Show Section'}
                >
                    {section.isVisible ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                </button>

                {section.id !== 'personal' && (
                    <button
                        onClick={() => onDelete(section.id)}
                        className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Section"
                    >
                        <FaTrash size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function SectionManager({ onEditCustom }: { onEditCustom?: (id: string) => void }) {
    const dispatch = useAppDispatch();
    const sections = useAppSelector((state) => state.resume.sections);
    const [isAdding, setIsAdding] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            const newOrder = arrayMove(sections, oldIndex, newIndex);
            dispatch(updateSections(newOrder));
            toast.success('Section order updated');
        }
    };

    const handleToggle = (id: string) => {
        dispatch(toggleSectionVisibility(id));
    };

    const handleDelete = (id: string) => {
        const section = sections.find(s => s.id === id);
        if (!section) return;

        if (section.id === 'personal') {
            toast.error('Personal Info cannot be deleted');
            return;
        }

        const confirmDelete = globalThis.confirm(
            `Are you sure you want to delete the "${section.name}" section? This will remove all associated data.`
        );

        if (confirmDelete) {
            if (section.type === 'custom') {
                dispatch(removeCustomSection(id));
            } else {
                dispatch(toggleSectionVisibility(id));
                toast.info('Default section hidden. Data remains available if you re-enable it.', { duration: 4000 });
            }
            toast.success('Section removed');
        }
    };

    const handleAddCustom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSectionTitle.trim()) return;

        const newId = `custom-${uuidv4()}`;
        dispatch(addCustomSection({
            id: newId,
            title: newSectionTitle,
            content: ''
        }));

        setNewSectionTitle('');
        setIsAdding(false);
        toast.success('Custom section added!');
        if (onEditCustom) onEditCustom(newId);
    };

    return (
        <div className="space-y-8 animate-fade-in pt-10 px-8 pb-32">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-surface-900 uppercase tracking-tight">Manage Sections</h2>
                <p className="text-sm text-surface-500 font-medium leading-relaxed">
                    Personalize your resume structure. Drag to reorder, toggle visibility, or add custom sections to stand out.
                </p>
            </div>

            <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-4 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-primary-600">
                    <FaInfoCircle size={18} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-primary-900 uppercase tracking-widest">Premium Tip</p>
                    <p className="text-[11px] text-primary-700 font-medium leading-relaxed" >
                        Keep your most impressive sections (like Work Experience) near the top to catch the recruiter's eye instantly.
                    </p>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-3">
                    <SortableContext
                        items={sections.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sections.map((section) => (
                            <SortableItem
                                key={section.id}
                                id={section.id}
                                section={section}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={onEditCustom}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {isAdding ? (
                <form onSubmit={handleAddCustom} className="bg-white p-6 rounded-2xl border-2 border-primary-200 shadow-xl space-y-4 animate-scale-in">
                    <div className="space-y-2">
                        <label htmlFor="custom-section-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Section Title</label>
                        <input
                            id="custom-section-title"
                            autoFocus
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="e.g., Volunteer Work, Publications..."
                            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-bold transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                        >
                            Create Section
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-3 border border-surface-200 text-surface-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-surface-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-6 border-2 border-dashed border-surface-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-surface-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                        <FaPlus size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Custom Section</span>
                </button>
            )}

            <div className="pt-8 mt-12 border-t border-surface-100 flex items-start sm:items-center gap-3 text-amber-600 bg-amber-50/30 p-4 rounded-xl">
                <FaExclamationTriangle size={16} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-[11px] sm:text-xs font-bold leading-relaxed">
                    <span className="uppercase tracking-wider mr-1">Note:</span> 
                    Deleting a custom section permanently removes its content. Default sections can be hidden and re-enabled later.
                </p>
            </div>
        </div>
    );
}
