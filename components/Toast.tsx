"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

/* ── Context ───────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue>({
    toast: () => { },
});

export const useToast = () => useContext(ToastContext);

/* ── Provider ──────────────────────────────────────────── */

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = nextId++;
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss after 3s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const dismiss = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    };

    const borders = {
        success: "border-emerald-500/30",
        error: "border-red-500/30",
        info: "border-blue-500/30",
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast container — bottom-right */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border ${borders[t.type]} shadow-xl animate-slide-in-right min-w-[280px] max-w-sm`}
                    >
                        {icons[t.type]}
                        <span className="text-sm text-zinc-800 dark:text-zinc-200 flex-1">
                            {t.message}
                        </span>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
