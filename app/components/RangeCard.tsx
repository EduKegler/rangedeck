'use client';

import { memo, useMemo } from 'react';
import type { RangeData } from '../types/range';
import PokerGridPreview from './PokerGridPreview';

interface RangeCardProps {
  name: string;
  rangeData: RangeData;
  onClick: () => void;
}

const RangeCard = memo(({ name, rangeData, onClick }: RangeCardProps) => {
  const displayName = rangeData.customName || name;
  const handCount = useMemo(() => {
    return Object.keys(rangeData.hands).length;
  }, [rangeData.hands]);

  const labelStats = useMemo(() => {
    const counts = new Map<string, number>();

    Object.values(rangeData.hands).forEach(labelId => {
      counts.set(labelId, (counts.get(labelId) || 0) + 1);
    });

    return rangeData.labels
      .map(label => ({
        label,
        count: counts.get(label.id) || 0,
      }))
      .filter(item => item.count > 0)
      .slice(0, 5);
  }, [rangeData]);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer transition-all hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 text-left flex flex-col gap-1.5"
    >
      <div className="flex justify-between items-center gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 flex-1">{displayName}</h3>
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{handCount} hands</span>
      </div>

      <PokerGridPreview labels={rangeData.labels} hands={rangeData.hands} />

      {labelStats.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labelStats.map(({ label, count }) => (
            <div key={label.id} className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{label.name}</span>
              <span className="text-gray-500 dark:text-gray-500 text-[11px]">({count})</span>
            </div>
          ))}
        </div>
      )}

      {labelStats.length === 0 && (
        <div className="text-gray-400 dark:text-gray-500 text-sm italic">
          No actions defined
        </div>
      )}
    </button>
  );
});

export default RangeCard;
