import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimateIn from "../components/AnimateIn";

export default function LoginPage() {
    const { login } = useAuth(); const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => { e.preventDefault(); setError(""); setLoading(true);
        try { await login(form.email, form.password); navigate("/dashboard"); }
        catch (err) { setError(err.response?.data?.message || "Nepareizs e-pasts vai parole"); } finally { setLoading(false); } };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <AnimateIn animation="fade"><h1 className="text-3xl font-bold text-content-primary text-center mb-8">Pieslēgties</h1></AnimateIn>
                <AnimateIn delay={150} animation="scale">
                    <div className="bg-surface-secondary border border-border rounded-xl p-8">
                        {error && <div className="bg-status-dangerBg border border-status-danger/20 text-status-danger text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div><label className="block text-content-secondary text-sm mb-1.5">E-pasts</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                                    className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="tavs@epasts.lv" /></div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Parole</label>
                                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                                    className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="••••••••" /></div>
                            <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3 rounded-lg font-bold transition-colors">
                                {loading ? "Notiek ieeja..." : "Pieslēgties"}</button>
                        </form>
                        <p className="text-center text-content-muted text-sm mt-6">Nav konta? <Link to="/register" className="text-accent hover:text-accent-hover">Reģistrēties</Link></p>
                    </div>
                </AnimateIn>
            </div>
        </div>
    );
}
