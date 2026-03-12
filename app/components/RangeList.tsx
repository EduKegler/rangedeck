'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus, Upload, Download, Spade, Settings } from 'lucide-react';
import Button, { buttonVariants } from './button';
import {
  trackRangeExported,
  trackRangeImported,
  trackRangeDeleted,
  trackCategoryReordered,
  trackRangeMoved,
  trackRangeReordered,
  trackCategoryCreated,
  trackCategoryRenamed,
  trackCategoryDeleted,
  trackImportFailed,
} from '@/lib/analytics';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableRangeCard from './SortableRangeCard';
import SortableCategory from './SortableCategory';
import RangeCard from './RangeCard';
import DroppableZone from './DroppableZone';
import Footer from './Footer';
import { useRangesStore } from '../stores/rangesStore';
import { useToastStore } from '../stores/toastStore';

// Lazy load modals to reduce initial bundle size
const CategoryModal = dynamic(() => import('./CategoryModal'), {
  ssr: false,
});
const RangeCreateModal = dynamic(() => import('./RangeCreateModal'), {
  ssr: false,
});
const ConfirmModal = dynamic(() => import('./ConfirmModal'), {
  ssr: false,
});
const SettingsModal = dynamic(() => import('./SettingsModal'), {
  ssr: false,
});

function SkeletonCard() {
  return (
    <div className="flex-none snap-start bg-[#111827] rounded-[14px] border border-white/6 p-4 shadow-sm flex flex-col animate-pulse"
      style={{ width: 'var(--settings-card-size, 400px)', minHeight: '320px' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="h-5 bg-white/5 rounded w-24"></div>
        <div className="h-4 bg-white/5 rounded w-12"></div>
      </div>
      <div className="aspect-square w-full bg-white/3 rounded mb-3"></div>
      <div className="mt-auto flex flex-col gap-2">
        <div className="h-3 bg-white/5 rounded w-full"></div>
        <div className="h-6 bg-white/5 rounded w-full"></div>
      </div>
    </div>
  );
}

function SkeletonCategory() {
  return (
    <section className="flex flex-col gap-2 animate-pulse">
      <div className="flex items-center justify-between p-2 -ml-2">
        <div className="flex items-center gap-3">
          <div className="h-6 bg-white/5 rounded w-32"></div>
          <div className="h-5 bg-white/3 rounded-full w-16"></div>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 scrollbar-hide snap-x items-stretch">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}

const CATEGORY_PREFIX = 'sortable-category-';

export default function RangeList() {
  const hasHydrated = useRangesStore((state) => state._hasHydrated);
  
  const ranges = useRangesStore((state) => state.ranges);
  const categoriesRaw = useRangesStore((state) => state.categories);
  const rangeDefinitionsRaw = useRangesStore((state) => state.rangeDefinitions);

  const categories = useMemo(() => categoriesRaw || [], [categoriesRaw]);
  const rangeDefinitions = useMemo(() => rangeDefinitionsRaw || [], [rangeDefinitionsRaw]);
  const exportToJSON = useRangesStore((state) => state.exportToJSON);
  const importFromJSON = useRangesStore((state) => state.importFromJSON);
  const createCategory = useRangesStore((state) => state.createCategory);
  const updateCategory = useRangesStore((state) => state.updateCategory);
  const reorderCategoryByIndex = useRangesStore((state) => state.reorderCategoryByIndex);
  const deleteCategory = useRangesStore((state) => state.deleteCategory);
  const createRange = useRangesStore((state) => state.createRange);
  const deleteRange = useRangesStore((state) => state.deleteRange);
  const reorderRange = useRangesStore((state) => state.reorderRange);
  const moveRangeToCategory = useRangesStore((state) => state.moveRangeToCategory);
  const setRangeName = useRangesStore((state) => state.setRangeName);

  const showToast = useToastStore((state) => state.showToast);

  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [rangeModalState, setRangeModalState] = useState<{ categoryId: string; categoryName: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null);
  const [deletingRange, setDeletingRange] = useState<{ id: string; name: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overCategoryId, setOverCategoryId] = useState<string | null>(null);

  const sensors = useMemo(
    () => [
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    ],
    []
  );

  const rangesByCategory = useMemo(() => {
    const result: { [categoryId: string]: typeof rangeDefinitions } = {};
    for (const cat of categories) {
      result[cat.id] = rangeDefinitions.filter(r => r.categoryId === cat.id);
    }
    return result;
  }, [categories, rangeDefinitions]);

  const isCategory = useCallback((id: string) => id.startsWith(CATEGORY_PREFIX), []);
  const getCategoryId = useCallback((id: string) => id.replace(CATEGORY_PREFIX, ''), []);

  const activeRange = useMemo(() => {
    if (!activeId || isCategory(activeId)) return null;
    return rangeDefinitions.find(r => r.id === activeId) || null;
  }, [activeId, rangeDefinitions, isCategory]);

  const activeCategoryData = useMemo(() => {
    if (!activeId || !isCategory(activeId)) return null;
    const categoryId = getCategoryId(activeId);
    return categories.find(c => c.id === categoryId) || null;
  }, [activeId, categories, isCategory, getCategoryId]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromJSON(
        file,
        () => {
          showToast('Ranges imported successfully', 'success');

          trackRangeImported({
            ranges_count: rangeDefinitions.length,
            categories_count: categories.length,
          });
        },
        (error) => {
          showToast(error, 'error');

          trackImportFailed({
            error_reason: error,
          });
        }
      );
      e.target.value = '';
    }
  }, [importFromJSON, showToast, rangeDefinitions.length, categories.length]);

  const handleSelectRange = useCallback((rangeId: string) => {
    router.push(`/edit/${rangeId}`);
  }, [router]);

  const handleSaveCategory = useCallback((name: string) => {
    if (editingCategory?.id) {
      const oldName = editingCategory.name;
      updateCategory(editingCategory.id, name);
      showToast('Category updated', 'success');

      trackCategoryRenamed({
        old_name: oldName,
        new_name: name,
      });
    } else {
      createCategory(name);
      showToast('Category created', 'success');

      trackCategoryCreated({
        category_name: name,
      });
    }
    setEditingCategory(null);
  }, [editingCategory, updateCategory, createCategory, showToast]);

  const handleDeleteCategoryClick = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const hasRanges = (rangesByCategory[categoryId] || []).length > 0;
    
    if (hasRanges) {
      showToast('Cannot delete category with ranges. Delete all ranges first.', 'error');
      return;
    }
    
    if (category) {
      setDeletingCategory({ id: categoryId, name: category.name });
    }
  }, [categories, rangesByCategory, showToast]);

  const handleConfirmDeleteCategory = useCallback(() => {
    if (deletingCategory) {
      const rangesCount = (rangesByCategory[deletingCategory.id] || []).length;
      const success = deleteCategory(deletingCategory.id);
      if (success) {
        showToast(`Category "${deletingCategory.name}" deleted`, 'success');

        trackCategoryDeleted({
          category_name: deletingCategory.name,
          ranges_count: rangesCount,
        });
      }
      setDeletingCategory(null);
    }
  }, [deletingCategory, deleteCategory, showToast, rangesByCategory]);

  const handleCreateRange = useCallback((name: string, categoryId: string) => {
    createRange(name, categoryId);
    setRangeModalState(null);
    showToast(`Range "${name}" created`, 'success');
  }, [createRange, showToast]);

  const handleDeleteRangeClick = useCallback((e: React.MouseEvent, rangeId: string) => {
    e.stopPropagation();
    const range = rangeDefinitions.find(r => r.id === rangeId);
    if (range) {
      setDeletingRange({ id: rangeId, name: range.name });
    }
  }, [rangeDefinitions]);

  const handleConfirmDeleteRange = useCallback(() => {
    if (deletingRange) {
      const rangeDef = rangeDefinitions.find(r => r.id === deletingRange.id);
      const rangeData = ranges[deletingRange.id];
      const category = categories.find(c => c.id === rangeDef?.categoryId);

      deleteRange(deletingRange.id);
      showToast(`Range "${deletingRange.name}" deleted`, 'success');

      trackRangeDeleted({
        range_name: deletingRange.name,
        category: category?.name || 'Unknown',
        had_custom_hands: rangeData ? Object.keys(rangeData.hands).length > 0 : false,
      });

      setDeletingRange(null);
    }
  }, [deletingRange, deleteRange, showToast, rangeDefinitions, ranges, categories]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setOverCategoryId(null);
      return;
    }

    const activeIdStr = active.id as string;
    const overId = over.id as string;

    if (isCategory(activeIdStr)) {
      setOverCategoryId(null);
      return;
    }

    if (overId.startsWith('category-drop-')) {
      setOverCategoryId(overId.replace('category-drop-', ''));
    } else if (!isCategory(overId)) {
      const overRange = rangeDefinitions.find(r => r.id === overId);
      setOverCategoryId(overRange?.categoryId || null);
    } else {
      setOverCategoryId(null);
    }
  }, [rangeDefinitions, isCategory]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setOverCategoryId(null);

    if (!over) return;

    const activeIdStr = active.id as string;
    const overId = over.id as string;

    if (isCategory(activeIdStr) && isCategory(overId)) {
      const activeCatId = getCategoryId(activeIdStr);
      const overCatId = getCategoryId(overId);

      if (activeCatId !== overCatId) {
        const activeIndex = categories.findIndex(c => c.id === activeCatId);
        const overIndex = categories.findIndex(c => c.id === overCatId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const activeCategory = categories[activeIndex];
          reorderCategoryByIndex(activeIndex, overIndex);

          trackCategoryReordered({
            category_name: activeCategory.name,
            direction: overIndex > activeIndex ? 'down' : 'up',
          });
        }
      }
      return;
    }

    if (!isCategory(activeIdStr)) {
      const activeRangeData = rangeDefinitions.find(r => r.id === activeIdStr);
      if (!activeRangeData) return;

      if (overId.startsWith('category-drop-')) {
        const targetCategoryId = overId.replace('category-drop-', '');
        if (activeRangeData.categoryId !== targetCategoryId) {
          const fromCategory = categories.find(c => c.id === activeRangeData.categoryId);
          const toCategory = categories.find(c => c.id === targetCategoryId);

          moveRangeToCategory(activeIdStr, targetCategoryId);
          showToast(`Moved "${activeRangeData.name}" to "${toCategory?.name}"`, 'success');

          trackRangeMoved({
            from_category: fromCategory?.name || 'Unknown',
            to_category: toCategory?.name || 'Unknown',
            range_name: activeRangeData.name,
          });
        }
        return;
      }

      if (!isCategory(overId)) {
        const overRange = rangeDefinitions.find(r => r.id === overId);
        if (!overRange) return;

        if (activeIdStr !== overId) { 
          if (activeRangeData.categoryId !== overRange.categoryId) {
            const fromCategory = categories.find(c => c.id === activeRangeData.categoryId);
            const toCategory = categories.find(c => c.id === overRange.categoryId);

            moveRangeToCategory(activeIdStr, overRange.categoryId);
            showToast(`Moved "${activeRangeData.name}" to "${toCategory?.name}"`, 'success');

            trackRangeMoved({
              from_category: fromCategory?.name || 'Unknown',
              to_category: toCategory?.name || 'Unknown',
              range_name: activeRangeData.name,
            });
          } else {
            const category = categories.find(c => c.id === activeRangeData.categoryId);

            trackRangeReordered({
              category: category?.name || 'Unknown',
              range_name: activeRangeData.name,
            });
          }

          const targetIndex = rangeDefinitions.findIndex(r => r.id === overId);
          if (targetIndex !== -1) {
            reorderRange(activeIdStr, targetIndex);
          }
        }
      }
    }
  }, [categories, rangeDefinitions, isCategory, getCategoryId, reorderCategoryByIndex, moveRangeToCategory, reorderRange, showToast]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#0c1220] flex flex-col">
        <header className="mx-3 mt-3 rounded-[14px] border border-blue-500/12 bg-[#111827]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(59,130,246,0.04)] h-16 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded animate-pulse"></div>
            <div className="h-6 bg-white/5 rounded w-28 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 bg-white/5 rounded w-24 animate-pulse hidden md:block"></div>
            <div className="h-9 bg-white/5 rounded w-24 animate-pulse hidden md:block"></div>
            <div className="h-9 bg-white/5 rounded w-32 animate-pulse"></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 md:px-4">
          <div className="max-w-[1800px] mx-auto flex flex-col gap-6 pb-6">
            <SkeletonCategory />
            <div className="h-px w-full bg-white/5"></div>
            <SkeletonCategory />
          </div>
        </main>
      </div>
    );
  }

  const categoryIds = categories.map(c => `${CATEGORY_PREFIX}${c.id}`);

  return (
    <div className="min-h-screen bg-[#0c1220] flex flex-col">
      <header className="mx-3 mt-3 rounded-[14px] border border-blue-500/12 bg-[#111827]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(59,130,246,0.04)] h-16 flex items-center justify-between px-6 z-20">
        <div className="flex items-center">
          <img src="/logo.svg" alt="RangeDeck" width="180" height="20" />
        </div>
        <div className="flex items-center gap-3">
          <label className={buttonVariants({ variant: 'secondary' }) + ' hidden md:flex cursor-pointer'}>
            <Upload size={16} />
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <Button
            variant="secondary"
            className="hidden md:flex"
            onClick={() => {
              exportToJSON();

              const customRangesCount = rangeDefinitions.filter(r =>
                ranges[r.id]?.customName || Object.keys(ranges[r.id]?.hands || {}).length > 0
              ).length;

              trackRangeExported({
                total_ranges: rangeDefinitions.length,
                total_categories: categories.length,
                custom_ranges_count: customRangesCount,
              });
            }}
          >
            <Download size={16} />
            Export JSON
          </Button>
          <Button variant="primary" onClick={() => setEditingCategory({ id: '', name: '' })}>
            <Plus size={16} />
            New Category
          </Button>
          <div className="h-8 w-px bg-white/8 mx-1" />
          <Button variant="secondary" iconOnly onClick={() => setShowSettings(true)} aria-label="Open settings">
            <Settings size={18} className="text-slate-400" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 md:px-4" tabIndex={-1}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="mx-auto flex flex-col gap-2 pb-6">
              {categories.map((category) => {
                const categoryRanges = rangesByCategory[category.id] || [];
                const hasRanges = categoryRanges.length > 0;
                const isDropTarget = overCategoryId === category.id;

                return (
                  <SortableCategory
                    key={category.id}
                    id={`${CATEGORY_PREFIX}${category.id}`}
                    name={category.name}
                    rangeCount={categoryRanges.length}
                    hasRanges={hasRanges}
                    onEdit={() => setEditingCategory({ id: category.id, name: category.name })}
                    onDelete={() => handleDeleteCategoryClick(category.id)}
                    onAddRange={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                  >
                    <SortableContext
                      items={categoryRanges.map(r => r.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      {hasRanges ? (
                        <div className="overflow-x-auto py-1 pb-3 custom-scrollbar">
                          <div className="flex gap-3 snap-x items-stretch">
                            {categoryRanges.map(range => (
                              <SortableRangeCard
                                key={range.id}
                                id={range.id}
                                name={range.name}
                                rangeData={ranges[range.id] || { labels: [], hands: {} }}
                                onClick={() => handleSelectRange(range.id)}
                                onDelete={(e) => handleDeleteRangeClick(e, range.id)}
                                onRename={(newName) => setRangeName(range.id, newName)}
                              />
                            ))}
                            <DroppableZone
                              id={`category-drop-${category.id}`}
                              className={`range-card-placeholder flex-none snap-start flex flex-col items-center justify-center bg-transparent rounded-xl border-2 border-dashed transition-all ${
                                isDropTarget && activeId && !isCategory(activeId) && rangeDefinitions.find(r => r.id === activeId)?.categoryId !== category.id
                                  ? 'border-[#3b82f6] bg-[#3b82f6]/10 scale-105'
                                  : 'border-white/8 hover:border-blue-500/30 hover:bg-white/3 cursor-pointer'
                              }`}
                            >
                              <div 
                                className="flex flex-col items-center justify-center w-full h-full"
                                onClick={() => !activeId && setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                              >
                                {isDropTarget && activeId && !isCategory(activeId) && rangeDefinitions.find(r => r.id === activeId)?.categoryId !== category.id ? (
                                  <>
                                    <div className="size-12 rounded-full bg-[#3b82f6]/20 flex items-center justify-center mb-3">
                                      <Plus size={24} className="text-[#3b82f6]" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#3b82f6]">Drop to move here</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#3b82f6]/20 transition-colors">
                                      <Plus size={24} className="text-slate-400 group-hover:text-[#3b82f6]" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-400 group-hover:text-[#3b82f6]">Add Range</span>
                                  </>
                                )}
                              </div>
                            </DroppableZone>
                            <div className="flex-none w-px" aria-hidden="true" />
                          </div>
                        </div>
                      ) : (
                        <DroppableZone
                          id={`category-drop-${category.id}`}
                          className={`flex flex-col items-center justify-center py-10 bg-white/2 rounded-xl border border-dashed transition-all ${
                            isDropTarget && activeId && !isCategory(activeId)
                              ? 'border-[#3b82f6] bg-[#3b82f6]/10 ring-2 ring-[#3b82f6] scale-[1.02]'
                              : 'border-white/8'
                          }`}
                        >
                          <div className={`p-3 rounded-full mb-3 transition-colors ${
                            isDropTarget && activeId && !isCategory(activeId) ? 'bg-[#3b82f6]/20' : 'bg-white/5'
                          }`}>
                            <Spade size={24} className={`transition-colors ${
                              isDropTarget && activeId && !isCategory(activeId) ? 'text-[#3b82f6]' : 'text-slate-400'
                            }`} />
                          </div>
                          <h3 className={`text-sm font-semibold mb-1 transition-colors ${
                            isDropTarget && activeId && !isCategory(activeId) ? 'text-[#3b82f6]' : 'text-white'
                          }`}>
                            {isDropTarget && activeId && !isCategory(activeId) ? 'Drop here to move' : 'No ranges in this category'}
                          </h3>
                          <p className={`text-xs mb-4 transition-colors ${
                            isDropTarget && activeId && !isCategory(activeId) ? 'text-[#3b82f6]/70' : 'text-slate-400'
                          }`}>
                            {isDropTarget && activeId && !isCategory(activeId) 
                              ? 'Release to move range to this category' 
                              : 'Start by adding your first range or drag one here'}
                          </p>
                          <Button
                            variant="secondary"
                            onClick={() => setRangeModalState({ categoryId: category.id, categoryName: category.name })}
                            className={isDropTarget && activeId && !isCategory(activeId) ? 'bg-[#3b82f6]/30 pointer-events-none' : ''}
                          >
                            <Plus size={16} />
                            Add Range
                          </Button>
                        </DroppableZone>
                      )}
                    </SortableContext>
                  </SortableCategory>
                );
              })}

              {categories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="bg-white/5 p-4 rounded-full mb-4">
                    <Spade size={32} className="text-slate-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">No categories yet</h2>
                  <p className="text-slate-400 mb-6">Create your first category to start organizing your poker ranges</p>
                  <Button variant="primary" size="lg" onClick={() => setEditingCategory({ id: '', name: '' })}>
                    <Plus size={20} />
                    New Category
                  </Button>
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay 
            dropAnimation={{
              duration: 300,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
            style={{ cursor: 'grabbing' }}
          >
            {activeRange && (
              <div 
                className="shadow-2xl shadow-black/50 rounded-xl"
                style={{
                  transform: 'rotate(3deg) scale(1.03)',
                  opacity: 0.95,
                }}
              >
                <RangeCard
                  name={activeRange.name}
                  rangeData={ranges[activeRange.id] || { labels: [], hands: {} }}
                  onClick={() => {}}
                />
              </div>
            )}
            {activeCategoryData && (
              <div
                className="bg-[#0c1220]/95 rounded-lg px-4 py-3 shadow-2xl shadow-black/50 border border-[#3b82f6]"
                style={{
                  transform: 'rotate(2deg) scale(1.02)',
                  opacity: 0.95,
                  minWidth: '200px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#3b82f6]">
                    <Spade size={20} />
                  </div>
                  <span className="text-white font-bold">{activeCategoryData.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs font-medium text-slate-300">
                    {rangesByCategory[activeCategoryData.id]?.length || 0} Ranges
                  </span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      <Footer />

      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setEditingCategory({ id: '', name: '' })}
          className="size-14 bg-[#3b82f6] text-white rounded-full shadow-lg flex items-center justify-center"
          aria-label="Create new category"
        >
          <Plus size={24} aria-hidden="true" />
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

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
