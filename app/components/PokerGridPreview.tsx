'use client';

import { RANKS, getHandAtPosition } from '../utils/pokerHands';
import type { Label } from '../types/range';

interface PokerGridPreviewProps {
  labels: Label[];
  hands: { [hand: string]: string };
  showHandNames?: boolean;
}

export default function PokerGridPreview({ labels, hands, showHandNames = false }: PokerGridPreviewProps) {
  const getLabelById = (labelId: string): Label | undefined => {
    return labels.find(l => l.id === labelId);
  };

  return (
    <div className="w-full h-full">
      <div 
        className="w-full h-full grid gap-px bg-[#1e293b] p-px"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
      >
        {RANKS.map((_, rowIdx) =>
          RANKS.map((_, colIdx) => {
            const hand = getHandAtPosition(rowIdx, colIdx);
            const labelId = hands[hand];
            const label = labelId ? getLabelById(labelId) : undefined;

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`aspect-square flex items-center justify-center ${
                  label ? '' : 'bg-[#334155]'
                }`}
                style={label ? { backgroundColor: label.color } : undefined}
                title={label ? `${hand} - ${label.name}` : hand}
              >
                {showHandNames && (
                  <span className="text-[10px] sm:text-[11px] font-bold text-white grid-text leading-none drop-shadow-sm">
                    {hand}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
