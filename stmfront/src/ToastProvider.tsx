import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

// Simple Toast provider + hook + UI using Tailwind + Framer Motion
// Usage:
// <ToastProvider>
//   <App />
// </ToastProvider>
// const { notify } = useToast();
// notify({ type: 'success', title: 'Saved', message: 'Your data was saved.' })

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message?: string;
  duration?: number; // ms
};

type ToastContextType = {
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

const genId = () => Math.random().toString(36).slice(2, 9);

export const ToastProvider: React.FC<{ children: React.ReactNode; maxToasts?: number }> = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((prev) => {
      const next = [{ id: genId(), ...toast }, ...prev].slice(0, maxToasts);
      return next;
    });
  }, [maxToasts]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      {/* Toast container portal-like (fixed) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <Info className="w-5 h-5" />,
};

const colors: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
  warning: "bg-yellow-50 border-yellow-200",
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const { id, type, title, message, duration = 4500 } = toast;
  const timer = useRef<number | null>(null);
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    timer.current = window.setTimeout(() => onClose(), duration);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [duration, isPaused, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`w-full rounded-lg border p-3 shadow-md ${colors[type]} flex items-start gap-3`}
    >
      <div className="pt-0.5">{icons[type]}</div>

      <div className="flex-1">
        {title && <div className="font-medium text-sm">{title}</div>}
        {message && <div className="text-xs mt-1 leading-snug text-gray-700">{message}</div>}
      </div>

      <button
        aria-label="close"
        onClick={onClose}
        className="ml-2 p-1 rounded hover:bg-gray-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Example usage component
export const DemoButtons: React.FC = () => {
  const { notify } = useToast();
  return (
    <div className="flex gap-2">
      <button
        className="btn btn-sm bg-green-600 text-white px-3 py-1 rounded"
        onClick={() => notify({ type: "success", title: "Saved", message: "Your changes were saved." })}
      >
        Success
      </button>

      <button
        className="btn btn-sm bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => notify({ type: "info", title: "Heads up", message: "Info message", duration: 3000 })}
      >
        Info
      </button>

      <button
        className="btn btn-sm bg-red-600 text-white px-3 py-1 rounded"
        onClick={() => notify({ type: "error", title: "Failed", message: "Something went wrong.", duration: 8000 })}
      >
        Error
      </button>
    </div>
  );
};

export default ToastProvider;
