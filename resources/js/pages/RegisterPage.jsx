import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({
                    general: [
                        err.response?.data?.message || "Reģistrācijas kļūda",
                    ],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-gray-800 border ${errors[field] ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Reģistrēties
                </h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                            {errors.general[0]}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                Vārds *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                                className={inputClass("name")}
                                placeholder="Tavs vārds"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                E-pasts *
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                                className={inputClass("email")}
                                placeholder="tavs@epasts.lv"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                Tālrunis
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                className={inputClass("phone")}
                                placeholder="+371 20000000"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                Parole *
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                required
                                className={inputClass("password")}
                                placeholder="Min. 8 simboli, lielie/mazie burti, cipars, simbols"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                Apstiprināt paroli *
                            </label>
                            <input
                                type="password"
                                value={form.password_confirmation}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password_confirmation: e.target.value,
                                    })
                                }
                                required
                                className={inputClass("password_confirmation")}
                                placeholder="Atkārto paroli"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 py-3 rounded-lg font-bold transition-colors"
                        >
                            {loading
                                ? "Notiek reģistrācija..."
                                : "Reģistrēties"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Jau ir konts?{" "}
                        <Link
                            to="/login"
                            className="text-amber-500 hover:text-amber-400"
                        >
                            Pieslēgties
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
