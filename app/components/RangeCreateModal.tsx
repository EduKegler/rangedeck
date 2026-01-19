'use client';

import { memo, useState, useCallback } from 'react';

interface RangeCreateModalProps {
  categoryId: string;
  categoryName: string;
  onSave: (name: string, categoryId: string) => void;
  onClose: () => void;
}

const RangeCreateModal = memo(({ categoryId, categoryName, onSave, onClose }: RangeCreateModalProps) => {
  const [name, setName] = useState('');

  const handleSave = useCallback(() => {
    if (name.trim()) {
      onSave(name.trim(), categoryId);
    } else {
      alert('Please enter a range name');
    }
  }, [name, categoryId, onSave]);

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
            New Range in {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            x
          </button>
        </div>

        <div className="px-6 py-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Range Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., MP vs BTN, EP vs BB"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
});

export default RangeCreateModal;
