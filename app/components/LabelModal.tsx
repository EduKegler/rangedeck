'use client';

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { Label } from '../types/range';
import Button from './button';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="w-full max-w-[480px] bg-[#111827] border border-white/8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {label ? 'Edit Label' : 'Create Label'}
            </h2>
            <Button variant="ghost" size="sm" iconOnly className="rounded-full" onClick={onClose} aria-label="Close dialog">
              <X size={24} aria-hidden="true" />
            </Button>
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
                className={`w-full bg-[#0c1220] border rounded-lg h-12 px-4 text-white placeholder:text-slate-500 focus:outline-none transition-all text-sm ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-white/8 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_rgba(59,130,246,0.15)]'
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
                        color === preset.color ? 'ring-offset-2 ring-offset-[#111827]' : ''
                      }`}
                      style={{ 
                        backgroundColor: preset.color,
                        boxShadow: color === preset.color 
                          ? `0 0 0 3px #111827, 0 0 0 6px ${preset.color}` 
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
          <div className="px-6 py-4 bg-[#0c1220] border-t border-white/6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {label ? 'Save Label' : 'Create Label'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
