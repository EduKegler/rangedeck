'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import type { Label } from '../types/range';

interface LabelModalProps {
  label?: Label;
  onSave: (name: string, color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

const LabelModal = memo(({ label, onSave, onClose }: LabelModalProps) => {
  const [name, setName] = useState(label?.name || '');
  const [color, setColor] = useState(label?.color || '#3b82f6');

  useEffect(() => {
    setName(label?.name || '');
    setColor(label?.color || '#3b82f6');
  }, [label]);

  const handleSave = useCallback(() => {
    if (name.trim()) {
      onSave(name.trim(), color);
    } else {
      alert('Please enter a name for the label');
    }
  }, [name, color, onSave]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {label ? 'Edit Label' : 'New Label'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            x
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 4bet, Call, Raise"
              autoFocus
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-15 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preset Colors</label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    color === presetColor
                      ? 'border-gray-900 dark:border-gray-100 shadow-lg scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
            <div className="flex justify-center">
              <div
                className="px-6 py-3 rounded-lg text-white text-base font-semibold text-center min-w-[120px]"
                style={{ backgroundColor: color }}
              >
                {name || 'Label Name'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});

export default LabelModal;
