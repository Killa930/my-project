/*
 * MainLayout — общая обёртка для всех страниц
 *
 * Содержит:
 * - Header (шапка с навигацией, логотипом, кнопками входа)
 * - <Outlet /> — сюда React Router вставляет текущую страницу
 * - Footer (подвал)
 *
 * <Outlet /> — специальный компонент React Router.
 * Он рендерит дочерний маршрут. Если URL = "/catalog",
 * то <Outlet /> покажет <CatalogPage />.
 */

import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    HeartIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
            {/* === HEADER === */}
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Логотип */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <span className="text-gray-900 font-black text-sm">
                                    CB
                                </span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-amber-500">Car</span>
                                <span className="text-white">Buy</span>
                            </span>
                        </Link>

                        {/* Навигация — десктоп */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                to="/catalog"
                                className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
                            >
                                Katalogs
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/cars/create"
                                        className="text-gray-300 hover:text-amber-500 transition-colors font-medium"
                                    >
                                        Pievienot auto
                                    </Link>
                                    <Link
                                        to="/favorites"
                                        className="text-gray-300 hover:text-amber-500 transition-colors"
                                    >
                                        <HeartIcon className="w-5 h-5" />
                                    </Link>

                                    {/* Dropdown пользователя */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors">
                                            <UserCircleIcon className="w-5 h-5" />
                                            <span className="font-medium">
                                                {user.name}
                                            </span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-lg"
                                            >
                                                Mans profils
                                            </Link>
                                            {user.role === "admin" && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                >
                                                    Administrācija
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
                                            >
                                                Iziet
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-white transition-colors font-medium"
                                    >
                                        Pieslēgties
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        Reģistrēties
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Мобильная кнопка меню */}
                        <button
                            className="md:hidden text-gray-300"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Мобильное меню */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-800 space-y-2">
                            <Link
                                to="/catalog"
                                className="block py-2 text-gray-300 hover:text-amber-500"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Katalogs
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        to="/cars/create"
                                        className="block py-2 text-gray-300 hover:text-amber-500"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        Pievienot auto
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block py-2 text-gray-300 hover:text-amber-500"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        Mans profils
                                    </Link>
                                    <Link
                                        to="/favorites"
                                        className="block py-2 text-gray-300 hover:text-amber-500"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        Izlase
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            className="block py-2 text-gray-300 hover:text-amber-500"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Administrācija
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block py-2 text-red-400"
                                    >
                                        Iziet
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block py-2 text-gray-300 hover:text-amber-500"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        Pieslēgties
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block py-2 text-amber-500"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                    >
                                        Reģistrēties
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* === КОНТЕНТ (сюда рендерится текущая страница) === */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* === FOOTER === */}
            <footer className="bg-gray-900 border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center">
                                    <span className="text-gray-900 font-black text-xs">
                                        CB
                                    </span>
                                </div>
                                <span className="text-lg font-bold">
                                    <span className="text-amber-500">Car</span>
                                    <span className="text-white">Buy</span>
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Lietotu automašīnu tirdzniecības platforma.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-3">
                                Navigācija
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/catalog"
                                    className="block text-gray-500 hover:text-gray-300 text-sm"
                                >
                                    Katalogs
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-gray-500 hover:text-gray-300 text-sm"
                                >
                                    Reģistrēties
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-3">
                                Kontakti
                            </h3>
                            <p className="text-gray-500 text-sm">
                                info@carbuy.lv
                            </p>
                            <p className="text-gray-500 text-sm">
                                +371 20 000 000
                            </p>
                            <p className="text-gray-500 text-sm">
                                Rīga, Latvija
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} CarBuy. Noslēguma
                            darbs.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
