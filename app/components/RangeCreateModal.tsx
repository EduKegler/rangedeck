'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { trackRangeCreated } from '@/lib/analytics';

interface RangeCreateModalProps {
  categoryId: string;
  categoryName: string;
  onSave: (name: string, categoryId: string) => void;
  onClose: () => void;
}

export default function RangeCreateModal({ categoryId, categoryName, onSave, onClose }: RangeCreateModalProps) {
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
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[480px] bg-[#1a2332] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white tracking-tight">New Range</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-white text-sm font-medium leading-normal">Range Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className={`w-full bg-[#111822] border rounded-lg h-12 px-4 text-white placeholder:text-slate-500 focus:outline-none transition-all text-sm ${
                  error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-700 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]'
                }`}
                placeholder="e.g., RFI 2.5x from UTG"
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </label>
          </div>
          <div className="px-6 py-4 bg-[#151c28] border-t border-slate-700/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#3b82f6] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              Save Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
