'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GripVertical, Pencil, Trash2, Plus, PlusCircle, Upload, Download, Spade } from 'lucide-react';
import RangeCard from './RangeCard';
import CategoryModal from './CategoryModal';
import RangeCreateModal from './RangeCreateModal';
import ConfirmModal from './ConfirmModal';
import { useRangesContext } from '../context/RangesContext';
import { useToast } from './Toast';

export default function RangeList() {
  const { 
    rangesState, 
    exportToJSON, 
    importFromJSON, 
    createCategory, 
    updateCategory, 
    reorderCategoryByIndex, 
    deleteCategory, 
    createRange, 
    deleteRange,
    reorderRange,
  } = useRangesContext();
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [rangeModalState, setRangeModalState] = useState<{ categoryId: string; categoryName: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null);
  const [deletingRange, setDeletingRange] = useState<{ id: string; name: string } | null>(null);

  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [dragOverCategoryIndex, setDragOverCategoryIndex] = useState<number | null>(null);
  const categoryDragCounter = useRef(0);

  const [draggedRangeId, setDraggedRangeId] = useState<string | null>(null);
  const [dragOverRangeId, setDragOverRangeId] = useState<string | null>(null);
  const rangeDragCounter = useRef(0);

  const { showToast } = useToast();
  const categories = rangesState.categories || [];
  const rangeDefinitions = rangesState.rangeDefinitions || [];

  const rangesByCategory: { [categoryId: string]: typeof rangeDefinitions } = {};
  categories.forEach(cat => {
    rangesByCategory[cat.id] = rangeDefinitions.filter(r => r.categoryId === cat.id);
  });

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromJSON(
        file,
        () => showToast('Ranges imported successfully', 'success'),
        (error) => showToast(error, 'error')
      );
      e.target.value = '';
    }
  };

  const handleSelectRange = (rangeId: string) => {
    router.push(`/edit/${rangeId}`);
  };

  const handleSaveCategory = (name: string) => {
    if (editingCategory?.id) {
      updateCategory(editingCategory.id, name);
      showToast('Category updated', 'success');
    } else {
      createCategory(name);
      showToast('Category created', 'success');
    }
    setEditingCategory(null);
  };

  const handleDeleteCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const hasRanges = (rangesByCategory[categoryId] || []).length > 0;
    
    if (hasRanges) {
      showToast('Cannot delete category with ranges. Delete all ranges first.', 'error');
      return;
    }
    
    if (category) {
      setDeletingCategory({ id: categoryId, name: category.name });
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (deletingCategory) {
      const success = deleteCategory(deletingCategory.id);
      if (success) {
        showToast(`Category "${deletingCategory.name}" deleted`, 'success');
      }
      setDeletingCategory(null);
    }
  };

  const handleCreateRange = (name: string, categoryId: string) => {
    createRange(name, categoryId);
    setRangeModalState(null);
    showToast(`Range "${name}" created`, 'success');
  };

  const handleDeleteRangeClick = (e: React.MouseEvent, rangeId: string) => {
    e.stopPropagation();
    const range = rangeDefinitions.find(r => r.id === rangeId);
    if (range) {
      setDeletingRange({ id: rangeId, name: range.name });
    }
  };

  const handleConfirmDeleteRange = () => {
    if (deletingRange) {
      deleteRange(deletingRange.id);
      showToast(`Range "${deletingRange.name}" deleted`, 'success');
      setDeletingRange(null);
    }
  };

  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `category:${index}`);
  };

  const handleCategoryDragEnd = () => {
    setDraggedCategoryIndex(null);
    setDragOverCategoryIndex(null);
    categoryDragCounter.current = 0;
  };

  const handleCategoryDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const data = e.dataTransfer.types.includes('text/plain');
    if (data) {
      categoryDragCounter.current++;
      if (index !== draggedCategoryIndex) {
        setDragOverCategoryIndex(index);
      }
    }
  };

  const handleCategoryDragLeave = () => {
    categoryDragCounter.current--;
    if (categoryDragCounter.current === 0) {
      setDragOverCategoryIndex(null);
    }
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    
    if (data.startsWith('category:')) {
      const sourceIndex = parseInt(data.split(':')[1], 10);
      if (sourceIndex !== targetIndex) {
        reorderCategoryByIndex(sourceIndex, targetIndex);
      }
    }
    
    setDraggedCategoryIndex(null);
    setDragOverCategoryIndex(null);
    categoryDragCounter.current = 0;
  };

  const handleRangeDragStart = (e: React.DragEvent, rangeId: string) => {
    setDraggedRangeId(rangeId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `range:${rangeId}`);
  };

  const handleRangeDragEnd = () => {
    setDraggedRangeId(null);
    setDragOverRangeId(null);
    rangeDragCounter.current = 0;
  };

  const handleRangeDragEnter = (e: React.DragEvent, rangeId: string) => {
    e.preventDefault();
    rangeDragCounter.current++;
    if (rangeId !== draggedRangeId) {
      setDragOverRangeId(rangeId);
    }
  };

  const handleRangeDragLeave = () => {
    rangeDragCounter.current--;
    if (rangeDragCounter.current === 0) {
      setDragOverRangeId(null);
    }
  };

  const handleRangeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleRangeDrop = (e: React.DragEvent, targetRangeId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    
    if (data.startsWith('range:')) {
      const sourceRangeId = data.split(':')[1];
      if (sourceRangeId !== targetRangeId) {
        const targetIndex = rangeDefinitions.findIndex(r => r.id === targetRangeId);
        if (targetIndex !== -1) {
          reorderRange(sourceRangeId, targetIndex);
        }
      }
    }
    
    setDraggedRangeId(null);
    setDragOverRangeId(null);
    rangeDragCounter.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-[#3b82f6] flex items-center justify-center text-white">
            <Spade size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">RangeDeck</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="hidden md:flex items-center justify-center h-9 px-4 rounded border border-slate-700 hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer text-white">
            <Upload size={16} className="mr-2" />
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
            className="hidden md:flex items-center justify-center h-9 px-4 rounded border border-slate-700 hover:bg-slate-800 text-sm font-medium transition-colors text-white"
          >
            <Download size={16} className="mr-2" />
            Export JSON
          </button>
          <button 
            onClick={() => setEditingCategory({ id: '', name: '' })}
            className="flex items-center justify-center h-9 px-4 rounded bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold shadow-sm transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Category
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 md:px-4">
        <div className="mx-auto flex flex-col gap-2 pb-6">
          {categories.map((category, categoryIndex) => {
            const categoryRanges = rangesByCategory[category.id] || [];
            const hasRanges = categoryRanges.length > 0;
            const isCategoryDragging = draggedCategoryIndex === categoryIndex;
            const isCategoryDragOver = dragOverCategoryIndex === categoryIndex;

            return (
              <section 
                key={category.id} 
                className={`flex flex-col gap-2 transition-all ${
                  isCategoryDragging ? 'opacity-50' : ''
                } ${isCategoryDragOver ? 'ring-2 ring-[#3b82f6] ring-offset-2 ring-offset-[#111827] rounded-lg' : ''}`}
                onDragEnter={(e) => handleCategoryDragEnter(e, categoryIndex)}
                onDragLeave={handleCategoryDragLeave}
                onDragOver={handleCategoryDragOver}
                onDrop={(e) => handleCategoryDrop(e, categoryIndex)}
              >
                <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors -ml-2">
                  <div className="flex items-center gap-3">
                    <button 
                      draggable
                      onDragStart={(e) => handleCategoryDragStart(e, categoryIndex)}
                      onDragEnd={handleCategoryDragEnd}
                      className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing"
                      title="Drag to reorder category"
                    >
                      <GripVertical size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-slate-100">{category.name}</h2>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                        className="size-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Rename category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategoryClick(category.id)}
                        disabled={hasRanges}
                        className={`size-7 flex items-center justify-center rounded transition-colors ${
                          hasRanges 
                            ? 'text-slate-700 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-red-500 hover:bg-slate-800'
                        }`}
                        title={hasRanges ? "Delete category (Remove ranges first)" : "Delete category"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-medium text-slate-400 font-mono-nums">
                      {categoryRanges.length} Ranges
                    </span>
                  </div>
                  <button 
                    onClick={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                    className="flex items-center gap-1 text-[#3b82f6] hover:text-blue-400 text-sm font-bold transition-colors"
                  >
                    <PlusCircle size={18} />
                    Add Range
                  </button>
                </div>

                {hasRanges ? (
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 snap-x items-stretch">
                      {categoryRanges.map(range => {
                        const isRangeDragging = draggedRangeId === range.id;
                        const isRangeDragOver = dragOverRangeId === range.id;
                        
                        return (
                          <div
                            key={range.id}
                            draggable
                            onDragStart={(e) => handleRangeDragStart(e, range.id)}
                            onDragEnd={handleRangeDragEnd}
                            onDragEnter={(e) => handleRangeDragEnter(e, range.id)}
                            onDragLeave={handleRangeDragLeave}
                            onDragOver={handleRangeDragOver}
                            onDrop={(e) => handleRangeDrop(e, range.id)}
                            className={`transition-all ${
                              isRangeDragging ? 'opacity-50 scale-95' : ''
                            } ${isRangeDragOver ? 'ring-2 ring-[#3b82f6] rounded-xl' : ''}`}
                          >
                            <RangeCard
                              name={range.name}
                              rangeData={rangesState.ranges[range.id] || { labels: [], hands: {} }}
                              onClick={() => handleSelectRange(range.id)}
                              onDelete={(e) => handleDeleteRangeClick(e, range.id)}
                            />
                          </div>
                        );
                      })}
                      <button
                        onClick={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                        className="flex-none snap-start w-80 min-h-[400px] flex flex-col items-center justify-center bg-transparent rounded-xl border-2 border-dashed border-slate-700 hover:border-[#3b82f6] hover:bg-slate-800/50 transition-all cursor-pointer group"
                      >
                        <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-[#3b82f6]/20 transition-colors">
                          <Plus size={24} className="text-slate-400 group-hover:text-[#3b82f6]" />
                        </div>
                        <span className="text-sm font-semibold text-slate-400 group-hover:text-[#3b82f6]">Create New Range</span>
                      </button>
                      <div className="flex-none w-px" aria-hidden="true" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <div className="bg-slate-800 p-3 rounded-full mb-3">
                      <Spade size={24} className="text-slate-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">No ranges in this category</h3>
                    <p className="text-xs text-slate-400 mb-4">Start by adding your first range</p>
                    <button 
                      onClick={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium text-white transition-colors"
                    >
                      <Plus size={16} />
                      Add Range
                    </button>
                  </div>
                )}

                <div className="h-px w-full bg-slate-800 mt-1" />
              </section>
            );
          })}

          {categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-slate-800 p-4 rounded-full mb-4">
                <Spade size={32} className="text-slate-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No categories yet</h2>
              <p className="text-slate-400 mb-6">Create your first category to start organizing your poker ranges</p>
              <button 
                onClick={() => setEditingCategory({ id: '', name: '' })}
                className="flex items-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-blue-600 rounded-lg text-white font-bold transition-colors"
              >
                <Plus size={20} />
                New Category
              </button>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 md:hidden">
        <button 
          onClick={() => setEditingCategory({ id: '', name: '' })}
          className="size-14 bg-[#3b82f6] text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
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

      {deletingCategory && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete "${deletingCategory.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDeleteCategory}
          onCancel={() => setDeletingCategory(null)}
        />
      )}

      {deletingRange && (
        <ConfirmModal
          title="Delete Range"
          message={`Are you sure you want to delete "${deletingRange.name}"? All hand data will be lost.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDeleteRange}
          onCancel={() => setDeletingRange(null)}
        />
      )}
    </div>
  );
}
