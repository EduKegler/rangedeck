'use client';

import { createContext, useContext, memo } from 'react';
import type { ReactNode } from 'react';
import useRanges from '../hooks/useRanges';

interface RangesContextType {
  rangesState: ReturnType<typeof useRanges>['rangesState'];
  getRangeData: ReturnType<typeof useRanges>['getRangeData'];
  createLabel: ReturnType<typeof useRanges>['createLabel'];
  updateLabel: ReturnType<typeof useRanges>['updateLabel'];
  deleteLabel: ReturnType<typeof useRanges>['deleteLabel'];
  setHandLabel: ReturnType<typeof useRanges>['setHandLabel'];
  setMultipleHandLabels: ReturnType<typeof useRanges>['setMultipleHandLabels'];
  setRangeName: ReturnType<typeof useRanges>['setRangeName'];
  reorderLabel: ReturnType<typeof useRanges>['reorderLabel'];
  createCategory: ReturnType<typeof useRanges>['createCategory'];
  updateCategory: ReturnType<typeof useRanges>['updateCategory'];
  reorderCategory: ReturnType<typeof useRanges>['reorderCategory'];
  deleteCategory: ReturnType<typeof useRanges>['deleteCategory'];
  createRange: ReturnType<typeof useRanges>['createRange'];
  deleteRange: ReturnType<typeof useRanges>['deleteRange'];
  exportToJSON: ReturnType<typeof useRanges>['exportToJSON'];
  importFromJSON: ReturnType<typeof useRanges>['importFromJSON'];
  clearAllRanges: ReturnType<typeof useRanges>['clearAllRanges'];
}

const RangesContext = createContext<RangesContextType | null>(null);

export const useRangesContext = () => {
  const context = useContext(RangesContext);
  if (!context) {
    throw new Error('useRangesContext must be used within RangesProvider');
  }
  return context;
};

interface RangesProviderProps {
  children: ReactNode;
}

export const RangesProvider = memo(({ children }: RangesProviderProps) => {
  const rangesData = useRanges();

  return (
    <RangesContext.Provider value={rangesData}>
      {children}
    </RangesContext.Provider>
  );
});
