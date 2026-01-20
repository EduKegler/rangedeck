'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RangesState, RangeData } from '../types/range';
import { DEFAULT_CATEGORIES, DEFAULT_RANGE_DEFINITIONS } from '../types/range';

export const RANGES_STORAGE_KEY = 'rangedeck-ranges';

function generateLabelId(): string {
  return `label_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getInitialRanges(): RangesState {
  const ranges: RangesState['ranges'] = {};

  DEFAULT_RANGE_DEFINITIONS.forEach(def => {
    const exampleLabelId = generateLabelId();
    ranges[def.id] = {
      labels: [{
        id: exampleLabelId,
        name: 'Example',
        color: '#ef4444',
      }],
      hands: {},
    };
  });

  return {
    ranges,
    categories: [...DEFAULT_CATEGORIES],
    rangeDefinitions: [...DEFAULT_RANGE_DEFINITIONS],
  };
}

interface RangesActions {
  getRangeData: (rangeId: string) => RangeData;
  ensureRangeHasLabel: (rangeId: string) => void;
  createLabel: (rangeId: string, name: string, color: string) => string;
  updateLabel: (rangeId: string, labelId: string, name: string, color: string) => void;
  deleteLabel: (rangeId: string, labelId: string) => void;
  setHandLabel: (rangeId: string, hand: string, labelId: string | null) => void;
  setMultipleHandLabels: (rangeId: string, hands: string[], labelId: string | null) => void;
  setRangeName: (rangeId: string, customName: string) => void;
  reorderLabel: (rangeId: string, labelId: string, direction: 'up' | 'down') => void;
  createCategory: (name: string) => string;
  updateCategory: (categoryId: string, name: string) => void;
  reorderCategory: (categoryId: string, direction: 'up' | 'down') => void;
  reorderCategoryByIndex: (fromIndex: number, toIndex: number) => void;
  deleteCategory: (categoryId: string) => boolean;
  createRange: (name: string, categoryId: string) => string;
  deleteRange: (rangeId: string) => void;
  reorderRange: (rangeId: string, targetIndex: number) => void;
  moveRangeToCategory: (rangeId: string, newCategoryId: string) => void;
  exportToJSON: () => void;
  importFromJSON: (file: File, onSuccess?: () => void, onError?: (error: string) => void) => void;
  clearAllRanges: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

type RangesStore = RangesState & RangesActions;

export const useRangesStore = create<RangesStore>()(
  persist(
    (set, get) => ({
      ...getInitialRanges(),

      getRangeData: (rangeId: string): RangeData => {
        const state = get();
        const rangeData = state.ranges[rangeId];
        return rangeData || { labels: [], hands: {}, customName: undefined };
      },

      ensureRangeHasLabel: (rangeId: string) => {
        const state = get();
        const rangeData = state.ranges[rangeId];

        if (rangeData && rangeData.labels.length === 0) {
          const exampleLabelId = generateLabelId();
          set({
            ranges: {
              ...state.ranges,
              [rangeId]: {
                ...rangeData,
                labels: [{
                  id: exampleLabelId,
                  name: 'Example',
                  color: '#ef4444',
                }],
              },
            },
          });
        }
      },

      createLabel: (rangeId: string, name: string, color: string) => {
        const labelId = generateLabelId();
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };

          rangeData.labels = [...rangeData.labels, { id: labelId, name, color }];
          newRanges[rangeId] = rangeData;

          return { ranges: newRanges };
        });
        return labelId;
      },

      updateLabel: (rangeId: string, labelId: string, name: string, color: string) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };

          rangeData.labels = rangeData.labels.map(label =>
            label.id === labelId ? { ...label, name, color } : label
          );

          newRanges[rangeId] = rangeData;

          return { ranges: newRanges };
        });
      },

      deleteLabel: (rangeId: string, labelId: string) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };

          if (rangeData.labels.length === 1) {
            return state;
          }

          rangeData.labels = rangeData.labels.filter(label => label.id !== labelId);

          const newHands: { [hand: string]: string } = {};
          Object.entries(rangeData.hands).forEach(([hand, handLabelId]) => {
            if (handLabelId !== labelId) {
              newHands[hand] = handLabelId;
            }
          });
          rangeData.hands = newHands;

          newRanges[rangeId] = rangeData;

          return { ranges: newRanges };
        });
      },

      setHandLabel: (rangeId: string, hand: string, labelId: string | null) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };
          const newHands = { ...rangeData.hands };

          if (labelId === null) {
            delete newHands[hand];
          } else {
            newHands[hand] = labelId;
          }

          rangeData.hands = newHands;
          newRanges[rangeId] = rangeData;

          return { ranges: newRanges };
        });
      },

      setMultipleHandLabels: (rangeId: string, hands: string[], labelId: string | null) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };
          const newHands = { ...rangeData.hands };

          hands.forEach(hand => {
            if (labelId === null) {
              delete newHands[hand];
            } else {
              newHands[hand] = labelId;
            }
          });

          rangeData.hands = newHands;
          newRanges[rangeId] = rangeData;

          return { ranges: newRanges };
        });
      },

      setRangeName: (rangeId: string, customName: string) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };
          rangeData.customName = customName;
          newRanges[rangeId] = rangeData;
          return { ranges: newRanges };
        });
      },

      reorderLabel: (rangeId: string, labelId: string, direction: 'up' | 'down') => {
        set((state) => {
          const newRanges = { ...state.ranges };
          const rangeData = { ...newRanges[rangeId] };
          const labels = [...rangeData.labels];
          const index = labels.findIndex(l => l.id === labelId);

          if (index === -1) return state;

          if (direction === 'up' && index > 0) {
            [labels[index], labels[index - 1]] = [labels[index - 1], labels[index]];
          } else if (direction === 'down' && index < labels.length - 1) {
            [labels[index], labels[index + 1]] = [labels[index + 1], labels[index]];
          }

          rangeData.labels = labels;
          newRanges[rangeId] = rangeData;
          return { ranges: newRanges };
        });
      },

      createCategory: (name: string) => {
        const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          categories: [{ id: categoryId, name }, ...(state.categories || [])],
        }));
        return categoryId;
      },

      updateCategory: (categoryId: string, name: string) => {
        set((state) => ({
          categories: (state.categories || []).map(cat =>
            cat.id === categoryId ? { ...cat, name } : cat
          ),
        }));
      },

      reorderCategory: (categoryId: string, direction: 'up' | 'down') => {
        set((state) => {
          const categories = [...(state.categories || [])];
          const index = categories.findIndex(c => c.id === categoryId);

          if (index === -1) return state;

          if (direction === 'up' && index > 0) {
            [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
          } else if (direction === 'down' && index < categories.length - 1) {
            [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
          }

          return { categories };
        });
      },

      reorderCategoryByIndex: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const categories = [...(state.categories || [])];
          if (fromIndex === toIndex) return state;
          
          const [removed] = categories.splice(fromIndex, 1);
          categories.splice(toIndex, 0, removed);
          
          return { categories };
        });
      },

      deleteCategory: (categoryId: string): boolean => {
        const state = get();
        const hasRanges = (state.rangeDefinitions || []).some(r => r.categoryId === categoryId);
        if (hasRanges) {
          return false;
        }
        set({
          categories: (state.categories || []).filter(c => c.id !== categoryId),
        });
        return true;
      },

      createRange: (name: string, categoryId: string) => {
        const rangeId = `range_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const exampleLabelId = generateLabelId();

        set((state) => ({
          rangeDefinitions: [...(state.rangeDefinitions || []), { id: rangeId, name, categoryId }],
          ranges: {
            ...state.ranges,
            [rangeId]: {
              labels: [{
                id: exampleLabelId,
                name: 'Example',
                color: '#ef4444',
              }],
              hands: {},
            },
          },
        }));
        return rangeId;
      },

      deleteRange: (rangeId: string) => {
        set((state) => {
          const newRanges = { ...state.ranges };
          delete newRanges[rangeId];

          return {
            ranges: newRanges,
            rangeDefinitions: (state.rangeDefinitions || []).filter(r => r.id !== rangeId),
          };
        });
      },

      reorderRange: (rangeId: string, targetIndex: number) => {
        set((state) => {
          const rangeDefinitions = [...(state.rangeDefinitions || [])];
          const currentIndex = rangeDefinitions.findIndex(r => r.id === rangeId);
          
          if (currentIndex === -1 || currentIndex === targetIndex) return state;
          
          const [removed] = rangeDefinitions.splice(currentIndex, 1);
          rangeDefinitions.splice(targetIndex, 0, removed);
          
          return { rangeDefinitions };
        });
      },

      moveRangeToCategory: (rangeId: string, newCategoryId: string) => {
        set((state) => {
          const rangeDefinitions = (state.rangeDefinitions || []).map(r =>
            r.id === rangeId ? { ...r, categoryId: newCategoryId } : r
          );
          return { rangeDefinitions };
        });
      },

      exportToJSON: () => {
        const state = get();
        const exportData: RangesState = {
          ranges: state.ranges,
          categories: state.categories,
          rangeDefinitions: state.rangeDefinitions,
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rangedeck-ranges.json';
        link.click();
        URL.revokeObjectURL(url);
      },

      importFromJSON: (file: File, onSuccess?: () => void, onError?: (error: string) => void) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);

            const newCategories = data.categories || [...DEFAULT_CATEGORIES];
            const newRangeDefinitions = data.rangeDefinitions || [...DEFAULT_RANGE_DEFINITIONS];
            const newRanges = data.ranges || {};

            set({
              ranges: newRanges,
              categories: newCategories,
              rangeDefinitions: newRangeDefinitions,
            });
            
            onSuccess?.();
          } catch (error) {
            console.error('Failed to import JSON:', error);
            onError?.('Failed to import file. Please check the format.');
          }
        };
        reader.readAsText(file);
      },

      clearAllRanges: () => {
        const initial = getInitialRanges();
        set({
          ranges: initial.ranges,
          categories: initial.categories,
          rangeDefinitions: initial.rangeDefinitions,
        });
      },
      
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: RANGES_STORAGE_KEY,
      partialize: (state) => ({
        ranges: state.ranges,
        categories: state.categories,
        rangeDefinitions: state.rangeDefinitions,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
