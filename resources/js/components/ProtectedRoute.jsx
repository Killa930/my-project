/*
 * ProtectedRoute — защита маршрутов от неавторизованных пользователей
 *
 * Оборачивает маршруты, которые требуют авторизации.
 * Если user === null → перенаправляет на /login.
 * Если user есть → рендерит дочерний маршрут через <Outlet />.
 *
 * Navigate replace — заменяет текущую запись в истории,
 * чтобы кнопка "Назад" не зациклилась.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    // Пока проверяем токен — показываем загрузку
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
