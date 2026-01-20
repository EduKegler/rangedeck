'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RangeCard from './RangeCard';
import type { RangeData } from '../types/range';

interface SortableRangeCardProps {
  id: string;
  name: string;
  rangeData: RangeData;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onRename?: (newName: string) => void;
}

function SortableRangeCard({
  id,
  name,
  rangeData,
  onClick,
  onDelete,
  onRename,
}: SortableRangeCardProps) {
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
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.4 : 1,
    scale: isDragging ? 0.98 : isOver ? 1.02 : 1,
    zIndex: isDragging ? 50 : isOver ? 10 : 1,
    willChange: 'transform',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-none snap-start touch-none rounded-xl transition-shadow ${
        isDragging 
          ? 'shadow-2xl ring-2 ring-[#3b82f6] cursor-grabbing' 
          : isOver 
            ? 'shadow-lg ring-2 ring-[#3b82f6]/50' 
            : 'cursor-grab'
      }`}
      {...attributes}
      {...listeners}
    >
      <RangeCard
        name={name}
        rangeData={rangeData}
        onClick={onClick}
        onDelete={onDelete}
        onRename={onRename}
      />
    </div>
  );
}

export default memo(SortableRangeCard);
