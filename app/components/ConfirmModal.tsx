'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useFocusTrap(true);

  const buttonColors = {
    danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
  };

  const iconColors = {
    danger: 'text-red-400 bg-red-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-[#0b1019]/60 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
          className="w-full max-w-[400px] bg-[#1a2332] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
            <h2 id="confirm-modal-title" className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              aria-label="Close dialog"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="p-6 flex flex-col items-center gap-4">
            <div className={`p-3 rounded-full ${iconColors[variant]}`}>
              <AlertTriangle size={32} aria-hidden="true" />
            </div>
            <p id="confirm-modal-description" className="text-[#90a7cb] text-sm text-center leading-relaxed">
              {message}
            </p>
          </div>
          <div className="px-6 py-4 bg-[#151c28] border-t border-slate-700/50 flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {cancelLabel}
            </button>
            <button 
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors shadow-lg ${buttonColors[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
