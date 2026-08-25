import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let borderClass = 'border-emerald-500/60 bg-[#091a18]/95 text-emerald-300';
        let Icon = CheckCircle2;

        if (toast.type === 'error') {
          borderClass = 'border-rose-500/60 bg-[#1f0d14]/95 text-rose-300';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/60 bg-[#1e1507]/95 text-amber-300';
          Icon = AlertCircle;
        } else if (toast.type === 'info') {
          borderClass = 'border-sky-500/60 bg-[#081524]/95 text-sky-300';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3 animate-fade-in transition-all ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
                  {toast.title}
                </div>
              )}
              <div className="text-xs font-medium text-slate-100 leading-snug">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-1 rounded-lg transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
