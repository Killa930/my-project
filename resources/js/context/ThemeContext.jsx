/*
 * context/ThemeContext.jsx — управление темой (светлая/тёмная)
 *
 * Хранит выбор пользователя в localStorage.
 * При первой загрузке проверяет:
 * 1) Есть ли сохранённый выбор в localStorage?
 * 2) Если нет — какая тема в системных настройках?
 *
 * Добавляет/убирает класс "dark" на <html> — 
 * это активирует CSS-переменные тёмной темы.
 */

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Проверяем localStorage
        const saved = localStorage.getItem("theme");
        if (saved) return saved;
        // Если нет — проверяем системные настройки
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        // Добавляем или убираем класс "dark" на <html>
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        // Сохраняем выбор
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
