'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import Button from './button';

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
          className="w-full max-w-[400px] bg-[#111827] border border-white/8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.05)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
            <h2 id="confirm-modal-title" className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <Button variant="ghost" size="sm" iconOnly className="rounded-full" onClick={onCancel} aria-label="Close dialog">
              <X size={24} aria-hidden="true" />
            </Button>
          </div>
          <div className="p-6 flex flex-col items-center gap-4">
            <div className={`p-3 rounded-full ${iconColors[variant]}`}>
              <AlertTriangle size={32} aria-hidden="true" />
            </div>
            <p id="confirm-modal-description" className="text-[#90a7cb] text-sm text-center leading-relaxed">
              {message}
            </p>
          </div>
          <div className="px-6 py-4 bg-[#0c1220] border-t border-white/6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={variant} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
