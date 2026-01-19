'use client';

import { memo, useCallback, useState, useRef } from 'react';
import { RANKS, getHandAtPosition } from '../utils/pokerHands';
import type { Label } from '../types/range';

interface PokerGridProps {
  labels: Label[];
  hands: { [hand: string]: string };
  activeLabelId: string | null;
  onPaintHand: (hand: string, isFirstClick: boolean) => void;
  onPaintEnd: () => void;
}

const PokerGrid = memo(({ labels, hands, activeLabelId, onPaintHand, onPaintEnd }: PokerGridProps) => {
  const [isPainting, setIsPainting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const getLabelById = useCallback((labelId: string): Label | undefined => {
    return labels.find(l => l.id === labelId);
  }, [labels]);

  const handleMouseDown = useCallback((hand: string) => {
    if (activeLabelId) {
      setIsPainting(true);
      onPaintHand(hand, true); // First click
    }
  }, [activeLabelId, onPaintHand]);

  const handleMouseEnter = useCallback((hand: string) => {
    if (isPainting && activeLabelId) {
      onPaintHand(hand, false); // Subsequent tiles
    }
  }, [isPainting, activeLabelId, onPaintHand]);

  const handleMouseUp = useCallback(() => {
    setIsPainting(false);
    onPaintEnd();
  }, [onPaintEnd]);

  const handleMouseLeave = useCallback(() => {
    setIsPainting(false);
    onPaintEnd();
  }, [onPaintEnd]);

  const getCellStyle = useCallback((hand: string) => {
    const labelId = hands[hand];
    if (labelId) {
      const label = getLabelById(labelId);
      if (label) {
        return {
          backgroundColor: label.color,
          color: '#fff',
        };
      }
    }
    return {
      backgroundColor: '#374151',
      color: '#d1d5db',
    };
  }, [hands, getLabelById]);

  const getCellLabel = useCallback((hand: string) => {
    const labelId = hands[hand];
    if (labelId) {
      const label = getLabelById(labelId);
      return label?.name;
    }
    return null;
  }, [hands, getLabelById]);

  return (
    <div
      className={`flex justify-center p-5 select-none ${activeLabelId ? 'cursor-pointer' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gridRef}
        className="inline-block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md"
        onMouseUp={handleMouseUp}
      >
        {RANKS.map((_, rowIdx) => (
          <div key={rowIdx} className="flex">
            {RANKS.map((_, colIdx) => {
              const hand = getHandAtPosition(rowIdx, colIdx);
              const cellLabel = getCellLabel(hand);

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  className={`w-[45px] h-[45px] border-[0.5px] border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-1 transition-all ${
                    activeLabelId ? 'cursor-pointer hover:opacity-80 hover:scale-110' : ''
                  } focus:outline-none focus-visible:outline-none`}
                  style={getCellStyle(hand)}
                  onMouseDown={() => handleMouseDown(hand)}
                  onMouseEnter={() => handleMouseEnter(hand)}
                  title={cellLabel || hand}
                >
                  <span className="text-xs font-semibold leading-none">{hand}</span>
                  {cellLabel && (
                    <span className="text-[8px] font-medium leading-none mt-0.5 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {cellLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

export default PokerGrid;
