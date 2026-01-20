'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';

interface SortableCategoryProps {
  id: string;
  name: string;
  rangeCount: number;
  hasRanges: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddRange: () => void;
  children: React.ReactNode;
}

function SortableCategory({
  id,
  name,
  rangeCount,
  hasRanges,
  onEdit,
  onDelete,
  onAddRange,
  children,
}: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ 
    id,
    transition: {
      duration: 300,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    willChange: 'transform',
  };

  return (
    <section 
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-2 transition-all rounded-lg ${
        isDragging ? 'ring-2 ring-[#3b82f6] bg-slate-900/50' : ''
      } ${isOver && !isDragging ? 'ring-2 ring-[#3b82f6]/50 ring-offset-2 ring-offset-[#111827]' : ''}`}
    >
      <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors -ml-2">
        <div className="flex items-center gap-3">
          <button
            className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none"
            title="Drag to reorder category"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={20} />
          </button>
          <h2 className="text-lg font-bold text-slate-100">{name}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="size-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Rename category"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={onDelete}
              disabled={hasRanges}
              className={`size-7 flex items-center justify-center rounded transition-colors ${
                hasRanges 
                  ? 'text-slate-700 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-red-500 hover:bg-slate-800'
              }`}
              title={hasRanges ? "Delete category (Remove ranges first)" : "Delete category"}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-medium text-slate-400 font-mono-nums">
            {rangeCount} Ranges
          </span>
        </div>
        <button
          onClick={onAddRange}
          className="flex items-center gap-1 text-[#3b82f6] hover:text-blue-400 text-sm font-bold transition-colors"
        >
          <PlusCircle size={18} />
          Add Range
        </button>
      </div>

      {children}
    </section>
  );
}

export default memo(SortableCategory);
