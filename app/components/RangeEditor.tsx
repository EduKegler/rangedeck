'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { ArrowLeft, Pencil, Check, X } from 'lucide-react';
import PokerGrid from './PokerGrid';
import LabelSidebar from './LabelSidebar';
import LabelModal from './LabelModal';
import { useRangesContext } from '../context/RangesContext';
import type { Label } from '../types/range';

interface RangeEditorProps {
  rangeId: string;
}

export default function RangeEditor({ rangeId }: RangeEditorProps) {
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
    return rangeData.labels.length > 0 ? rangeData.labels[0].id : null;
  });
  const [paintMode, setPaintMode] = useState<'paint' | 'erase' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | undefined>(undefined);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(rangeName);

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

  const handlePaintHand = (hand: string, isFirstClick: boolean) => {
    if (activeLabelId) {
      const currentLabelId = rangeData.hands[hand];

      if (isFirstClick) {
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
  };

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

  const handlePaintEnd = () => {
    setPaintMode(null);
  };

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
          <div className="hidden md:flex items-center gap-2 text-[#90a7cb] text-sm mr-4">
            <span>Total Combos: <strong className="text-white font-mono-nums">{totalHands}</strong></span>
            <span className="w-1 h-1 rounded-full bg-[#223149]"></span>
            <span>Freq: <strong className="text-white font-mono-nums">{frequency}%</strong></span>
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

            {rangeData.labels.length > 0 && (
              <div className="w-full flex flex-wrap items-center justify-center gap-4 text-sm bg-[#162030]/50 p-3 rounded-lg border border-[#223149]">
                {rangeData.labels.filter(label => handCounts[label.id] > 0).map(label => (
                  <div key={label.id} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-white font-medium">{label.name}</span>
                    <span className="text-[#90a7cb] text-xs font-mono-nums">({handCounts[label.id]})</span>
                  </div>
                ))}
              </div>
            )}
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
