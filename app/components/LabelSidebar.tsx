'use client';

import { memo, useCallback } from 'react';
import type { Label } from '../types/range';

interface LabelSidebarProps {
  labels: Label[];
  activeLabelId: string | null;
  onSelectLabel: (labelId: string | null) => void;
  onCreateLabel: () => void;
  onEditLabel: (label: Label) => void;
  onDeleteLabel: (labelId: string) => void;
  onMoveLabel: (labelId: string, direction: 'up' | 'down') => void;
  handCounts: { [labelId: string]: number };
}

const LabelSidebar = memo(({
  labels,
  activeLabelId,
  onSelectLabel,
  onCreateLabel,
  onEditLabel,
  onDeleteLabel,
  onMoveLabel,
  handCounts,
}: LabelSidebarProps) => {
  const handleLabelClick = useCallback((labelId: string) => {
    // Always select the label, don't toggle off
    onSelectLabel(labelId);
  }, [onSelectLabel]);

  const handleDeleteLabel = useCallback((e: React.MouseEvent, labelId: string) => {
    e.stopPropagation();
    if (labels.length === 1) {
      alert('Cannot delete the last label. At least one label must exist.');
      return;
    }
    if (confirm('Delete this label? All hands with this label will be cleared.')) {
      onDeleteLabel(labelId);
    }
  }, [onDeleteLabel, labels.length]);

  const handleEditLabel = useCallback((e: React.MouseEvent, label: Label) => {
    e.stopPropagation();
    onEditLabel(label);
  }, [onEditLabel]);

  const handleMoveUp = useCallback((e: React.MouseEvent, labelId: string) => {
    e.stopPropagation();
    onMoveLabel(labelId, 'up');
  }, [onMoveLabel]);

  const handleMoveDown = useCallback((e: React.MouseEvent, labelId: string) => {
    e.stopPropagation();
    onMoveLabel(labelId, 'down');
  }, [onMoveLabel]);

  return (
    <div className="w-[280px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full max-lg:w-[240px] max-md:w-full max-md:h-auto max-md:max-h-[40vh] max-md:border-l-0 max-md:border-t">
      <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Labels</h3>
        <button
          onClick={onCreateLabel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-md:max-h-[30vh]">
        {labels.map((label, index) => (
          <button
            key={label.id}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all cursor-pointer group ${
              activeLabelId === label.id
                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 shadow-md'
                : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
            }`}
            onClick={() => handleLabelClick(label.id)}
          >
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: label.color }}
            />
            <div className="flex-1 min-w-0 flex flex-col gap-0.5 text-left">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">
                {label.name}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {handCounts[label.id] || 0} hands
              </span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={(e) => handleMoveUp(e, label.id)}
                  disabled={index === 0}
                  className="w-6 h-3 flex items-center justify-center bg-white dark:bg-gray-800 rounded text-[10px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={(e) => handleMoveDown(e, label.id)}
                  disabled={index === labels.length - 1}
                  className="w-6 h-3 flex items-center justify-center bg-white dark:bg-gray-800 rounded text-[10px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <button
                onClick={(e) => handleEditLabel(e, label)}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={(e) => handleDeleteLabel(e, label.id)}
                disabled={labels.length === 1}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={labels.length === 1 ? "Cannot delete last label" : "Delete"}
              >
                x
              </button>
            </div>
          </button>
        ))}

        {labels.length === 0 && (
          <div className="text-center py-10 px-5 text-gray-400 dark:text-gray-500">
            <p className="mb-2">No labels yet</p>
            <p className="text-sm italic">Create a label to start</p>
          </div>
        )}
      </div>

      {activeLabelId && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded flex-shrink-0"
                style={{
                  backgroundColor: labels.find(l => l.id === activeLabelId)?.color
                }}
              />
              <span>{labels.find(l => l.id === activeLabelId)?.name} active</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
              Paint or unpaint hands
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default LabelSidebar;
