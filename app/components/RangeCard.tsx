'use client';

import { Trash2, GripHorizontal } from 'lucide-react';
import type { RangeData } from '../types/range';
import PokerGridPreview from './PokerGridPreview';

interface RangeCardProps {
  name: string;
  rangeData: RangeData;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function RangeCard({ name, rangeData, onClick, onDelete }: RangeCardProps) {
  const displayName = rangeData.customName || name;
  const handCount = Object.keys(rangeData.hands).length;
  const frequency = ((handCount / 169) * 100).toFixed(1);

  const counts = new Map<string, number>();
  Object.values(rangeData.hands).forEach(labelId => {
    counts.set(labelId, (counts.get(labelId) || 0) + 1);
  });

  const labelStats = rangeData.labels
    .map(label => ({
      label,
      count: counts.get(label.id) || 0,
      percentage: ((counts.get(label.id) || 0) / 169) * 100,
    }))
    .filter(item => item.count > 0);

  const restPercentage = 100 - labelStats.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <div 
      onClick={onClick}
      className="flex-none snap-start w-[400px] gap-2 bg-[#1f2937] rounded-xl border border-slate-700 p-4 shadow-sm hover:border-[#3b82f6]/50 hover:shadow-md transition-all group/card relative flex flex-col cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-white truncate flex-1">{displayName}</h3>
        <span className="text-xs font-mono-nums text-slate-400 shrink-0">{frequency}%</span>
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(e); }}
            className="size-6 flex items-center justify-center rounded text-slate-500 hover:text-red-500 transition-colors shrink-0"
            title="Delete Range"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Grid Preview */}
      <div className="aspect-square w-full rounded overflow-hidden">
        <PokerGridPreview labels={rangeData.labels} hands={rangeData.hands} showHandNames />
      </div>

      {/* Stats */}
      <div className="mt-auto flex flex-col gap-3">
        {labelStats.length > 0 && (
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
              {labelStats.slice(0, 3).map(({ label }) => (
                <span key={label.id}>{label.name}</span>
              ))}
              {restPercentage > 0 && <span>-</span>}
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-700">
              {labelStats.slice(0, 3).map(({ label, percentage }) => (
                <div 
                  key={label.id}
                  style={{ 
                    backgroundColor: label.color,
                    width: `${percentage}%`
                  }}
                />
              ))}
              {restPercentage > 0 && (
                <div 
                  className="bg-slate-600/50"
                  style={{ width: `${restPercentage}%` }}
                />
              )}
            </div>
          </div>
        )}

        {labelStats.length === 0 && (
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
              <span>-</span>
              <span>-</span>
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-700">
              <div className="bg-slate-600/50 w-full" />
            </div>
          </div>
        )}

        {/* Drag Handle */}
        <div className="flex items-center justify-center pt-2 border-t border-slate-700/50 cursor-grab active:cursor-grabbing group/handle">
          <GripHorizontal size={20} className="text-slate-600 group-hover/handle:text-[#3b82f6] transition-colors" />
        </div>
      </div>
    </div>
  );
}
