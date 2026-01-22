'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical, Pencil } from 'lucide-react';
import type { RangeData } from '../types/range';
import PokerGridPreview from './PokerGridPreview';
import { calculateTotalCombos, getHandCombos } from '../utils/pokerHands';

interface RangeCardProps {
  name: string;
  rangeData: RangeData;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onRename?: (newName: string) => void;
}

export default function RangeCard({ name, rangeData, onClick, onDelete, onRename }: RangeCardProps) {
  const displayName = rangeData.customName || name;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(displayName);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== displayName && onRename) {
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(displayName);
    }
  };
  const totalCombos = calculateTotalCombos(rangeData.hands);
  const frequency = ((totalCombos / 1326) * 100).toFixed(1);

  const comboCounts = new Map<string, number>();
  Object.entries(rangeData.hands).forEach(([hand, labelId]) => {
    const combos = getHandCombos(hand);
    comboCounts.set(labelId, (comboCounts.get(labelId) || 0) + combos);
  });

  const labelStats = rangeData.labels
    .map(label => ({
      label,
      count: comboCounts.get(label.id) || 0,
      percentage: ((comboCounts.get(label.id) || 0) / 1326) * 100,
    }))
    .filter(item => item.count > 0);

  const defaultLabel = rangeData.labels[0];

  return (
    <div 
      onClick={onClick}
      className="range-card flex-none snap-start gap-2 bg-[#1f2937] rounded-xl border border-slate-700 p-4 shadow-sm hover:border-[#3b82f6]/50 hover:shadow-md group/card relative flex flex-col cursor-pointer"
    >
      <div className="flex items-center gap-2 h-7">
        <div className="text-slate-500 cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical size={16} />
        </div>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value.slice(0, 12))}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            maxLength={12}
            className="flex-1 min-w-0 bg-transparent border-b border-[#3b82f6] text-white font-bold text-lg focus:outline-none h-7 leading-7"
          />
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0 group/title h-7">
            <h3 className="font-bold text-white text-lg truncate leading-7">{displayName}</h3>
            {onRename && (
              <button
                onClick={handleStartEdit}
                className="opacity-0 group-hover/title:opacity-100 size-5 flex items-center justify-center rounded text-slate-400 hover:text-[#3b82f6] transition-all shrink-0"
                aria-label="Edit range name"
              >
                <Pencil size={12} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <span className="text-xs font-mono-nums text-slate-300 shrink-0">{frequency}%</span>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(e); }}
            className="size-6 flex items-center justify-center rounded text-slate-400 hover:text-red-500 transition-colors shrink-0"
            aria-label="Delete range"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="aspect-square w-full rounded overflow-hidden">
        <PokerGridPreview labels={rangeData.labels} hands={rangeData.hands} showHandNames />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {labelStats.length > 0 ? (
            labelStats.map(({ label, percentage }) => (
              <div 
                key={label.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700/50"
              >
                <div 
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-[10px] font-medium text-slate-300 truncate max-w-[60px]">
                  {label.name}
                </span>
                <span className="text-[10px] font-mono-nums text-slate-300">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))
          ) : defaultLabel ? (
            <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700/50"
            >
              <div 
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: defaultLabel.color }}
              />
              <span className="text-[10px] font-medium text-slate-300 truncate max-w-[60px]">
                {defaultLabel.name}
              </span>
              <span className="text-[10px] font-mono-nums text-slate-300">
                0%
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
