'use client';

import { useState, useRef, useCallback } from 'react';
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
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

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
          boxShadow: `0 0 10px ${label.color}4D`,
        };
      }
    }
    return {};
  };

  const isColored = (hand: string) => {
    return !!hands[hand];
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
    let newRow = rowIdx;
    let newCol = colIdx;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, rowIdx - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(12, rowIdx + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, colIdx - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(12, colIdx + 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeLabelId) {
          const hand = getHandAtPosition(rowIdx, colIdx);
          onPaintHand(hand, true);
          onPaintEnd();
        }
        return;
      default:
        return;
    }

    if (newRow !== rowIdx || newCol !== colIdx) {
      setFocusedCell({ row: newRow, col: newCol });
      const cellKey = `${newRow}-${newCol}`;
      const cell = cellRefs.current.get(cellKey);
      if (cell) {
        cell.focus();
      }
    }
  }, [activeLabelId, onPaintHand, onPaintEnd]);

  const getActiveLabelName = () => {
    if (!activeLabelId) return '';
    const label = labels.find(l => l.id === activeLabelId);
    return label ? label.name : '';
  };

  return (
    <div
      className={`select-none ${activeLabelId ? 'cursor-pointer' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gridRef}
        role="grid"
        aria-label={`Poker hand range grid. ${activeLabelId ? `Paint with ${getActiveLabelName()}. Use arrow keys to navigate, Space or Enter to select.` : 'Select a label to start painting.'}`}
        aria-rowcount={13}
        aria-colcount={13}
        className="aspect-square w-full grid gap-[3px] bg-[#080d18] p-1.5 rounded-xl border border-blue-500/8 shadow-2xl"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
        onMouseUp={handleMouseUp}
      >
        {RANKS.map((_, rowIdx) =>
          RANKS.map((_, colIdx) => {
            const hand = getHandAtPosition(rowIdx, colIdx);
            const colored = isColored(hand);
            const labelId = hands[hand];
            const label = labelId ? getLabelById(labelId) : null;
            const cellKey = `${rowIdx}-${colIdx}`;

            return (
              <button
                key={cellKey}
                ref={(el) => {
                  if (el) {
                    cellRefs.current.set(cellKey, el);
                  } else {
                    cellRefs.current.delete(cellKey);
                  }
                }}
                role="gridcell"
                aria-label={`${hand} poker hand${colored && label ? `, painted with ${label.name}` : ''}`}
                aria-pressed={colored}
                aria-rowindex={rowIdx + 1}
                aria-colindex={colIdx + 1}
                tabIndex={rowIdx === 0 && colIdx === 0 ? 0 : -1}
                className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs md:text-sm rounded-[3px] transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#080d18] focus:z-10 ${
                  colored
                    ? 'text-white grid-text'
                    : 'bg-[#1a2332] text-slate-300 hover:bg-slate-600'
                } ${activeLabelId ? 'cursor-pointer hover:scale-105 hover:brightness-115' : ''}`}
                style={getCellStyle(hand)}
                onMouseDown={() => handleMouseDown(hand)}
                onMouseEnter={() => handleMouseEnter(hand)}
                onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                onFocus={() => setFocusedCell({ row: rowIdx, col: colIdx })}
              >
                {hand}
              </button>
            );
          })
        )}
      </div>
      {activeLabelId && (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {focusedCell && `Currently on ${getHandAtPosition(focusedCell.row, focusedCell.col)}. Press Space or Enter to paint with ${getActiveLabelName()}.`}
        </div>
      )}
    </div>
  );
}
