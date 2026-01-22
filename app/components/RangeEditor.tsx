'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { ArrowLeft, Pencil, Check, X, Undo2, Redo2 } from 'lucide-react';
import PokerGrid from './PokerGrid';
import LabelSidebar from './LabelSidebar';
import LabelModal from './LabelModal';
import Footer from './Footer';
import { useRangesStore } from '../stores/rangesStore';
import type { Label } from '../types/range';
import { calculateTotalCombos } from '../utils/pokerHands';
import {
  trackRangeEdited,
  trackHandsPainted,
  trackHandsErased,
  trackUndoUsed,
  trackRedoUsed,
  trackRangeRenamed,
  trackEditorSessionStart,
  trackEditorSessionEnd,
  trackLabelCreated,
  trackLabelEdited,
  trackLabelSelected,
  trackLabelDeleted,
  trackLabelReordered,
  trackKeyboardShortcutUsed,
} from '@/lib/analytics';

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

  const [history, setHistory] = useState<HandsState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const stateBeforePaintRef = useRef<HandsState | null>(null);
  const isUndoRedoAction = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasHydrated && !hasInitialized.current) {
      hasInitialized.current = true;
      setHistory([{ ...rangeData.hands }]);
      setHistoryIndex(0);
    }
  }, [hasHydrated, rangeData.hands]);

  useEffect(() => {
    if (!hasHydrated) return;

    const sessionStartTime = Date.now();

    trackRangeEdited({
      range_id: rangeId,
      range_name: rangeName,
      hand_count: calculateTotalCombos(rangeData.hands),
    });

    trackEditorSessionStart({
      range_name: rangeName,
      label_count: rangeData.labels.length,
      hands_painted_count: Object.keys(rangeData.hands).length,
    });

    return () => {
      const timeSpentSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      trackEditorSessionEnd({
        range_name: rangeName,
        time_spent_seconds: timeSpentSeconds,
        changes_made: historyIndex,
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, rangeId]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveStateBeforePaint = useCallback(() => {
    if (!isUndoRedoAction.current) {
      stateBeforePaintRef.current = { ...rangeData.hands };
    }
  }, [rangeData.hands]);

  const saveStateAfterPaint = useCallback(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    const stateBefore = stateBeforePaintRef.current;
    const stateAfter = rangeData.hands;

    if (stateBefore && JSON.stringify(stateBefore) !== JSON.stringify(stateAfter)) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ ...stateAfter });
        
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

      const currentHands = rangeData.hands;
      const handsToRemove = Object.keys(currentHands).filter(h => !previousState[h]);
      const handsToAdd = Object.entries(previousState);

      for (const hand of handsToRemove) {
        setHandLabel(rangeId, hand, null);
      }
      
      for (const [hand, labelId] of handsToAdd) {
        if (currentHands[hand] !== labelId) {
          setHandLabel(rangeId, hand, labelId);
        }
      }

      setHistoryIndex(newIndex);

      trackUndoUsed({
        range_name: rangeName,
        history_depth: newIndex,
      });
    }
  }, [historyIndex, history, rangeData.hands, rangeId, setHandLabel, rangeName]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];

      const currentHands = rangeData.hands;
      const handsToRemove = Object.keys(currentHands).filter(h => !nextState[h]);
      const handsToAdd = Object.entries(nextState);

      for (const hand of handsToRemove) {
        setHandLabel(rangeId, hand, null);
      }

      for (const [hand, labelId] of handsToAdd) {
        if (currentHands[hand] !== labelId) {
          setHandLabel(rangeId, hand, labelId);
        }
      }

      setHistoryIndex(newIndex);

      trackRedoUsed({
        range_name: rangeName,
        history_depth: newIndex,
      });
    }
  }, [historyIndex, history, rangeData.hands, rangeId, setHandLabel, rangeName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
          trackKeyboardShortcutUsed({
            shortcut_name: 'redo',
            context: 'range_editor',
          });
        } else {
          handleUndo();
          trackKeyboardShortcutUsed({
            shortcut_name: 'undo',
            context: 'range_editor',
          });
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
        trackKeyboardShortcutUsed({
          shortcut_name: 'redo',
          context: 'range_editor',
        });
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
  const comboCounts: { [labelId: string]: number } = {};
  
  Object.entries(rangeData.hands).forEach(([hand, labelId]) => {
    handCounts[labelId] = (handCounts[labelId] || 0) + 1;
    const combos = (hand.endsWith('s') ? 4 : hand.endsWith('o') ? 12 : 6);
    comboCounts[labelId] = (comboCounts[labelId] || 0) + combos;
  });

  const totalCombos = calculateTotalCombos(rangeData.hands);
  const frequency = ((totalCombos / 1326) * 100).toFixed(1);

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
      const nameChanged = editingLabel.name !== name;
      const colorChanged = editingLabel.color !== color;
      const changedField = nameChanged && colorChanged ? 'both' : nameChanged ? 'name' : 'color';

      updateLabel(rangeId, editingLabel.id, name, color);

      trackLabelEdited({
        label_name: name,
        changed_field: changedField,
        range_name: rangeName,
      });
    } else {
      const newLabelId = createLabel(rangeId, name, color);
      setActiveLabelId(newLabelId);

      trackLabelCreated({
        label_name: name,
        label_color: color,
        range_name: rangeName,
      });
    }
    setIsModalOpen(false);
    setEditingLabel(undefined);
  };

  const handleDeleteLabel = (labelId: string) => {
    const label = rangeData.labels.find(l => l.id === labelId);
    const affectedHandsCount = Object.values(rangeData.hands).filter(id => id === labelId).length;

    deleteLabel(rangeId, labelId);
    if (activeLabelId === labelId) {
      setActiveLabelId(null);
    }

    if (label) {
      trackLabelDeleted({
        label_name: label.name,
        affected_hands_count: affectedHandsCount,
      });
    }
  };

  const handlePaintHand = useCallback((hand: string, isFirstClick: boolean) => {
    if (activeLabelId) {
      const currentLabelId = rangeData.hands[hand];

      if (isFirstClick) {
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
      const newName = editedName.trim();
      const oldName = rangeName;

      setRangeName(rangeId, newName);
      setIsEditingName(false);

      if (oldName !== newName) {
        const category = rangeDefinitions?.find(r => r.id === rangeId);
        trackRangeRenamed({
          old_name: oldName,
          new_name: newName,
          category: category?.name || 'Unknown',
        });
      }
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName(rangeName);
  };

  const handleMoveLabel = (labelId: string, direction: 'up' | 'down') => {
    const label = rangeData.labels.find(l => l.id === labelId);
    const currentIndex = rangeData.labels.findIndex(l => l.id === labelId);
    const newPosition = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    reorderLabel(rangeId, labelId, direction);

    if (label) {
      trackLabelReordered({
        direction,
        new_position: newPosition,
        label_name: label.name,
      });
    }
  };

  const handleSelectLabel = (labelId: string | null) => {
    setActiveLabelId(labelId);

    if (labelId) {
      const label = rangeData.labels.find(l => l.id === labelId);
      if (label) {
        trackLabelSelected({
          label_name: label.name,
          label_color: label.color,
          range_name: rangeName,
        });
      }
    }
  };

  const handlePaintEnd = useCallback(() => {
    if (paintMode !== null) {
      const stateBefore = stateBeforePaintRef.current;
      const stateAfter = rangeData.hands;

      if (stateBefore) {
        const changedHands = new Set<string>();

        for (const hand in stateAfter) {
          if (stateBefore[hand] !== stateAfter[hand]) {
            changedHands.add(hand);
          }
        }

        for (const hand in stateBefore) {
          if (!(hand in stateAfter)) {
            changedHands.add(hand);
          }
        }

        if (changedHands.size > 0) {
          const activeLabel = rangeData.labels.find(l => l.id === activeLabelId);

          if (paintMode === 'paint' && activeLabel) {
            trackHandsPainted({
              label_name: activeLabel.name,
              label_color: activeLabel.color,
              hands_count: changedHands.size,
              action_type: changedHands.size > 1 ? 'drag' : 'single',
            });
          } else if (paintMode === 'erase') {
            trackHandsErased({
              hands_count: changedHands.size,
            });
          }
        }
      }

      saveStateAfterPaint();
    }
    setPaintMode(null);
  }, [paintMode, saveStateAfterPaint, rangeData.hands, rangeData.labels, activeLabelId]);

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
                <Button size="sm" color="primary" isIconOnly onPress={handleSaveName} aria-label="Save range name">
                  <Check size={16} aria-hidden="true" />
                </Button>
                <Button size="sm" variant="flat" isIconOnly onPress={handleCancelEditName} aria-label="Cancel editing">
                  <X size={16} aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <button
                onClick={handleEditName}
                className="flex items-center gap-2 group cursor-pointer"
                aria-label="Edit range name"
              >
                <h1 className="text-white text-lg font-bold leading-tight tracking-tight hover:underline decoration-blue-500 underline-offset-4 decoration-2">
                  {rangeName}
                </h1>
                <Pencil size={14} className="text-[#90a7cb]" aria-hidden="true" />
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
            <span>Total Combos: <strong className="text-white font-mono-nums">{totalCombos}</strong></span>
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
              aria-label="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              isDisabled={!canRedo}
              onPress={handleRedo}
              className="bg-[#223149] hover:bg-[#223149]/80 text-white disabled:opacity-30"
              aria-label="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <LabelSidebar
          labels={rangeData.labels}
          activeLabelId={activeLabelId}
          onSelectLabel={handleSelectLabel}
          onCreateLabel={handleCreateLabel}
          onEditLabel={handleEditLabel}
          onDeleteLabel={handleDeleteLabel}
          onMoveLabel={handleMoveLabel}
          handCounts={handCounts}
          comboCounts={comboCounts}
        />

        <main id="main-content" className="flex-1 bg-[#0b1019] flex flex-col items-center justify-center p-4 md:p-6" tabIndex={-1}>
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
                    <span className="text-[#90a7cb] text-xs font-mono-nums">({comboCounts[label.id] ?? 0})</span>
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

      <Footer />
    </div>
  );
}
