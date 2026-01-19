'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RangesState, RangeData, Label, Category, RangeDefinition } from '../types/range';
import { DEFAULT_CATEGORIES, DEFAULT_RANGE_DEFINITIONS } from '../types/range';

const STORAGE_KEY = 'poker-ranges-data';

function generateLabelId(): string {
  return `label_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getInitialRanges(): RangesState {
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

export default function useRanges() {
  const [rangesState, setRangesState] = useState<RangesState>(getInitialRanges);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client-side hydration
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);

        if (data.ranges && typeof data.ranges === 'object') {
          const firstRange = Object.values(data.ranges)[0] as any;

          if (firstRange && !('labels' in firstRange)) {
            console.log('Migrating old format to new format...');
            const migratedRanges: RangesState['ranges'] = {};

            Object.entries(data.ranges).forEach(([rangeId, oldRangeData]: [string, any]) => {
              const labels: Label[] = [];
              const hands: { [hand: string]: string } = {};
              const labelMap = new Map<string, string>();

              Object.entries(oldRangeData).forEach(([hand, action]: [string, any]) => {
                if (action && typeof action === 'object' && 'color' in action && 'label' in action) {
                  const key = `${action.color}-${action.label}`;

                  if (!labelMap.has(key)) {
                    const labelId = generateLabelId();
                    labels.push({
                      id: labelId,
                      name: action.label,
                      color: action.color,
                    });
                    labelMap.set(key, labelId);
                  }

                  hands[hand] = labelMap.get(key)!;
                }
              });

              migratedRanges[rangeId] = { labels, hands };
            });

            setRangesState({
              ranges: migratedRanges,
              categories: [...DEFAULT_CATEGORIES],
              rangeDefinitions: [...DEFAULT_RANGE_DEFINITIONS],
            });
            setIsHydrated(true);
            return;
          }
        }

        // Ensure categories and rangeDefinitions exist
        if (!data.categories) {
          data.categories = [...DEFAULT_CATEGORIES];
        }
        if (!data.rangeDefinitions) {
          data.rangeDefinitions = [...DEFAULT_RANGE_DEFINITIONS];
        }

        setRangesState(data);
      } catch (e) {
        console.error('Failed to parse stored ranges:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rangesState));
    }
  }, [rangesState, isHydrated]);

  const getRangeData = useCallback((rangeId: string): RangeData => {
    const rangeData = rangesState.ranges[rangeId];

    // If range has no labels, auto-create and persist an Example label
    if (rangeData && rangeData.labels.length === 0) {
      const exampleLabelId = generateLabelId();
      const newRangeData = {
        ...rangeData,
        labels: [{
          id: exampleLabelId,
          name: 'Example',
          color: '#ef4444',
        }],
      };

      // Persist the Example label (preserve other state properties)
      setRangesState(prev => ({
        ...prev,
        ranges: {
          ...prev.ranges,
          [rangeId]: newRangeData,
        },
      }));

      return newRangeData;
    }

    return rangeData || { labels: [], hands: {}, customName: undefined };
  }, [rangesState]);

  const createLabel = useCallback((rangeId: string, name: string, color: string) => {
    const labelId = generateLabelId();
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };

      rangeData.labels = [...rangeData.labels, { id: labelId, name, color }];
      newRanges[rangeId] = rangeData;

      return { ...prev, ranges: newRanges };
    });
    return labelId;
  }, []);

  const updateLabel = useCallback((rangeId: string, labelId: string, name: string, color: string) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };

      rangeData.labels = rangeData.labels.map(label =>
        label.id === labelId ? { ...label, name, color } : label
      );

      newRanges[rangeId] = rangeData;

      return { ...prev, ranges: newRanges };
    });
  }, []);

  const deleteLabel = useCallback((rangeId: string, labelId: string) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };

      // Prevent deletion of last label
      if (rangeData.labels.length === 1) {
        return prev;
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

      return { ...prev, ranges: newRanges };
    });
  }, []);

  const setHandLabel = useCallback((rangeId: string, hand: string, labelId: string | null) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };
      const newHands = { ...rangeData.hands };

      if (labelId === null) {
        delete newHands[hand];
      } else {
        newHands[hand] = labelId;
      }

      rangeData.hands = newHands;
      newRanges[rangeId] = rangeData;

      return { ...prev, ranges: newRanges };
    });
  }, []);

  const setMultipleHandLabels = useCallback((rangeId: string, hands: string[], labelId: string | null) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
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

      return { ...prev, ranges: newRanges };
    });
  }, []);

  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(rangesState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'poker-ranges.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [rangesState]);

  const importFromJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Ensure categories and rangeDefinitions exist
        if (!data.categories) {
          data.categories = [...DEFAULT_CATEGORIES];
        }
        if (!data.rangeDefinitions) {
          data.rangeDefinitions = [...DEFAULT_RANGE_DEFINITIONS];
        }

        setRangesState(data);
      } catch (error) {
        console.error('Failed to import JSON:', error);
        alert('Failed to import file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }, []);

  const setRangeName = useCallback((rangeId: string, customName: string) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };
      rangeData.customName = customName;
      newRanges[rangeId] = rangeData;
      return { ...prev, ranges: newRanges };
    });
  }, []);

  const reorderLabel = useCallback((rangeId: string, labelId: string, direction: 'up' | 'down') => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      const rangeData = { ...newRanges[rangeId] };
      const labels = [...rangeData.labels];
      const index = labels.findIndex(l => l.id === labelId);

      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        [labels[index], labels[index - 1]] = [labels[index - 1], labels[index]];
      } else if (direction === 'down' && index < labels.length - 1) {
        [labels[index], labels[index + 1]] = [labels[index + 1], labels[index]];
      }

      rangeData.labels = labels;
      newRanges[rangeId] = rangeData;
      return { ...prev, ranges: newRanges };
    });
  }, []);

  const createCategory = useCallback((name: string) => {
    const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setRangesState(prev => ({
      ...prev,
      categories: [...(prev.categories || []), { id: categoryId, name }],
    }));
    return categoryId;
  }, []);

  const updateCategory = useCallback((categoryId: string, name: string) => {
    setRangesState(prev => ({
      ...prev,
      categories: (prev.categories || []).map(cat =>
        cat.id === categoryId ? { ...cat, name } : cat
      ),
    }));
  }, []);

  const reorderCategory = useCallback((categoryId: string, direction: 'up' | 'down') => {
    setRangesState(prev => {
      const categories = [...(prev.categories || [])];
      const index = categories.findIndex(c => c.id === categoryId);

      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
      } else if (direction === 'down' && index < categories.length - 1) {
        [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
      }

      return { ...prev, categories };
    });
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setRangesState(prev => {
      // Check if category has any ranges
      const hasRanges = (prev.rangeDefinitions || []).some(r => r.categoryId === categoryId);
      if (hasRanges) {
        alert('Cannot delete category with ranges. Delete all ranges first.');
        return prev;
      }

      return {
        ...prev,
        categories: (prev.categories || []).filter(c => c.id !== categoryId),
      };
    });
  }, []);

  const createRange = useCallback((name: string, categoryId: string) => {
    const rangeId = `range_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exampleLabelId = generateLabelId();

    setRangesState(prev => ({
      ...prev,
      rangeDefinitions: [...(prev.rangeDefinitions || []), { id: rangeId, name, categoryId }],
      ranges: {
        ...prev.ranges,
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
  }, []);

  const deleteRange = useCallback((rangeId: string) => {
    setRangesState(prev => {
      const newRanges = { ...prev.ranges };
      delete newRanges[rangeId];

      return {
        ...prev,
        ranges: newRanges,
        rangeDefinitions: (prev.rangeDefinitions || []).filter(r => r.id !== rangeId),
      };
    });
  }, []);

  const clearAllRanges = useCallback(() => {
    setRangesState(getInitialRanges());
  }, []);

  return useMemo(() => ({
    rangesState,
    getRangeData,
    createLabel,
    updateLabel,
    deleteLabel,
    setHandLabel,
    setMultipleHandLabels,
    setRangeName,
    reorderLabel,
    createCategory,
    updateCategory,
    reorderCategory,
    deleteCategory,
    createRange,
    deleteRange,
    exportToJSON,
    importFromJSON,
    clearAllRanges,
  }), [
    rangesState,
    getRangeData,
    createLabel,
    updateLabel,
    deleteLabel,
    setHandLabel,
    setMultipleHandLabels,
    setRangeName,
    reorderLabel,
    createCategory,
    updateCategory,
    reorderCategory,
    deleteCategory,
    createRange,
    deleteRange,
    exportToJSON,
    importFromJSON,
    clearAllRanges,
  ]);
}
