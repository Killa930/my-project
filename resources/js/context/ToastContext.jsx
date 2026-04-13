/*
 * ToastContext — система уведомлений
 *
 * Вместо alert() вызываем toast.success("Текст") или toast.error("Текст").
 * Уведомление появляется в правом верхнем углу и исчезает через 3 секунды.
 */

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ToastContext = createContext(null);

const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-status-success" />,
    error: <XCircleIcon className="w-5 h-5 text-status-danger" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-status-warning" />,
    info: <InformationCircleIcon className="w-5 h-5 text-accent" />,
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Автоматически удаляем через duration
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        warning: (msg) => addToast(msg, "warning"),
        info: (msg) => addToast(msg, "info"),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Контейнер для уведомлений — фиксирован в правом верхнем углу */}
            <div className="fixed top-20 right-4 z-[100] space-y-3 w-80">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="bg-surface-secondary border border-border rounded-xl p-4 shadow-lg animate-slide-in flex items-start gap-3"
                        style={{ animation: "slideIn 0.3s ease-out" }}
                    >
                        <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
                        <p className="text-content-primary text-sm flex-1">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="shrink-0 text-content-muted hover:text-content-primary transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* CSS анимация */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
