'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RangeCard from './RangeCard';
import CategoryModal from './CategoryModal';
import RangeCreateModal from './RangeCreateModal';
import { useRangesContext } from '../context/RangesContext';

const RangeList = () => {
  const { rangesState, exportToJSON, importFromJSON, createCategory, updateCategory, reorderCategory, deleteCategory, createRange, deleteRange } = useRangesContext();
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [rangeModalState, setRangeModalState] = useState<{ categoryId: string; categoryName: string } | null>(null);

  const categories = useMemo(() => rangesState.categories || [], [rangesState.categories]);
  const rangeDefinitions = useMemo(() => rangesState.rangeDefinitions || [], [rangesState.rangeDefinitions]);

  const rangesByCategory = useMemo(() => {
    const grouped: { [categoryId: string]: typeof rangeDefinitions } = {};
    categories.forEach(cat => {
      grouped[cat.id] = rangeDefinitions.filter(r => r.categoryId === cat.id);
    });
    return grouped;
  }, [categories, rangeDefinitions]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromJSON(file);
      e.target.value = '';
    }
  }, [importFromJSON]);

  const handleSelectRange = useCallback((rangeId: string) => {
    router.push(`/edit/${rangeId}`);
  }, [router]);

  const handleSaveCategory = useCallback((name: string) => {
    if (editingCategory?.id) {
      updateCategory(editingCategory.id, name);
    } else {
      createCategory(name);
    }
    setEditingCategory(null);
  }, [editingCategory, createCategory, updateCategory]);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    if (confirm('Delete this category? It must be empty.')) {
      deleteCategory(categoryId);
    }
  }, [deleteCategory]);

  const handleCreateRange = useCallback((name: string, categoryId: string) => {
    const rangeId = createRange(name, categoryId);
    setRangeModalState(null);
    router.push(`/edit/${rangeId}`);
  }, [createRange, router]);

  const handleDeleteRange = useCallback((e: React.MouseEvent, rangeId: string) => {
    e.stopPropagation();
    if (confirm('Delete this range? This action cannot be undone.')) {
      deleteRange(rangeId);
    }
  }, [deleteRange]);

  const handleMoveCategory = useCallback((categoryId: string, direction: 'up' | 'down') => {
    reorderCategory(categoryId, direction);
  }, [reorderCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-3">
      <div className="max-w-full mx-auto mb-8 px-2">
        <div className="flex justify-between items-center gap-5 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Poker Ranges</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setEditingCategory({ id: '', name: '' })}
              className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              + New Category
            </button>
            <label className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={exportToJSON}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto flex flex-col gap-8 px-2">
        {categories.map((category, index) => {
          const hasRanges = (rangesByCategory[category.id]?.length || 0) > 0;

          return (
            <section key={category.id}>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveCategory(category.id, 'up')}
                      disabled={index === 0}
                      className="w-5 h-2.5 flex items-center justify-center bg-gray-700 dark:bg-gray-600 text-white rounded text-[10px] hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveCategory(category.id, 'down')}
                      disabled={index === categories.length - 1}
                      className="w-5 h-2.5 flex items-center justify-center bg-gray-700 dark:bg-gray-600 text-white rounded text-[10px] hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    {category.name}
                  </h2>
                  <button
                    onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Edit category name"
                  >
                    ✏️
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + Range
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={hasRanges}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                    title={hasRanges ? "Cannot delete category with ranges" : "Delete category"}
                  >
                    Delete Category
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {rangesByCategory[category.id]?.map(range => (
                  <div key={range.id} className="relative group">
                    <RangeCard
                      name={range.name}
                      rangeData={rangesState.ranges[range.id] || { labels: [], hands: {} }}
                      onClick={() => handleSelectRange(range.id)}
                    />
                    <button
                      onClick={(e) => handleDeleteRange(e, range.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all flex items-center justify-center"
                      title="Delete range"
                    >
                      x
                    </button>
                  </div>
                ))}
                {(!rangesByCategory[category.id] || rangesByCategory[category.id].length === 0) && (
                  <div className="col-span-full text-center py-8 text-gray-400 dark:text-gray-500 text-sm italic">
                    No ranges in this category. Click &quot;+ Range&quot; to create one.
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-lg mb-2">No categories yet</p>
            <p className="text-sm italic">Click &quot;+ New Category&quot; to get started</p>
          </div>
        )}
      </div>

      {editingCategory !== null && (
        <CategoryModal
          category={editingCategory.id ? editingCategory : undefined}
          onSave={handleSaveCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {rangeModalState && (
        <RangeCreateModal
          categoryId={rangeModalState.categoryId}
          categoryName={rangeModalState.categoryName}
          onSave={handleCreateRange}
          onClose={() => setRangeModalState(null)}
        />
      )}
    </div>
  );
};

export default RangeList;
