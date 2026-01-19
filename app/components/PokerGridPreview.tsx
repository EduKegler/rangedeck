'use client';

import { memo, useCallback } from 'react';
import { RANKS, getHandAtPosition } from '../utils/pokerHands';
import type { Label } from '../types/range';

interface PokerGridPreviewProps {
  labels: Label[];
  hands: { [hand: string]: string };
}

const PokerGridPreview = memo(({ labels, hands }: PokerGridPreviewProps) => {
  const getLabelById = useCallback((labelId: string): Label | undefined => {
    return labels.find(l => l.id === labelId);
  }, [labels]);

  return (
    <div className="w-full flex justify-center mt-3">
      <div className="inline-block border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
        {RANKS.map((_, rowIdx) => (
          <div key={rowIdx} className="flex">
            {RANKS.map((_, colIdx) => {
              const hand = getHandAtPosition(rowIdx, colIdx);
              const labelId = hands[hand];
              const label = labelId ? getLabelById(labelId) : undefined;

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className="w-[26px] h-[26px] border border-gray-600 flex items-center justify-center text-[9px] font-semibold transition-transform hover:scale-150 hover:z-10"
                  style={{
                    backgroundColor: label?.color || '#374151',
                    color: label ? '#fff' : '#d1d5db',
                  }}
                  title={label ? `${hand} - ${label.name}` : hand}
                >
                  {hand}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

export default PokerGridPreview;
