'use client';

import { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type Toast } from '../stores/toastStore';

export function useToast() {
  const showToast = useToastStore((state) => state.showToast);
  return { showToast };
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <Check size={18} className="text-emerald-400" />,
    error: <X size={18} className="text-red-400" />,
    warning: <AlertCircle size={18} className="text-amber-400" />,
    info: <Info size={18} className="text-blue-400" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 bg-[#1a2332] border ${borders[toast.type]} rounded-lg shadow-xl min-w-[280px] max-w-[400px]`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm text-white flex-1">{toast.message}</p>
      <button 
        onClick={onRemove}
        className="shrink-0 text-slate-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
