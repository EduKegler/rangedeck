'use client';

import { Trash2 } from 'lucide-react';
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

  const defaultLabel = rangeData.labels[0];

  return (
    <div 
      onClick={onClick}
      className="range-card flex-none snap-start gap-2 bg-[#1f2937] rounded-xl border border-slate-700 p-4 shadow-sm hover:border-[#3b82f6]/50 hover:shadow-md group/card relative flex flex-col cursor-pointer"
    >
      <div className="flex items-center gap-2">
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
                <span className="text-[10px] font-mono-nums text-slate-500">
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
              <span className="text-[10px] font-mono-nums text-slate-500">
                0%
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
