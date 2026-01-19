'use client';

import { useState, useRef } from 'react';
import { RANKS, getHandAtPosition } from '../utils/pokerHands';
import type { Label } from '../types/range';

interface PokerGridProps {
  labels: Label[];
  hands: { [hand: string]: string };
  activeLabelId: string | null;
  onPaintHand: (hand: string, isFirstClick: boolean) => void;
  onPaintEnd: () => void;
}

export default function PokerGrid({ labels, hands, activeLabelId, onPaintHand, onPaintEnd }: PokerGridProps) {
  const [isPainting, setIsPainting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const getLabelById = (labelId: string): Label | undefined => {
    return labels.find(l => l.id === labelId);
  };

  const handleMouseDown = (hand: string) => {
    if (activeLabelId) {
      setIsPainting(true);
      onPaintHand(hand, true);
    }
  };

  const handleMouseEnter = (hand: string) => {
    if (isPainting && activeLabelId) {
      onPaintHand(hand, false);
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
    onPaintEnd();
  };

  const handleMouseLeave = () => {
    setIsPainting(false);
    onPaintEnd();
  };

  const getCellStyle = (hand: string): React.CSSProperties => {
    const labelId = hands[hand];
    if (labelId) {
      const label = getLabelById(labelId);
      if (label) {
        return {
          backgroundColor: label.color,
        };
      }
    }
    return {};
  };

  const isColored = (hand: string) => {
    return !!hands[hand];
  };

  return (
    <div
      className={`select-none ${activeLabelId ? 'cursor-pointer' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gridRef}
        className="aspect-square w-full grid gap-[3px] bg-[#162030] p-1.5 rounded-md border border-[#223149] shadow-2xl"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
        onMouseUp={handleMouseUp}
      >
        {RANKS.map((_, rowIdx) => 
          RANKS.map((_, colIdx) => {
            const hand = getHandAtPosition(rowIdx, colIdx);
            const colored = isColored(hand);

            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs md:text-sm rounded-[2px] transition-all focus:outline-none ${
                  colored
                    ? 'text-white grid-text'
                    : 'bg-[#343e4f] text-slate-300 hover:bg-slate-600'
                } ${activeLabelId ? 'cursor-pointer hover:scale-105' : ''}`}
                style={getCellStyle(hand)}
                onMouseDown={() => handleMouseDown(hand)}
                onMouseEnter={() => handleMouseEnter(hand)}
                title={hand}
              >
                {hand}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
