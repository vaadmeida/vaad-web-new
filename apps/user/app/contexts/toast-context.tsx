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
  warning: AlertTriangle
};

const toastColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-300',
    message: 'text-green-700 dark:text-green-400'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-300',
    message: 'text-red-700 dark:text-red-400'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-400'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-300',
    message: 'text-yellow-700 dark:text-yellow-400'
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Define getDefaultTitle first (before it's used)
  const getDefaultTitle = useCallback((type: string): string => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Notification';
    }
  }, []);

  // Define dismissToast second (before it's used in showToast)
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Now define showToast which uses both getDefaultTitle and dismissToast
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 5000;

    const newToast = {
      ...toast,
      id,
      title: toast.title || getDefaultTitle(toast.type)
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [getDefaultTitle, dismissToast]);

  // Define remaining functions
  const success = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'success', message, title, duration });
  }, [showToast]);

  const error = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'error', message, title, duration });
  }, [showToast]);

  const info = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'info', message, title, duration });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string, duration?: number) => {
    return showToast({ type: 'warning', message, title, duration });
  }, [showToast]);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{
      toasts,
      showToast,
      success,
      error,
      info,
      warning,
      dismissToast,
      dismissAllToasts
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toastIcons[toast.type];
            const colors = toastColors[toast.type];

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`${colors.bg} ${colors.border} border rounded-xl shadow-lg overflow-hidden pointer-events-auto`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${colors.title}`}>
                        {toast.title}
                      </p>
                      <p className={`text-sm mt-0.5 ${colors.message}`}>
                        {toast.message}
                      </p>
                      
                      {/* Action Button */}
                      {toast.action && (
                        <button
                          onClick={toast.action.onClick}
                          className={`mt-2 text-sm font-medium ${colors.icon} hover:underline`}
                        >
                          {toast.action.label}
                        </button>
                      )}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className={`flex-shrink-0 ${colors.message} hover:${colors.icon} transition-colors`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar (for auto-dismiss) */}
                  {toast.duration && toast.duration > 0 && (
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                      className={`h-1 mt-2 rounded-full ${colors.icon} opacity-50`}
                    />
                  )}
                </div>
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