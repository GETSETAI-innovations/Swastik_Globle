import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'success', duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let borderCol = 'border-emerald-500/30';
          let bgCol = 'bg-white text-slate-800 shadow-xl';
          let iconCol = 'text-emerald-600';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            borderCol = 'border-rose-500/30';
            iconCol = 'text-rose-600';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderCol = 'border-amber-500/30';
            iconCol = 'text-amber-600';
          } else if (toast.type === 'info') {
            Icon = Info;
            borderCol = 'border-blue-500/30';
            iconCol = 'text-blue-600';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderCol} ${bgCol} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 shadow-lg`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconCol}`} />
              <div className="flex-1 min-w-0">
                {toast.title && <div className="font-semibold text-sm leading-tight text-slate-900">{toast.title}</div>}
                {toast.message && <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</div>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
