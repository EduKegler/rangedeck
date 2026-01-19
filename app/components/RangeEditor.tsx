'use client';

import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PokerGrid from './PokerGrid';
import LabelSidebar from './LabelSidebar';
import LabelModal from './LabelModal';
import { useRangesContext } from '../context/RangesContext';
import type { Label } from '../types/range';

interface RangeEditorProps {
  rangeId: string;
}

const RangeEditor = memo(({ rangeId }: RangeEditorProps) => {
  const router = useRouter();
  const {
    rangesState,
    getRangeData,
    createLabel,
    updateLabel,
    deleteLabel,
    setHandLabel,
    setRangeName,
    reorderLabel,
  } = useRangesContext();

  const rangeData = getRangeData(rangeId);
  const rangeDef = (rangesState.rangeDefinitions || []).find(r => r.id === rangeId);
  const defaultName = rangeDef?.name || rangeId;
  const rangeName = rangeData.customName || defaultName;

  const [activeLabelId, setActiveLabelId] = useState<string | null>(() => {
    // Initialize with first label if available
    return rangeData.labels.length > 0 ? rangeData.labels[0].id : null;
  });
  const [paintMode, setPaintMode] = useState<'paint' | 'erase' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | undefined>(undefined);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(rangeName);

  // Auto-select first label when labels change and no label is selected
  useEffect(() => {
    if (rangeData.labels.length > 0) {
      // If no label is selected, or the selected label doesn't exist anymore, select the first one
      const selectedLabelExists = activeLabelId && rangeData.labels.some(l => l.id === activeLabelId);
      if (!activeLabelId || !selectedLabelExists) {
        setActiveLabelId(rangeData.labels[0].id);
      }
    }
  }, [rangeData.labels, activeLabelId]);

  const handCounts = useMemo(() => {
    const counts: { [labelId: string]: number } = {};
    Object.values(rangeData.hands).forEach(labelId => {
      counts[labelId] = (counts[labelId] || 0) + 1;
    });
    return counts;
  }, [rangeData.hands]);

  const handleCreateLabel = useCallback(() => {
    setEditingLabel(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditLabel = useCallback((label: Label) => {
    setEditingLabel(label);
    setIsModalOpen(true);
  }, []);

  const handleSaveLabel = useCallback((name: string, color: string) => {
    if (editingLabel) {
      updateLabel(rangeId, editingLabel.id, name, color);
    } else {
      const newLabelId = createLabel(rangeId, name, color);
      // Always select the newly created label
      setActiveLabelId(newLabelId);
    }
    setIsModalOpen(false);
    setEditingLabel(undefined);
  }, [rangeId, editingLabel, createLabel, updateLabel]);

  const handleDeleteLabel = useCallback((labelId: string) => {
    deleteLabel(rangeId, labelId);
    if (activeLabelId === labelId) {
      setActiveLabelId(null);
    }
  }, [rangeId, activeLabelId, deleteLabel]);

  const handlePaintHand = useCallback((hand: string, isFirstClick: boolean) => {
    if (activeLabelId) {
      const currentLabelId = rangeData.hands[hand];

      if (isFirstClick) {
        // Determine mode based on first click
        if (currentLabelId === activeLabelId) {
          setPaintMode('erase');
          setHandLabel(rangeId, hand, null);
        } else {
          setPaintMode('paint');
          setHandLabel(rangeId, hand, activeLabelId);
        }
      } else {
        // Apply the determined mode
        if (paintMode === 'erase') {
          setHandLabel(rangeId, hand, null);
        } else if (paintMode === 'paint') {
          setHandLabel(rangeId, hand, activeLabelId);
        }
      }
    }
  }, [rangeId, activeLabelId, rangeData.hands, setHandLabel, paintMode]);

  const handleBack = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleEditName = useCallback(() => {
    setIsEditingName(true);
    setEditedName(rangeName);
  }, [rangeName]);

  const handleSaveName = useCallback(() => {
    if (editedName.trim()) {
      setRangeName(rangeId, editedName.trim());
      setIsEditingName(false);
    }
  }, [rangeId, editedName, setRangeName]);

  const handleCancelEditName = useCallback(() => {
    setIsEditingName(false);
    setEditedName(rangeName);
  }, [rangeName]);

  const handleMoveLabel = useCallback((labelId: string, direction: 'up' | 'down') => {
    reorderLabel(rangeId, labelId, direction);
  }, [rangeId, reorderLabel]);

  const handlePaintEnd = useCallback(() => {
    setPaintMode(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-5 flex items-center justify-between gap-5">
        <button
          onClick={handleBack}
          className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center gap-1"
        >
          ← Back
        </button>
        {isEditingName ? (
          <div className="flex-1 flex items-center justify-center gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelEditName();
              }}
              className="text-2xl font-bold text-gray-900 dark:text-gray-50 text-center bg-transparent border-b-2 border-blue-500 focus:outline-none px-2 max-lg:text-xl"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              ✓
            </button>
            <button
              onClick={handleCancelEditName}
              className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 text-center max-lg:text-xl">
              {rangeName}
            </h1>
            <button
              onClick={handleEditName}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Edit name"
            >
              ✏️
            </button>
          </div>
        )}
        <div className="w-[100px] max-lg:w-[80px]" />
      </div>

      <div className="flex-1 flex overflow-hidden max-md:flex-col">
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <PokerGrid
            labels={rangeData.labels}
            hands={rangeData.hands}
            activeLabelId={activeLabelId}
            onPaintHand={handlePaintHand}
            onPaintEnd={handlePaintEnd}
          />
        </div>

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
});

export default RangeEditor;
