/*
 * AuthContext — авторизация + таймер сессии
 *
 * Таймер: если пользователь неактивен 30 минут — автоматический выход.
 * Каждое действие (клик, скролл, нажатие клавиши) сбрасывает таймер.
 * За 1 минуту до истечения показывается предупреждение.
 */

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const SESSION_DURATION = 30 * 60 * 1000;  // 30 минут в миллисекундах
const WARNING_BEFORE = 60 * 1000;          // предупреждение за 1 минуту

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionWarning, setSessionWarning] = useState(false);
    const logoutTimerRef = useRef(null);
    const warningTimerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get("/me")
                .then((res) => { setUser(res.data); startSessionTimer(); })
                .catch(() => { localStorage.removeItem("token"); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

        return () => { clearTimers(); };
    }, []);

    // Сброс таймера при активности пользователя
    useEffect(() => {
        if (!user) return;

        const resetOnActivity = () => {
            if (sessionWarning) setSessionWarning(false);
            startSessionTimer();
        };

        window.addEventListener("click", resetOnActivity);
        window.addEventListener("keydown", resetOnActivity);
        window.addEventListener("scroll", resetOnActivity);

        return () => {
            window.removeEventListener("click", resetOnActivity);
            window.removeEventListener("keydown", resetOnActivity);
            window.removeEventListener("scroll", resetOnActivity);
        };
    }, [user, sessionWarning]);

    const clearTimers = () => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };

    const startSessionTimer = useCallback(() => {
        clearTimers();

        // Предупреждение за 1 минуту до конца
        warningTimerRef.current = setTimeout(() => {
            setSessionWarning(true);
        }, SESSION_DURATION - WARNING_BEFORE);

        // Автоматический выход
        logoutTimerRef.current = setTimeout(() => {
            performLogout();
        }, SESSION_DURATION);
    }, []);

    const performLogout = async () => {
        clearTimers();
        try { await api.post("/logout"); } catch {}
        localStorage.removeItem("token");
        setUser(null);
        setSessionWarning(false);
    };

    const login = async (email, password) => {
        const res = await api.post("/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        startSessionTimer();
        return res.data;
    };

    const register = async (data) => {
        const res = await api.post("/register", data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        startSessionTimer();
        return res.data;
    };

    const logout = async () => {
        await performLogout();
    };

    const extendSession = () => {
        setSessionWarning(false);
        startSessionTimer();
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}

            {/* Предупреждение о скором выходе */}
            {sessionWarning && (
                <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
                    <div className="bg-surface-secondary border border-border rounded-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-status-warningBg rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-content-primary mb-2">
                            Sesija beigsies
                        </h2>
                        <p className="text-content-secondary text-sm mb-6">
                            Jūsu sesija drīz beigsies neaktivitātes dēļ. Vai vēlaties turpināt?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={performLogout}
                                className="flex-1 bg-surface-tertiary hover:bg-border-hover text-content-primary py-2.5 rounded-lg font-medium transition-colors">
                                Iziet
                            </button>
                            <button onClick={extendSession}
                                className="flex-1 bg-accent hover:bg-accent-hover text-content-inverted py-2.5 rounded-lg font-bold transition-colors">
                                Turpināt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
