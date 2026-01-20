'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { ArrowLeft, Pencil, Check, X, Undo2, Redo2 } from 'lucide-react';
import PokerGrid from './PokerGrid';
import LabelSidebar from './LabelSidebar';
import LabelModal from './LabelModal';
import { useRangesStore } from '../stores/rangesStore';
import type { Label } from '../types/range';

interface RangeEditorProps {
  rangeId: string;
}

type HandsState = { [hand: string]: string };

export default function RangeEditor({ rangeId }: RangeEditorProps) {
  const router = useRouter();
  
  const hasHydrated = useRangesStore((state) => state._hasHydrated);
  const ranges = useRangesStore((state) => state.ranges);
  const rangeDefinitions = useRangesStore((state) => state.rangeDefinitions);
  const ensureRangeHasLabel = useRangesStore((state) => state.ensureRangeHasLabel);
  const createLabel = useRangesStore((state) => state.createLabel);
  const updateLabel = useRangesStore((state) => state.updateLabel);
  const deleteLabel = useRangesStore((state) => state.deleteLabel);
  const setHandLabel = useRangesStore((state) => state.setHandLabel);
  const setRangeName = useRangesStore((state) => state.setRangeName);
  const reorderLabel = useRangesStore((state) => state.reorderLabel);

  const rangeData = ranges[rangeId] || { labels: [], hands: {}, customName: undefined };
  const rangeDef = (rangeDefinitions || []).find(r => r.id === rangeId);
  const defaultName = rangeDef?.name || rangeId;
  const rangeName = rangeData.customName || defaultName;

  const [activeLabelId, setActiveLabelId] = useState<string | null>(null);
  const [paintMode, setPaintMode] = useState<'paint' | 'erase' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | undefined>(undefined);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(rangeName);

  // Undo/Redo state - block-based (saves state per paint action, not per cell)
  const [history, setHistory] = useState<HandsState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const stateBeforePaintRef = useRef<HandsState | null>(null);
  const isUndoRedoAction = useRef(false);
  const hasInitialized = useRef(false);

  // Initialize history with current state on mount
  useEffect(() => {
    if (hasHydrated && !hasInitialized.current) {
      hasInitialized.current = true;
      setHistory([{ ...rangeData.hands }]);
      setHistoryIndex(0);
    }
  }, [hasHydrated, rangeData.hands]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save state before starting a paint action
  const saveStateBeforePaint = useCallback(() => {
    if (!isUndoRedoAction.current) {
      stateBeforePaintRef.current = { ...rangeData.hands };
    }
  }, [rangeData.hands]);

  // Save state after finishing a paint action (called from handlePaintEnd)
  const saveStateAfterPaint = useCallback(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    const stateBefore = stateBeforePaintRef.current;
    const stateAfter = rangeData.hands;

    // Only save if state actually changed
    if (stateBefore && JSON.stringify(stateBefore) !== JSON.stringify(stateAfter)) {
      setHistory(prev => {
        // If we're not at the end of history, remove future states
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ ...stateAfter });
        
        // Limit history to 50 states
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }

    stateBeforePaintRef.current = null;
  }, [rangeData.hands, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      
      // Apply the previous state
      const currentHands = rangeData.hands;
      const handsToRemove = Object.keys(currentHands).filter(h => !previousState[h]);
      const handsToAdd = Object.entries(previousState);
      
      // Remove hands that shouldn't exist
      for (const hand of handsToRemove) {
        setHandLabel(rangeId, hand, null);
      }
      
      // Add/update hands
      for (const [hand, labelId] of handsToAdd) {
        if (currentHands[hand] !== labelId) {
          setHandLabel(rangeId, hand, labelId);
        }
      }
      
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, rangeData.hands, rangeId, setHandLabel]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      // Apply the next state
      const currentHands = rangeData.hands;
      const handsToRemove = Object.keys(currentHands).filter(h => !nextState[h]);
      const handsToAdd = Object.entries(nextState);
      
      // Remove hands that shouldn't exist
      for (const hand of handsToRemove) {
        setHandLabel(rangeId, hand, null);
      }
      
      // Add/update hands
      for (const [hand, labelId] of handsToAdd) {
        if (currentHands[hand] !== labelId) {
          setHandLabel(rangeId, hand, labelId);
        }
      }
      
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, rangeData.hands, rangeId, setHandLabel]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    if (hasHydrated) {
      ensureRangeHasLabel(rangeId);
    }
  }, [hasHydrated, rangeId, ensureRangeHasLabel]);

  useEffect(() => {
    if (rangeData.labels.length > 0) {
      const selectedLabelExists = activeLabelId && rangeData.labels.some(l => l.id === activeLabelId);
      if (!activeLabelId || !selectedLabelExists) {
        setActiveLabelId(rangeData.labels[0].id);
      }
    }
  }, [rangeData.labels, activeLabelId]);

  const handCounts: { [labelId: string]: number } = {};
  Object.values(rangeData.hands).forEach(labelId => {
    handCounts[labelId] = (handCounts[labelId] || 0) + 1;
  });

  const totalHands = Object.keys(rangeData.hands).length;
  const frequency = ((totalHands / 169) * 100).toFixed(1);

  const handleCreateLabel = () => {
    setEditingLabel(undefined);
    setIsModalOpen(true);
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    setIsModalOpen(true);
  };

  const handleSaveLabel = (name: string, color: string) => {
    if (editingLabel) {
      updateLabel(rangeId, editingLabel.id, name, color);
    } else {
      const newLabelId = createLabel(rangeId, name, color);
      setActiveLabelId(newLabelId);
    }
    setIsModalOpen(false);
    setEditingLabel(undefined);
  };

  const handleDeleteLabel = (labelId: string) => {
    deleteLabel(rangeId, labelId);
    if (activeLabelId === labelId) {
      setActiveLabelId(null);
    }
  };

  const handlePaintHand = useCallback((hand: string, isFirstClick: boolean) => {
    if (activeLabelId) {
      const currentLabelId = rangeData.hands[hand];

      if (isFirstClick) {
        // Save state before starting paint action
        saveStateBeforePaint();
        
        if (currentLabelId === activeLabelId) {
          setPaintMode('erase');
          setHandLabel(rangeId, hand, null);
        } else {
          setPaintMode('paint');
          setHandLabel(rangeId, hand, activeLabelId);
        }
      } else {
        if (paintMode === 'erase') {
          setHandLabel(rangeId, hand, null);
        } else if (paintMode === 'paint') {
          setHandLabel(rangeId, hand, activeLabelId);
        }
      }
    }
  }, [activeLabelId, rangeData.hands, saveStateBeforePaint, rangeId, setHandLabel, paintMode]);

  const handleBack = () => {
    router.push('/');
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(rangeName);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      setRangeName(rangeId, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName(rangeName);
  };

  const handleMoveLabel = (labelId: string, direction: 'up' | 'down') => {
    reorderLabel(rangeId, labelId, direction);
  };

  const handlePaintEnd = useCallback(() => {
    if (paintMode !== null) {
      // Save state after finishing paint action
      saveStateAfterPaint();
    }
    setPaintMode(null);
  }, [paintMode, saveStateAfterPaint]);

  if (!hasHydrated) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-[#101722]">
        <header className="h-16 shrink-0 border-b border-[#223149] flex items-center justify-between px-6 bg-[#162030]/50">
          <div className="flex items-center gap-6">
            <div className="w-24 h-9 bg-[#223149] rounded-lg animate-pulse"></div>
            <div className="border-l border-[#223149] pl-6">
              <div className="w-40 h-6 bg-[#223149] rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-72 border-r border-[#223149] bg-[#162030]/30 p-4 flex flex-col gap-4">
            <div className="h-10 bg-[#223149] rounded-lg animate-pulse"></div>
            <div className="flex-1 flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-[#223149] rounded-lg animate-pulse"></div>
              ))}
            </div>
          </aside>
          <main className="flex-1 bg-[#0b1019] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[560px]">
              <div className="aspect-square w-full bg-[#162030] rounded-lg animate-pulse"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#101722]">
      <header className="h-16 shrink-0 border-b border-[#223149] flex items-center justify-between px-6 bg-[#162030]/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-6">
          <Button
            variant="flat"
            className="bg-[#223149] hover:bg-[#223149]/80 text-white gap-2 font-bold rounded-lg"
            onPress={handleBack}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-l border-[#223149] pl-6">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onValueChange={setEditedName}
                  variant="underlined"
                  size="sm"
                  classNames={{
                    input: "text-lg font-bold",
                    inputWrapper: "max-w-[200px]"
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEditName();
                  }}
                  autoFocus
                />
                <Button size="sm" color="primary" isIconOnly onPress={handleSaveName}>
                  <Check size={16} />
                </Button>
                <Button size="sm" variant="flat" isIconOnly onPress={handleCancelEditName}>
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <button 
                onClick={handleEditName}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <h1 className="text-white text-lg font-bold leading-tight tracking-tight hover:underline decoration-blue-500 underline-offset-4 decoration-2">
                  {rangeName}
                </h1>
                <Pencil size={14} className="text-[#90a7cb]" />
              </button>
            )}
            
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[#90a7cb] text-xs font-medium">Auto-saved</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[#90a7cb] text-sm">
            <span>Total Combos: <strong className="text-white font-mono-nums">{totalHands}</strong></span>
            <span className="w-1 h-1 rounded-full bg-[#223149]"></span>
            <span>Freq: <strong className="text-white font-mono-nums">{frequency}%</strong></span>
          </div>
          
          <div className="h-6 w-px bg-[#223149] hidden md:block" />
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              isDisabled={!canUndo}
              onPress={handleUndo}
              className="bg-[#223149] hover:bg-[#223149]/80 text-white disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </Button>
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              isDisabled={!canRedo}
              onPress={handleRedo}
              className="bg-[#223149] hover:bg-[#223149]/80 text-white disabled:opacity-30"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <LabelSidebar
          labels={rangeData.labels}
          activeLabelId={activeLabelId}
          onSelectLabel={setActiveLabelId}
          onCreateLabel={handleCreateLabel}
          onEditLabel={handleEditLabel}
          onDeleteLabel={handleDeleteLabel}
          onMoveLabel={handleMoveLabel}
          handCounts={handCounts}
        />

        <main className="flex-1 bg-[#0b1019] flex flex-col items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-[560px] flex flex-col gap-3">
            <PokerGrid
              labels={rangeData.labels}
              hands={rangeData.hands}
              activeLabelId={activeLabelId}
              onPaintHand={handlePaintHand}
              onPaintEnd={handlePaintEnd}
            />

        
              <div className="w-full flex flex-wrap items-center justify-center gap-4 text-sm bg-[#162030]/50 p-3 rounded-lg border border-[#223149]">
                {rangeData.labels.map(label => (
                  <div key={label.id} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-white font-medium">{label.name}</span>
                    <span className="text-[#90a7cb] text-xs font-mono-nums">({handCounts[label.id] ?? 0})</span>
                  </div>
                ))}
              </div>
     

            <p className="w-full text-center text-xs text-[#90a7cb]">
              Click to paint, click same label to erase, drag for multiple cells
            </p>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <LabelModal
          label={editingLabel}
          onSave={handleSaveLabel}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLabel(undefined);
          }}
        />
      )}
    </div>
  );
}
