import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    HeartIcon,
    SunIcon,
    MoonIcon,
} from "@heroicons/react/24/outline";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-primary text-content-primary">
            {/* === HEADER === */}
            <header className="bg-surface-secondary border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Логотип */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <span className="text-content-inverted font-black text-sm">CB</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-accent">Car</span>
                                <span className="text-content-primary">Buy</span>
                            </span>
                        </Link>

                        {/* Навигация — десктоп */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/catalog" className="text-content-secondary hover:text-accent transition-colors font-medium">
                                Katalogs
                            </Link>

                            {/* Кнопка смены темы */}
                            <button
                                onClick={toggleTheme}
                                className="text-content-secondary hover:text-accent transition-colors p-2 rounded-lg hover:bg-surface-tertiary"
                                title={theme === "dark" ? "Gaišais režīms" : "Tumšais režīms"}
                            >
                                {theme === "dark" ? (
                                    <SunIcon className="w-5 h-5" />
                                ) : (
                                    <MoonIcon className="w-5 h-5" />
                                )}
                            </button>

                            {user ? (
                                <>
                                    <Link to="/cars/create" className="text-content-secondary hover:text-accent transition-colors font-medium">
                                        Pievienot auto
                                    </Link>
                                    <Link to="/favorites" className="text-content-secondary hover:text-accent transition-colors">
                                        <HeartIcon className="w-5 h-5" />
                                    </Link>

                                    <div className="relative group">
                                        <button className="flex items-center gap-2 text-content-secondary hover:text-accent transition-colors">
                                            <UserCircleIcon className="w-5 h-5" />
                                            <span className="font-medium">{user.name}</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-secondary rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-content-secondary hover:bg-surface-tertiary hover:text-content-primary rounded-t-lg">
                                                Mans profils
                                            </Link>
                                            {user.role === "admin" && (
                                                <Link to="/admin" className="block px-4 py-2.5 text-sm text-content-secondary hover:bg-surface-tertiary hover:text-content-primary">
                                                    Administrācija
                                                </Link>
                                            )}
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-status-danger hover:bg-surface-tertiary rounded-b-lg">
                                                Iziet
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-content-secondary hover:text-content-primary transition-colors font-medium">
                                        Pieslēgties
                                    </Link>
                                    <Link to="/register" className="bg-accent hover:bg-accent-hover text-content-inverted px-4 py-2 rounded-lg font-semibold transition-colors">
                                        Reģistrēties
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Мобильное меню */}
                        <div className="flex items-center gap-3 md:hidden">
                            <button onClick={toggleTheme} className="text-content-secondary p-2">
                                {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button>
                            <button className="text-content-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border space-y-2">
                            <Link to="/catalog" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Katalogs</Link>
                            {user ? (
                                <>
                                    <Link to="/cars/create" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Pievienot auto</Link>
                                    <Link to="/dashboard" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Mans profils</Link>
                                    <Link to="/favorites" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Izlase</Link>
                                    {user.role === "admin" && (
                                        <Link to="/admin" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Administrācija</Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block py-2 text-status-danger">Iziet</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Pieslēgties</Link>
                                    <Link to="/register" className="block py-2 text-accent" onClick={() => setMobileMenuOpen(false)}>Reģistrēties</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-surface-secondary border-t border-border py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
                                    <span className="text-content-inverted font-black text-xs">CB</span>
                                </div>
                                <span className="text-lg font-bold">
                                    <span className="text-accent">Car</span>
                                    <span className="text-content-primary">Buy</span>
                                </span>
                            </div>
                            <p className="text-content-muted text-sm">Lietotu automašīnu tirdzniecības platforma.</p>
                        </div>
                        <div>
                            <h3 className="text-content-primary font-semibold mb-3">Navigācija</h3>
                            <div className="space-y-2">
                                <Link to="/catalog" className="block text-content-muted hover:text-content-secondary text-sm">Katalogs</Link>
                                <Link to="/register" className="block text-content-muted hover:text-content-secondary text-sm">Reģistrēties</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-content-primary font-semibold mb-3">Kontakti</h3>
                            <p className="text-content-muted text-sm">info@carbuy.lv</p>
                            <p className="text-content-muted text-sm">+371 20 000 000</p>
                            <p className="text-content-muted text-sm">Rīga, Latvija</p>
                        </div>
                    </div>
                    <div className="border-t border-border mt-8 pt-6 text-center">
                        <p className="text-content-muted text-sm">© {new Date().getFullYear()} CarBuy. Noslēguma darbs.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
