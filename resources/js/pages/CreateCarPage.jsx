import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CreateCarPage() {
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [form, setForm] = useState({ manufacturer_id: "", car_model_id: "", year: "", price: "", mileage: "", fuel_type: "", body_type: "", transmission: "", engine_volume: "", color: "", description: "", images: [] });

    useEffect(() => { api.get("/manufacturers").then((res) => setManufacturers(Array.isArray(res.data) ? res.data : [])); }, []);
    useEffect(() => { if (form.manufacturer_id) { api.get(`/manufacturers/${form.manufacturer_id}/models`).then((res) => setModels(res.data)); } else { setModels([]); } }, [form.manufacturer_id]);

    const handleChange = (k, v) => { setForm((p) => { const u = { ...p, [k]: v }; if (k === "manufacturer_id") u.car_model_id = ""; return u; }); };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setForm((p) => ({ ...p, images: [...p.images, ...files] }));
        files.forEach((f) => { const r = new FileReader(); r.onloadend = () => { setImagePreviews((p) => [...p, { file: f, url: r.result }]); }; r.readAsDataURL(f); });
    };
    const removeImage = (i) => { setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) })); setImagePreviews((p) => p.filter((_, idx) => idx !== i)); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setLoading(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (k === "images") { v.forEach((f) => fd.append("images[]", f)); } else if (v) { fd.append(k, v); } });
        try { const res = await api.post("/cars", fd, { headers: { "Content-Type": "multipart/form-data" } }); navigate(`/cars/${res.data.id}`); }
        catch (err) { if (err.response?.data?.errors) setErrors(err.response.data.errors); }
        finally { setLoading(false); }
    };

    const ic = (f) => `w-full bg-surface-tertiary border ${errors[f] ? "border-status-danger" : "border-border"} text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-content-primary mb-8">Jauns sludinājums</h1>
            <form onSubmit={handleSubmit} className="bg-surface-secondary border border-border rounded-xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-content-secondary text-sm mb-1.5">Ražotājs *</label>
                        <select value={form.manufacturer_id} onChange={(e) => handleChange("manufacturer_id", e.target.value)} className={ic("manufacturer_id")}>
                            <option value="">Izvēlieties</option>{manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                        {errors.manufacturer_id && <p className="text-status-danger text-xs mt-1">{errors.manufacturer_id[0]}</p>}</div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Modelis *</label>
                        <select value={form.car_model_id} onChange={(e) => handleChange("car_model_id", e.target.value)} className={ic("car_model_id")} disabled={!form.manufacturer_id}>
                            <option value="">Izvēlieties</option>{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                        {errors.car_model_id && <p className="text-status-danger text-xs mt-1">{errors.car_model_id[0]}</p>}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-content-secondary text-sm mb-1.5">Gads *</label><input type="number" value={form.year} onChange={(e) => handleChange("year", e.target.value)} className={ic("year")} placeholder="2020" />{errors.year && <p className="text-status-danger text-xs mt-1">{errors.year[0]}</p>}</div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Cena (€) *</label><input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className={ic("price")} placeholder="15000" />{errors.price && <p className="text-status-danger text-xs mt-1">{errors.price[0]}</p>}</div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Nobraukums (km) *</label><input type="number" value={form.mileage} onChange={(e) => handleChange("mileage", e.target.value)} className={ic("mileage")} placeholder="50000" />{errors.mileage && <p className="text-status-danger text-xs mt-1">{errors.mileage[0]}</p>}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-content-secondary text-sm mb-1.5">Dzinējs *</label>
                        <select value={form.fuel_type} onChange={(e) => handleChange("fuel_type", e.target.value)} className={ic("fuel_type")}>
                            <option value="">Izvēlieties</option><option value="petrol">Benzīns</option><option value="diesel">Dīzelis</option><option value="electric">Elektriskais</option><option value="hybrid">Hibrīds</option><option value="petrol_lpg">Benz./gāze</option></select></div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Virsbūve *</label>
                        <select value={form.body_type} onChange={(e) => handleChange("body_type", e.target.value)} className={ic("body_type")}>
                            <option value="">Izvēlieties</option><option value="sedan">Sedans</option><option value="hatchback">Hečbeks</option><option value="wagon">Universāls</option><option value="suv">Apvidus</option><option value="coupe">Kupeja</option><option value="cabriolet">Kabriolets</option><option value="minivan">Minivens</option><option value="pickup">Pikaps</option></select></div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Ātrumkārba *</label>
                        <select value={form.transmission} onChange={(e) => handleChange("transmission", e.target.value)} className={ic("transmission")}>
                            <option value="">Izvēlieties</option><option value="manual">Manuāla</option><option value="automatic">Automāts</option></select></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-content-secondary text-sm mb-1.5">Tilpums (L)</label><input type="number" step="0.1" value={form.engine_volume} onChange={(e) => handleChange("engine_volume", e.target.value)} className={ic("engine_volume")} placeholder="2.0" /></div>
                    <div><label className="block text-content-secondary text-sm mb-1.5">Krāsa *</label><input type="text" value={form.color} onChange={(e) => handleChange("color", e.target.value)} className={ic("color")} placeholder="Melns" /></div>
                </div>
                <div><label className="block text-content-secondary text-sm mb-1.5">Apraksts</label><textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className={ic("description")} rows="4" placeholder="Apraksts..." /></div>
                <div>
                    <label className="block text-content-secondary text-sm mb-1.5">Fotoattēli * (pirmais = galvenais)</label>
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
                <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted py-3.5 rounded-lg font-bold text-lg transition-colors">
                    {loading ? "Saglabā..." : "Publicēt sludinājumu"}</button>
            </form>
        </div>
    );
}
