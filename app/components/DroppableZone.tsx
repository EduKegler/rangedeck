'use client';

import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

function DroppableZone({ id, children, className = '' }: DroppableZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={className} data-is-over={isOver}>
      {children}
    </div>
  );
}

export default memo(DroppableZone);
