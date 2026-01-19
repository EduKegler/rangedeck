'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import type { Category } from '../types/range';

interface CategoryModalProps {
  category?: Category;
  onSave: (name: string) => void;
  onClose: () => void;
}

const CategoryModal = memo(({ category, onSave, onClose }: CategoryModalProps) => {
  const [name, setName] = useState(category?.name || '');

  useEffect(() => {
    setName(category?.name || '');
  }, [category]);

  const handleSave = useCallback(() => {
    if (name.trim()) {
      onSave(name.trim());
    } else {
      alert('Please enter a category name');
    }
  }, [name, onSave]);

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
            {category ? 'Edit Category' : 'New Category'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 4Bet, Squeeze"
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
            {category ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CategoryModal;
