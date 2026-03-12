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
        className="w-full h-full grid gap-px bg-[#0c1220] p-px rounded-lg"
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
                  label ? '' : 'bg-[#1a2332]'
                }`}
                style={label ? {
                  backgroundColor: label.color,
                  boxShadow: `0 0 8px ${label.color}59`,
                } : undefined}
                title={label ? `${hand} - ${label.name}` : hand}
              >
                {showHandNames && (
                  <span className="grid-hand-text font-bold text-white leading-none drop-shadow-sm">
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
