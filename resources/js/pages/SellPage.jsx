import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PhotoIcon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import imageCompression from "browser-image-compression";

export default function SellPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [form, setForm] = useState({
        name: "", surname: "", phone: "", email: "",
        manufacturer_id: "", car_model_id: "", year: "", price: "", mileage: "",
        fuel_type: "", body_type: "", transmission: "", engine_volume: "",
        color: "", description: "", images: [],
    });

    useEffect(() => {
        api.get("/manufacturers").then((res) => setManufacturers(Array.isArray(res.data) ? res.data : []));
    }, []);

    useEffect(() => {
        if (form.manufacturer_id) { api.get(`/manufacturers/${form.manufacturer_id}/models`).then((res) => setModels(res.data)); }
        else { setModels([]); }
    }, [form.manufacturer_id]);

    const handleChange = (k, v) => {
        setForm((p) => { const u = { ...p, [k]: v }; if (k === "manufacturer_id") u.car_model_id = ""; return u; });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setForm((p) => ({ ...p, images: [...p.images, ...files] }));
        files.forEach((f) => { const r = new FileReader(); r.onloadend = () => { setImagePreviews((p) => [...p, { file: f, url: r.result }]); }; r.readAsDataURL(f); });
    };

    const removeImage = (i) => {
        setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
        setImagePreviews((p) => p.filter((_, idx) => idx !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { setShowAuthModal(true); return; }

        setErrors({}); setLoading(true);
        const fd = new FormData();
        fd.append("car_model_id", form.car_model_id);
        fd.append("year", form.year);
        fd.append("price", form.price);
        fd.append("mileage", form.mileage);
        fd.append("fuel_type", form.fuel_type);
        fd.append("body_type", form.body_type);
        fd.append("transmission", form.transmission);
        if (form.engine_volume) fd.append("engine_volume", form.engine_volume);
        fd.append("color", form.color);
if (form.description) fd.append("description", form.description);

// Сжимаем фотки перед отправкой: 5 МБ → ~300 KB
for (const f of form.images) {
    const compressed = await imageCompression(f, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
    });
    fd.append("images[]", compressed);
}

try {
            const res = await api.post("/cars", fd, { headers: { "Content-Type": "multipart/form-data" } });
            navigate(`/cars/${res.data.id}`);
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        } finally { setLoading(false); }
    };

    const ic = (f) => `w-full bg-surface-tertiary border ${errors[f] ? "border-status-danger" : "border-border"} text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-content-primary">Pārdod savu auto</h1>
                <p className="text-content-secondary mt-2">
                    {user
                        ? "Aizpildiet formu un jūsu sludinājums tiks publicēts platformā"
                        : "Aizpildiet formu — lai publicētu, būs nepieciešams izveidot kontu"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-secondary border border-border rounded-xl p-6 sm:p-8 space-y-8">

                {/* === КОНТАКТЫ — ТОЛЬКО ДЛЯ НЕЗАЛОГИНЕННЫХ === */}
                {!user && (
                    <div>
                        <h2 className="text-content-primary font-semibold text-lg mb-4">Kontaktinformācija</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-content-secondary text-sm mb-1.5">Vārds *</label>
                                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={ic("name")} placeholder="Jānis" required />
                            </div>
                            <div>
                                <label className="block text-content-secondary text-sm mb-1.5">Uzvārds *</label>
                                <input type="text" value={form.surname} onChange={(e) => handleChange("surname", e.target.value)} className={ic("surname")} placeholder="Bērziņš" required />
                            </div>
                            <div>
                                <label className="block text-content-secondary text-sm mb-1.5">Tālrunis *</label>
                                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={ic("phone")} placeholder="+371 20000000" required />
                            </div>
                            <div>
                                <label className="block text-content-secondary text-sm mb-1.5">E-pasts *</label>
                                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={ic("email")} placeholder="janis@epasts.lv" required />
                            </div>
                        </div>
                    </div>
                )}

                {/* Если залогинен — показываем приветствие */}
                {user && (
                    <div className="flex items-center gap-3 bg-surface-tertiary rounded-lg p-4">
                        <div className="w-10 h-10 bg-accent-subtle rounded-full flex items-center justify-center">
                            <span className="text-accent font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="text-content-primary font-medium">{user.name}</p>
                            <p className="text-content-muted text-sm">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* === ДАННЫЕ АВТО === */}
                <div>
                    <h2 className="text-content-primary font-semibold text-lg mb-4">Automašīnas dati</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">Ražotājs *</label>
                            <select value={form.manufacturer_id} onChange={(e) => handleChange("manufacturer_id", e.target.value)} className={ic("manufacturer_id")} required>
                                <option value="">Izvēlieties</option>
                                {manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">Modelis *</label>
                            <select value={form.car_model_id} onChange={(e) => handleChange("car_model_id", e.target.value)} className={ic("car_model_id")} disabled={!form.manufacturer_id} required>
                                <option value="">Izvēlieties</option>
                                {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-content-secondary text-sm mb-1.5">Gads *</label>
                            <input type="number" value={form.year} onChange={(e) => handleChange("year", e.target.value)} className={ic("year")} placeholder="2020" required /></div>
                        <div><label className="block text-content-secondary text-sm mb-1.5">Cena (€) *</label>
                            <input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className={ic("price")} placeholder="15000" required /></div>
                        <div><label className="block text-content-secondary text-sm mb-1.5">Nobraukums (km) *</label>
                            <input type="number" value={form.mileage} onChange={(e) => handleChange("mileage", e.target.value)} className={ic("mileage")} placeholder="50000" required /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div><label className="block text-content-secondary text-sm mb-1.5">Dzinējs *</label>
                            <select value={form.fuel_type} onChange={(e) => handleChange("fuel_type", e.target.value)} className={ic("fuel_type")} required>
                                <option value="">Izvēlieties</option><option value="petrol">Benzīns</option><option value="diesel">Dīzelis</option><option value="electric">Elektriskais</option><option value="hybrid">Hibrīds</option><option value="petrol_lpg">Benz./gāze</option></select></div>
                        <div><label className="block text-content-secondary text-sm mb-1.5">Virsbūve *</label>
                            <select value={form.body_type} onChange={(e) => handleChange("body_type", e.target.value)} className={ic("body_type")} required>
                                <option value="">Izvēlieties</option><option value="sedan">Sedans</option><option value="hatchback">Hečbeks</option><option value="wagon">Universāls</option><option value="suv">Apvidus</option><option value="coupe">Kupeja</option><option value="cabriolet">Kabriolets</option><option value="minivan">Minivens</option><option value="pickup">Pikaps</option></select></div>
                        <div><label className="block text-content-secondary text-sm mb-1.5">Ātrumkārba *</label>
                            <select value={form.transmission} onChange={(e) => handleChange("transmission", e.target.value)} className={ic("transmission")} required>
                                <option value="">Izvēlieties</option><option value="manual">Manuāla</option><option value="automatic">Automāts</option></select></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div><label className="block text-content-secondary text-sm mb-1.5">Tilpums (L)</label>
                            <input type="number" step="0.1" value={form.engine_volume} onChange={(e) => handleChange("engine_volume", e.target.value)} className={ic("")} placeholder="2.0" /></div>
                        <div><label className="block text-content-secondary text-sm mb-1.5">Krāsa *</label>
                            <input type="text" value={form.color} onChange={(e) => handleChange("color", e.target.value)} className={ic("color")} placeholder="Melns" required /></div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-content-secondary text-sm mb-1.5">Apraksts</label>
                        <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className={ic("")} rows="4" placeholder="Automašīnas apraksts..." />
                    </div>

                    {/* Фото */}
                    <div>
                        <label className="block text-content-secondary text-sm mb-1.5">Fotoattēli {user ? "* (pirmais = galvenais)" : "(neobligāti)"}</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                            {imagePreviews.map((p, i) => (
                                <div key={i} className="relative aspect-square bg-surface-tertiary rounded-lg overflow-hidden">
                                    <img src={p.url} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-status-danger text-white rounded-full w-5 h-5 flex items-center justify-center"><XMarkIcon className="w-3 h-3" /></button>
                                    {i === 0 && <span className="absolute bottom-1 left-1 bg-accent text-content-inverted text-[10px] font-bold px-1.5 py-0.5 rounded">Galvenais</span>}
                                </div>
                            ))}
                            <label className="aspect-square bg-surface-tertiary border-2 border-dashed border-border hover:border-accent rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors">
                                <PhotoIcon className="w-8 h-8 text-content-muted" /><span className="text-content-muted text-xs mt-1">Pievienot</span>
                                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        {errors.images && <p className="text-status-danger text-xs">{errors.images[0]}</p>}
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3.5 rounded-lg font-bold text-lg transition-colors">
                    {loading ? "Notiek publicēšana..." : "Izveidot piedāvājumu"}
                </button>
            </form>

            {/* Модальное окно — создать аккаунт */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
                    <div className="relative bg-surface-secondary border border-border rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-content-muted hover:text-content-primary">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserIcon className="w-8 h-8 text-accent" />
                            </div>
                            <h2 className="text-xl font-bold text-content-primary">Izveidojiet kontu</h2>
                            <p className="text-content-secondary text-sm mt-2">Lai publicētu sludinājumu, nepieciešams reģistrēties vai pieslēgties.</p>
                        </div>
                        <div className="space-y-3">
                            <Link to="/register" className="block w-full bg-accent hover:bg-accent-hover text-content-inverted text-center py-3 rounded-lg font-semibold transition-colors">Reģistrēties</Link>
                            <Link to="/login" className="block w-full bg-surface-tertiary hover:bg-border-hover text-content-primary text-center py-3 rounded-lg font-semibold transition-colors">Pieslēgties</Link>
                        </div>
                        <button onClick={() => setShowAuthModal(false)} className="block w-full text-content-muted text-sm mt-4 hover:text-content-secondary transition-colors">Atcelt</button>
                    </div>
                </div>
            )}
        </div>
    );
}
