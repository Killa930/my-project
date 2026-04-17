/*
 * CompareContext — управление списком сравнения авто
 *
 * Хранит id выбранных авто в localStorage (максимум 3).
 * Любой компонент может:
 * - Добавить/убрать авто: toggleCompare(carId)
 * - Проверить есть ли в списке: isInCompare(carId)
 * - Получить количество: compareIds.length
 * - Очистить: clearCompare()
 */

import { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "compare_cars";
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
    const [compareIds, setCompareIds] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    }, [compareIds]);

    const toggleCompare = (carId) => {
        setCompareIds((prev) => {
            if (prev.includes(carId)) {
                return prev.filter((id) => id !== carId);
            }
            if (prev.length >= MAX_COMPARE) {
                return [...prev.slice(1), carId]; // удаляем самое старое
            }
            return [...prev, carId];
        });
    };

    const isInCompare = (carId) => compareIds.includes(carId);
    const clearCompare = () => setCompareIds([]);
    const removeFromCompare = (carId) => setCompareIds((p) => p.filter((id) => id !== carId));

    return (
        <CompareContext.Provider value={{
            compareIds,
            toggleCompare,
            isInCompare,
            clearCompare,
            removeFromCompare,
            maxReached: compareIds.length >= MAX_COMPARE,
        }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error("useCompare must be used within CompareProvider");
    return ctx;
}
