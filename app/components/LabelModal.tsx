'use client';

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { Label } from '../types/range';

interface LabelModalProps {
  label?: Label;
  onSave: (name: string, color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { color: '#ef4444', name: 'red' },
  { color: '#f97316', name: 'orange' },
  { color: '#f59e0b', name: 'amber' },
  { color: '#eab308', name: 'yellow' },
  { color: '#84cc16', name: 'lime' },
  { color: '#22c55e', name: 'green' },
  { color: '#10b981', name: 'emerald' },
  { color: '#14b8a6', name: 'teal' },
  { color: '#06b6d4', name: 'cyan' },
  { color: '#0ea5e9', name: 'sky' },
  { color: '#3b82f6', name: 'blue' },
  { color: '#6366f1', name: 'indigo' },
  { color: '#8b5cf6', name: 'violet' },
  { color: '#a855f7', name: 'purple' },
  { color: '#d946ef', name: 'fuchsia' },
  { color: '#ec4899', name: 'pink' },
  { color: '#f43f5e', name: 'rose' },
  { color: '#64748b', name: 'slate' },
];

export default function LabelModal({ label, onSave, onClose }: LabelModalProps) {
  const [name, setName] = useState(label?.name || '');
  const [color, setColor] = useState(label?.color || '#ef4444');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(label?.name || '');
    setColor(label?.color || '#ef4444');
    setError('');
  }, [label]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), color);
    } else {
      setError('Please enter a name for the label');
    }
  };

  const handleChange = (value: string) => {
    setName(value.slice(0, 20));
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
            <h2 className="text-xl font-bold text-white tracking-tight">
              {label ? 'Edit Label' : 'Create Label'}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <p className="text-[#90a7cb] text-sm font-normal leading-normal">
              Define a new color-coded label to categorize your hands in the grid.
            </p>
            <label className="flex flex-col gap-2">
              <span className="text-white text-sm font-medium leading-normal">Label Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                maxLength={20}
                className={`w-full bg-[#111822] border rounded-lg h-12 px-4 text-white placeholder:text-slate-500 focus:outline-none transition-all text-sm ${
                  error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-700 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]'
                }`}
                placeholder="e.g., Bluff, Value, Nut flush"
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </label>
            <div className="flex flex-col gap-3">
              <span className="text-white text-sm font-medium leading-normal">Select Color</span>
              <div className="grid grid-cols-6 gap-3">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setColor(preset.color)}
                    className="group relative"
                  >
                    <div 
                      className={`h-10 w-10 rounded-full transition-all hover:scale-105 ${
                        color === preset.color ? 'ring-offset-2 ring-offset-[#1a2332]' : ''
                      }`}
                      style={{ 
                        backgroundColor: preset.color,
                        boxShadow: color === preset.color 
                          ? `0 0 0 3px #1a2332, 0 0 0 6px ${preset.color}` 
                          : 'none'
                      }}
                    />
                    {color === preset.color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <Check size={18} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
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
              {label ? 'Save Label' : 'Create Label'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
