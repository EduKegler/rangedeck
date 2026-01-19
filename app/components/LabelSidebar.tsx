'use client';

import { useState, useRef } from 'react';
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { Label } from '../types/range';

interface LabelSidebarProps {
  labels: Label[];
  activeLabelId: string | null;
  onSelectLabel: (labelId: string | null) => void;
  onCreateLabel: () => void;
  onEditLabel: (label: Label) => void;
  onDeleteLabel: (labelId: string) => void;
  onMoveLabel: (labelId: string, direction: 'up' | 'down') => void;
  handCounts: { [labelId: string]: number };
}

export default function LabelSidebar({
  labels,
  activeLabelId,
  onSelectLabel,
  onCreateLabel,
  onEditLabel,
  onDeleteLabel,
  onMoveLabel,
  handCounts,
}: LabelSidebarProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const totalHands = Object.values(handCounts).reduce((sum, count) => sum + count, 0);

  const handleLabelClick = (labelId: string) => {
    onSelectLabel(labelId);
  };

  const handleDeleteLabel = (labelId: string) => {
    if (labels.length === 1) {
      alert('Cannot delete the last label. At least one label must exist.');
      return;
    }
    if (confirm('Delete this label? All hands with this label will be cleared.')) {
      onDeleteLabel(labelId);
    }
  };

  const handleEditLabel = (label: Label) => {
    onEditLabel(label);
  };

  const getPercentage = (labelId: string) => {
    const count = handCounts[labelId] || 0;
    if (totalHands === 0) return 0;
    return Math.round((count / totalHands) * 100);
  };

  const handleDragStart = (e: React.DragEvent, labelId: string) => {
    setDraggedId(labelId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', labelId);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent, labelId: string) => {
    e.preventDefault();
    dragCounter.current++;
    if (labelId !== draggedId) {
      setDragOverId(labelId);
    }
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (sourceId && sourceId !== targetId) {
      const sourceIndex = labels.findIndex(l => l.id === sourceId);
      const targetIndex = labels.findIndex(l => l.id === targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        if (sourceIndex < targetIndex) {
          for (let i = sourceIndex; i < targetIndex; i++) {
            onMoveLabel(sourceId, 'down');
          }
        } else {
          for (let i = sourceIndex; i > targetIndex; i--) {
            onMoveLabel(sourceId, 'up');
          }
        }
      }
    }
    
    setDraggedId(null);
    setDragOverId(null);
    dragCounter.current = 0;
  };

  return (
    <aside className="w-80 shrink-0 border-r border-[#223149] bg-[#162030] flex flex-col z-0 max-lg:w-64 max-md:hidden">
      <div className="p-4 border-b border-[#223149]">
        <button
          onClick={onCreateLabel}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-11 bg-[#3b82f6] hover:bg-blue-600 transition-colors text-white text-sm font-bold tracking-wide shadow-lg shadow-blue-900/30"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Label
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-[#90a7cb] uppercase tracking-wider">
          Strategy Actions
        </p>
        
        {labels.map((label) => {
          const isActive = activeLabelId === label.id;
          const count = handCounts[label.id] || 0;
          const percentage = getPercentage(label.id);
          const isDragging = draggedId === label.id;
          const isDragOver = dragOverId === label.id;
          
          return (
            <div
              key={label.id}
              draggable
              onDragStart={(e) => handleDragStart(e, label.id)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => handleDragEnter(e, label.id)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, label.id)}
              onClick={() => handleLabelClick(label.id)}
              className={`group flex items-center gap-2 px-2 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all border ${
                isDragging 
                  ? 'opacity-50 scale-95' 
                  : isDragOver 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : isActive 
                      ? 'bg-[#223149]/60 border-[#223149]' 
                      : 'bg-transparent border-transparent hover:bg-[#223149]/40 hover:border-[#223149]'
              } ${count === 0 && !isDragging ? 'opacity-60 hover:opacity-100' : ''}`}
            >
              <GripVertical 
                size={16} 
                className="text-[#90a7cb]/50 group-hover:text-[#90a7cb] transition-colors shrink-0" 
              />
              
              <div 
                className="size-4 rounded-full shrink-0"
                style={{ 
                  backgroundColor: label.color,
                  boxShadow: count > 0 ? `0 0 8px ${label.color}66` : 'none'
                }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-white text-sm font-medium truncate">
                    {label.name}
                  </p>
                  <span className={`text-[10px] font-mono-nums ${isActive ? 'text-[#3b82f6] font-bold' : 'text-[#90a7cb]'}`}>
                    {percentage}%
                  </span>
                </div>
                
                {count > 0 && (
                  <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: label.color,
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                )}
                
                {count === 0 && (
                  <p className="text-[10px] text-[#90a7cb]">No hands</p>
                )}
              </div>

              <div className="h-6 w-px bg-[#223149] mx-1" />

              <div className="flex gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditLabel(label); }}
                  className="text-[#90a7cb] hover:text-white p-1.5 rounded hover:bg-white/10"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteLabel(label.id); }}
                  disabled={labels.length === 1}
                  className="text-[#90a7cb] hover:text-red-400 p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={labels.length === 1 ? "Cannot delete last label" : "Delete"}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {labels.length === 0 && (
          <div className="text-center py-10 px-5 text-[#90a7cb]">
            <p className="mb-2">No labels yet</p>
            <p className="text-sm italic">Create a label to start</p>
          </div>
        )}
      </div>
    </aside>
  );
}
