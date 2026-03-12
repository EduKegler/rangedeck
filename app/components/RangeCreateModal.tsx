'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { trackRangeCreated } from '@/lib/analytics';
import Button from './button';

interface RangeCreateModalProps {
  categoryId: string;
  categoryName: string;
  onSave: (name: string, categoryId: string) => void;
  onClose: () => void;
}

export default function RangeCreateModal({ categoryId, categoryName, onSave, onClose }: RangeCreateModalProps) {
  const modalRef = useFocusTrap(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      const rangeName = name.trim();
      onSave(rangeName, categoryId);

      trackRangeCreated({
        range_name: rangeName,
        category: categoryName,
        method: 'from_scratch',
      });
    } else {
      setError('Please enter a range name');
    }
  };

  const handleChange = (value: string) => {
    setName(value);
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-[#0b1019]/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="range-create-modal-title"
          className="w-full max-w-[480px] bg-[#111827] border border-white/8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.05)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
            <h2 id="range-create-modal-title" className="text-xl font-bold text-white tracking-tight">New Range</h2>
            <Button variant="ghost" size="sm" iconOnly className="rounded-full" onClick={onClose} aria-label="Close dialog">
              <X size={24} aria-hidden="true" />
            </Button>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <label htmlFor="range-name-input" className="flex flex-col gap-2">
              <span className="text-white text-sm font-medium leading-normal">Range Name</span>
              <input
                id="range-name-input"
                type="text"
                value={name}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className={`w-full bg-[#0c1220] border rounded-lg h-12 px-4 text-white placeholder:text-slate-500 focus:outline-none transition-all text-sm ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-white/8 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                }`}
                placeholder="e.g., RFI 2.5x from UTG"
                aria-invalid={!!error}
                aria-describedby={error ? 'range-error' : undefined}
                autoFocus
              />
              {error && (
                <div id="range-error" className="flex items-center gap-2 text-red-400 text-sm" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
            </label>
          </div>
          <div className="px-6 py-4 bg-[#0c1220] border-t border-white/6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Range
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
