import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimateIn from "../components/AnimateIn";

export default function RegisterPage() {
    const { register } = useAuth(); const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", phone: "" });
    const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => { e.preventDefault(); setErrors({}); setLoading(true);
        try { await register(form); navigate("/dashboard"); }
        catch (err) { setErrors(err.response?.data?.errors || { general: [err.response?.data?.message || "Kļūda"] }); } finally { setLoading(false); } };
    const ic = (f) => `w-full bg-surface-tertiary border ${errors[f] ? "border-status-danger" : "border-border"} text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <AnimateIn animation="fade"><h1 className="text-3xl font-bold text-content-primary text-center mb-8">Reģistrēties</h1></AnimateIn>
                <AnimateIn delay={150} animation="scale">
                    <div className="bg-surface-secondary border border-border rounded-xl p-8">
                        {errors.general && <div className="bg-status-dangerBg border border-status-danger/20 text-status-danger text-sm rounded-lg px-4 py-3 mb-6">{errors.general[0]}</div>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div><label className="block text-content-secondary text-sm mb-1.5">Vārds *</label><input type="text" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required className={ic("name")} placeholder="Tavs vārds" />{errors.name && <p className="text-status-danger text-xs mt-1">{errors.name[0]}</p>}</div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">E-pasts *</label><input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required className={ic("email")} placeholder="tavs@epasts.lv" />{errors.email && <p className="text-status-danger text-xs mt-1">{errors.email[0]}</p>}</div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Tālrunis</label><input type="tel" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} className={ic("phone")} placeholder="+371 20000000" /></div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Parole *</label><input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required className={ic("password")} placeholder="Min. 8 simboli" />{errors.password && <p className="text-status-danger text-xs mt-1">{errors.password[0]}</p>}</div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Apstiprināt paroli *</label><input type="password" value={form.password_confirmation} onChange={(e)=>setForm({...form,password_confirmation:e.target.value})} required className={ic("")} placeholder="Atkārto paroli" /></div>
                            <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3 rounded-lg font-bold transition-colors">{loading ? "Reģistrē..." : "Reģistrēties"}</button>
                        </form>
                        <p className="text-center text-content-muted text-sm mt-6">Jau ir konts? <Link to="/login" className="text-accent hover:text-accent-hover">Pieslēgties</Link></p>
                    </div>
                </AnimateIn>
            </div>
        </div>
    );
}
