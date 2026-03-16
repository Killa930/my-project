import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Nepareizs e-pasts vai parole"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Pieslēgties
                </h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                E-pasts
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                placeholder="tavs@epasts.lv"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1.5">
                                Parole
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
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 py-3 rounded-lg font-bold transition-colors"
                        >
                            {loading ? "Notiek ieeja..." : "Pieslēgties"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Nav konta?{" "}
                        <Link
                            to="/register"
                            className="text-amber-500 hover:text-amber-400"
                        >
                            Reģistrēties
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
