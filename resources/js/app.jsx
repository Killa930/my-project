/*
 * app.jsx — точка входа React-приложения
 *
 * Здесь настроен React Router — система навигации.
 * Каждый Route связывает URL-адрес с компонентом (страницей).
 *
 * Структура:
 * <BrowserRouter>  — включает навигацию по URL
 *   <AuthProvider> — оборачивает всё, чтобы авторизация была доступна везде
 *     <Routes>     — список всех маршрутов
 *       <Route>    — один маршрут (URL → компонент)
 */

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout (обёртка с шапкой и подвалом)
import MainLayout from "./layouts/MainLayout";

// Страницы
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CarDetailPage from "./pages/CarDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateCarPage from "./pages/CreateCarPage";
import EditCarPage from "./pages/EditCarPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminPage from "./pages/AdminPage";

// Компоненты-обёртки для защиты маршрутов
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/*
                     * MainLayout — общая обёртка (шапка + контент + подвал).
                     * Все дочерние Route будут отрисованы ВНУТРИ MainLayout.
                     * Это значит: шапка и подвал общие для всех страниц.
                     */}
                    <Route element={<MainLayout />}>
                        {/* Публичные страницы — доступны всем */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/cars/:id" element={<CarDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/*
                         * Защищённые маршруты — только для залогиненных.
                         * ProtectedRoute проверяет: есть ли user в AuthContext?
                         * Если нет — перенаправляет на /login.
                         */}
                        <Route element={<ProtectedRoute />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />
                            <Route
                                path="/cars/create"
                                element={<CreateCarPage />}
                            />
                            <Route
                                path="/cars/:id/edit"
                                element={<EditCarPage />}
                            />
                            <Route
                                path="/favorites"
                                element={<FavoritesPage />}
                            />
                        </Route>

                        {/*
                         * Админские маршруты — только для role='admin'.
                         * AdminRoute проверяет и авторизацию, и роль.
                         */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

/*
 * createRoot + render — подключает React к HTML-странице.
 * Ищет элемент с id="app" в blade-шаблоне Laravel
 * и рендерит в него наше React-приложение.
 */
const container = document.getElementById("app");
if (container) {
    createRoot(container).render(<App />);
}
