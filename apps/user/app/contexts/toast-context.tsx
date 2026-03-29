'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X 
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: { bg: 'bg-white dark:bg-neutral-900', border: 'border-green-500/30', icon: 'text-green-500', title: 'text-green-700 dark:text-green-400', message: 'text-neutral-600 dark:text-neutral-300', progress: 'bg-green-500' },
  error:   { bg: 'bg-white dark:bg-neutral-900', border: 'border-red-500/30',   icon: 'text-red-500',   title: 'text-red-700 dark:text-red-400',   message: 'text-neutral-600 dark:text-neutral-300', progress: 'bg-red-500' },
  info:    { bg: 'bg-white dark:bg-neutral-900', border: 'border-blue-500/30',  icon: 'text-blue-500',  title: 'text-blue-700 dark:text-blue-400',  message: 'text-neutral-600 dark:text-neutral-300', progress: 'bg-blue-500' },
  warning: { bg: 'bg-white dark:bg-neutral-900', border: 'border-amber-500/30', icon: 'text-amber-500', title: 'text-amber-700 dark:text-amber-400', message: 'text-neutral-600 dark:text-neutral-300', progress: 'bg-amber-500' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const getDefaultTitle = useCallback((type: string): string => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toastInput: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const duration = toastInput.duration ?? 5000;

    const newToast: Toast = {
      ...toastInput,
      id,
      title: toastInput.title || getDefaultTitle(toastInput.type),
    };

    setToasts((prev) => [newToast, ...prev]); // Newest on top

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }

    return id;
  }, [getDefaultTitle, dismissToast]);

  const success = useCallback((message: string, title?: string, duration?: number) =>
    showToast({ type: 'success', message, title, duration }), [showToast]);

  const error = useCallback((message: string, title?: string, duration?: number) =>
    showToast({ type: 'error', message, title, duration }), [showToast]);

  const info = useCallback((message: string, title?: string, duration?: number) =>
    showToast({ type: 'info', message, title, duration }), [showToast]);

  const warning = useCallback((message: string, title?: string, duration?: number) =>
    showToast({ type: 'warning', message, title, duration }), [showToast]);

  const dismissAllToasts = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{
      toasts, showToast, success, error, info, warning, dismissToast, dismissAllToasts,
    }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 z-[100] flex flex-col items-stretch md:items-end pointer-events-none md:max-w-md space-y-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = toastIcons[toast.type];
            const style = toastStyles[toast.type];

            return (
              <motion.div
                key={toast.id}
                drag="x"                    // Enable horizontal swipe
                dragConstraints={{ left: -200, right: 200 }}
                dragElastic={0.2}           // Nice bouncy feel while dragging
                onDragEnd={(_, info) => {
                  const offset = info.offset.x;
                  const velocity = info.velocity.x;

                  // Dismiss if swiped far enough or with enough velocity
                  if (Math.abs(offset) > 120 || Math.abs(velocity) > 500) {
                    dismissToast(toast.id);
                  }
                }}
                initial={{ opacity: 0, x: 80, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{
                  type: "tween",
                  duration: 0.28,
                  ease: [0.32, 0.72, 0, 1],
                }}
                whileDrag={{ 
                  scale: 0.97, 
                  opacity: 0.95 
                }}
                className={`
                  ${style.bg} ${style.border} border 
                  w-full md:w-auto min-w-[280px]
                  rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 
                  overflow-hidden pointer-events-auto backdrop-blur-xl
                `}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${style.icon}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      {toast.title && (
                        <p className={`font-semibold text-[15px] leading-tight ${style.title}`}>
                          {toast.title}
                        </p>
                      )}
                      <p className={`text-[14.5px] mt-1 leading-snug ${style.message}`}>
                        {toast.message}
                      </p>

                      {toast.action && (
                        <button
                          onClick={() => {
                            toast.action?.onClick();
                            dismissToast(toast.id);
                          }}
                          className={`mt-3 text-sm font-medium ${style.icon} hover:underline focus:outline-none`}
                        >
                          {toast.action.label}
                        </button>
                      )}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className="flex-shrink-0 p-1.5 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {toast.duration && toast.duration > 0 && (
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: toast.duration / 1000, ease: "linear" }}
                    className={`h-0.5 ${style.progress}`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}