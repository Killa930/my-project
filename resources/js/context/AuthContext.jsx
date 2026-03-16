/*
 * context/AuthContext.jsx — глобальное состояние авторизации
 *
 * Проблема: многим компонентам нужно знать, залогинен ли пользователь.
 * Шапка показывает кнопку "Войти" или имя пользователя.
 * Каталог показывает кнопку избранного только залогиненным.
 * Форма создания объявления доступна только авторизованным.
 *
 * Решение: Context — это "общее хранилище", доступное из любого компонента.
 * Вместо того чтобы передавать user через 10 уровней props,
 * любой компонент может вызвать useAuth() и получить данные.
 */

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// Создаём контекст (пустой "контейнер")
const AuthContext = createContext(null);

/*
 * AuthProvider — компонент-обёртка, который предоставляет данные всем дочерним.
 * Оборачивает всё приложение в app.jsx:
 * <AuthProvider> <App /> </AuthProvider>
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // текущий пользователь (или null)
    const [loading, setLoading] = useState(true); // загрузка (проверяем токен)

    /*
     * useEffect — выполняется один раз при загрузке приложения.
     * Проверяет: есть ли сохранённый токен? Если да — запрашивает у сервера
     * данные пользователя (GET /api/me). Если токен валидный — сохраняем
     * пользователя в state. Если нет — очищаем.
     */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get("/me")
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // === ФУНКЦИИ АВТОРИЗАЦИИ ===

    const login = async (email, password) => {
        const res = await api.post("/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (data) => {
        const res = await api.post("/register", data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {
            // Даже если запрос не прошёл — очищаем локально
        }
        localStorage.removeItem("token");
        setUser(null);
    };

    /*
     * value — данные, которые будут доступны через useAuth().
     * Любой компонент сможет вызвать:
     *   const { user, login, logout } = useAuth();
     */
    return (
        <AuthContext.Provider
            value={{ user, setUser, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/*
 * useAuth() — хук для доступа к авторизации из любого компонента.
 *
 * Пример использования:
 *   const { user, logout } = useAuth();
 *   if (user) { показываем имя } else { показываем кнопку "Войти" }
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
