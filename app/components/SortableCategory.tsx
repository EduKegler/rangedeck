'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import Button from './button';

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
        isDragging ? 'ring-2 ring-[#3b82f6] bg-[#0c1220]/50' : ''
      } ${isOver && !isDragging ? 'ring-2 ring-[#3b82f6]/50 ring-offset-2 ring-offset-[#0c1220]' : ''}`}
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
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              onClick={onEdit}
              className="text-slate-400 hover:text-white hover:bg-white/10"
              title="Rename category"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              onClick={onDelete}
              disabled={hasRanges}
              className={hasRanges ? 'text-slate-700' : 'text-slate-400 hover:text-red-500 hover:bg-white/5'}
              title={hasRanges ? "Delete category (Remove ranges first)" : "Delete category"}
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs font-medium text-slate-300 font-mono-nums">
            {rangeCount} Ranges
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRange}
          className="text-[#3b82f6] hover:text-blue-400 font-bold"
        >
          <PlusCircle size={18} />
          Add Range
        </Button>
      </div>

      {children}
    </section>
  );
}

export default memo(SortableCategory);
