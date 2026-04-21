/*
 * EditProfilePage — страница редактирования профиля
 *
 * Позволяет изменить имя, телефон и пароль.
 * Email не меняется (он ключ авторизации).
 * Для смены пароля требуется указать текущий пароль.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { ArrowLeftIcon, UserCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function EditProfilePage() {
    const { user, setUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    // Данные профиля
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [profileLoading, setProfileLoading] = useState(false);

    // Данные смены пароля
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileErrors({});
        setProfileLoading(true);

        try {
            const res = await api.put("/profile", profileData);
            setUser(res.data.user);
            toast.success("Profils atjaunināts!");
        } catch (err) {
            if (err.response?.data?.errors) {
                setProfileErrors(err.response.data.errors);
            }
            toast.error("Kļūda atjauninot profilu");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordErrors({});

        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            setPasswordErrors({ new_password_confirmation: ["Paroles nesakrīt"] });
            return;
        }

        setPasswordLoading(true);
        try {
            await api.put("/profile", passwordData);
            toast.success("Parole nomainīta!");
            setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
        } catch (err) {
            if (err.response?.data?.errors) {
                setPasswordErrors(err.response.data.errors);
            }
            toast.error("Kļūda mainot paroli");
        } finally {
            setPasswordLoading(false);
        }
    };

    const ic = (errors, field) => `w-full bg-surface-tertiary border ${
        errors[field] ? "border-status-danger" : "border-border"
    } text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <Link to="/dashboard" className="flex items-center gap-2 text-content-secondary hover:text-content-primary mb-6 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4" /> Atpakaļ uz profilu
                </Link>
                <h1 className="text-2xl font-bold text-content-primary mb-6">Profila rediģēšana</h1>
            </AnimateIn>

            {/* Блок: основные данные */}
            <AnimateIn delay={100}>
                <div className="bg-surface-secondary border border-border rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center">
                            <UserCircleIcon className="w-6 h-6 text-accent" />
                        </div>
                        <h2 className="text-lg font-semibold text-content-primary">Personas dati</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                Vārds
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className={ic(profileErrors, "name")}
                                placeholder="Jūsu vārds"
                            />
                            {profileErrors.name && (
                                <p className="text-status-danger text-xs mt-1">{profileErrors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                E-pasts
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full bg-surface-tertiary border border-border text-content-muted rounded-lg px-4 py-3 cursor-not-allowed"
                            />
                            <p className="text-content-muted text-xs mt-1">
                                E-pastu nevar mainīt
                            </p>
                        </div>

                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                Tālrunis
                            </label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className={ic(profileErrors, "phone")}
                                placeholder="+371 20000000"
                            />
                            {profileErrors.phone && (
                                <p className="text-status-danger text-xs mt-1">{profileErrors.phone[0]}</p>
                            )}
                            <p className="text-content-muted text-xs mt-1">
                                Pircēji varēs sazināties ar jums
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3 rounded-lg font-semibold transition-colors"
                        >
                            {profileLoading ? "Saglabā..." : "Saglabāt izmaiņas"}
                        </button>
                    </form>
                </div>
            </AnimateIn>

            {/* Блок: смена пароля */}
            <AnimateIn delay={200}>
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center">
                            <KeyIcon className="w-6 h-6 text-accent" />
                        </div>
                        <h2 className="text-lg font-semibold text-content-primary">Parole</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                Pašreizējā parole
                            </label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                className={ic(passwordErrors, "current_password")}
                                placeholder="••••••••"
                            />
                            {passwordErrors.current_password && (
                                <p className="text-status-danger text-xs mt-1">{passwordErrors.current_password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                Jaunā parole
                            </label>
                            <input
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                className={ic(passwordErrors, "new_password")}
                                placeholder="Min. 8 simboli, lielais+mazais burts, cipars, simbols"
                            />
                            {passwordErrors.new_password && (
                                <p className="text-status-danger text-xs mt-1">{passwordErrors.new_password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">
                                Apstiprināt jauno paroli
                            </label>
                            <input
                                type="password"
                                value={passwordData.new_password_confirmation}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                className={ic(passwordErrors, "new_password_confirmation")}
                                placeholder="Atkārto paroli"
                            />
                            {passwordErrors.new_password_confirmation && (
                                <p className="text-status-danger text-xs mt-1">{passwordErrors.new_password_confirmation[0]}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading || !passwordData.current_password || !passwordData.new_password}
                            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3 rounded-lg font-semibold transition-colors"
                        >
                            {passwordLoading ? "Maina..." : "Nomainīt paroli"}
                        </button>
                    </form>
                </div>
            </AnimateIn>
        </div>
    );
}
