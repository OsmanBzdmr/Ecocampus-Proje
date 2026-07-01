import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = toast.type === 'success' ? 'bg-moss-50 border-moss-300' : 'bg-clay-50 border-clay-100';
  const textColor = toast.type === 'success' ? 'text-moss-700' : 'text-clay-600';
  const Icon = toast.type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${bgColor} dark:bg-[var(--bg-secondary)] dark:border-l-4 border-l-4 rounded-lg p-4 flex items-start gap-3 max-w-sm shadow-lg font-body`}>
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${textColor}`} />
        <p className={`${textColor} font-medium`}>{toast.message}</p>
        <button onClick={onClose} className={`${textColor} hover:opacity-70 flex-shrink-0`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
