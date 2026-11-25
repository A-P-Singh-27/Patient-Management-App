import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div
        className={`rounded-xl p-4 shadow-xl border flex items-start space-x-3 transition-all ${
          isSuccess
            ? 'bg-white border-emerald-200 text-slate-800'
            : isError
            ? 'bg-white border-rose-200 text-slate-800'
            : 'bg-white border-teal-200 text-slate-800'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-teal-600" />}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-900">{toast.title || (isSuccess ? 'Success' : 'Notice')}</p>
          <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
