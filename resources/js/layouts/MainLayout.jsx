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
    ArrowRightStartOnRectangleIcon,
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

                        {/* Десктоп навигация */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/catalog" className="text-content-secondary hover:text-accent transition-colors font-medium">Katalogs</Link>
                            <Link to="/sell" className="text-content-secondary hover:text-accent transition-colors font-medium">Pārdot auto</Link>
                            <Link to="/about" className="text-content-secondary hover:text-accent transition-colors font-medium">Par mums</Link>
                            <Link to="/contact" className="text-content-secondary hover:text-accent transition-colors font-medium">Kontakti</Link>

                            <button onClick={toggleTheme} className="text-content-secondary hover:text-accent transition-colors p-2 rounded-lg hover:bg-surface-tertiary"
                                title={theme === "dark" ? "Gaišais režīms" : "Tumšais režīms"}>
                                {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button>

                            {user ? (
    <>
        <Link to="/favorites" className="text-content-secondary hover:text-accent transition-colors">
            <HeartIcon className="w-5 h-5" />
        </Link>

        {/* Имя — ссылка на профиль */}
        <Link to="/dashboard" className="flex items-center gap-2 text-content-secondary hover:text-accent transition-colors">
            <UserCircleIcon className="w-5 h-5" />
            <span className="font-medium">{user.name}</span>
        </Link>

        {/* Кнопка выхода */}
        <button onClick={handleLogout} className="text-content-secondary hover:text-status-danger transition-colors p-2 rounded-lg hover:bg-surface-tertiary" title="Iziet">
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
        </button>
    </>
) : (
    <div className="flex items-center gap-3">
        <Link to="/login" className="text-content-secondary hover:text-content-primary transition-colors font-medium">Pieslēgties</Link>
        <Link to="/register" className="bg-accent hover:bg-accent-hover text-content-inverted px-4 py-2 rounded-lg font-semibold transition-colors">Reģistrēties</Link>
    </div>
)}
                        </nav>

                        {/* Мобильное */}
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
                            <Link to="/sell" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Pārdot auto</Link>
                            <Link to="/about" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Par mums</Link>
                            <Link to="/contact" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Kontakti</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Mans profils</Link>
                                    <Link to="/transactions" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Darījumi</Link>
                                    <Link to="/cars/create" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Pievienot sludinājumu</Link>
                                    <Link to="/favorites" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Izlase</Link>
                                    {user.role === "admin" && (
                                        <Link to="/admin" className="block py-2 text-content-secondary hover:text-accent" onClick={() => setMobileMenuOpen(false)}>Administrācija</Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 py-2 text-status-danger">
                                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" /> Iziet
                                    </button>
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

            <main className="flex-1"><Outlet /></main>

            <footer className="bg-surface-secondary border-t border-border py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center"><span className="text-content-inverted font-black text-xs">CB</span></div>
                                <span className="text-lg font-bold"><span className="text-accent">Car</span><span className="text-content-primary">Buy</span></span>
                            </div>
                            <p className="text-content-muted text-sm">Lietotu automašīnu tirdzniecības platforma.</p>
                        </div>
                        <div>
                            <h3 className="text-content-primary font-semibold mb-3">Navigācija</h3>
                            <div className="space-y-2">
                                <Link to="/catalog" className="block text-content-muted hover:text-content-secondary text-sm">Katalogs</Link>
                                <Link to="/sell" className="block text-content-muted hover:text-content-secondary text-sm">Pārdot auto</Link>
                                <Link to="/about" className="block text-content-muted hover:text-content-secondary text-sm">Par mums</Link>
                                <Link to="/contact" className="block text-content-muted hover:text-content-secondary text-sm">Kontakti</Link>
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
