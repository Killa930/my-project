import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { CompareProvider } from "./context/CompareContext";

import MainLayout from "./layouts/MainLayout";
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
import TransactionsPage from "./pages/TransactionsPage";
import SellPage from "./pages/SellPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import ComparePage from "./pages/ComparePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <CompareProvider>
                        <AuthProvider>
                            <Routes>
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/catalog" element={<CatalogPage />} />
                                    <Route path="/cars/:id" element={<CarDetailPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/sell" element={<SellPage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/seller/:id" element={<SellerProfilePage />} />
                                    <Route path="/compare" element={<ComparePage />} />

                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/dashboard" element={<DashboardPage />} />
                                        <Route path="/cars/create" element={<CreateCarPage />} />
                                        <Route path="/cars/:id/edit" element={<EditCarPage />} />
                                        <Route path="/favorites" element={<FavoritesPage />} />
                                        <Route path="/transactions" element={<TransactionsPage />} />
                                    </Route>

                                    <Route element={<AdminRoute />}>
                                        <Route path="/admin" element={<AdminPage />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </AuthProvider>
                    </CompareProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById("app");
if (container) createRoot(container).render(<App />);
