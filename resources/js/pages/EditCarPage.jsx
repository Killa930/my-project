/*
 * EditCarPage — редактирование объявления
 * Загружает данные по id, заполняет форму, отправляет PUT-запрос.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditCarPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [form, setForm] = useState({
        manufacturer_id: "",
        car_model_id: "",
        year: "",
        price: "",
        mileage: "",
        fuel_type: "",
        body_type: "",
        transmission: "",
        engine_volume: "",
        color: "",
        description: "",
        status: "",
    });

    // Загружаем данные авто + марки
    useEffect(() => {
        Promise.all([api.get(`/cars/${id}`), api.get("/manufacturers")])
            .then(([carRes, manRes]) => {
                const car = carRes.data;
                const manId =
                    car.car_model?.manufacturer?.id ||
                    car.car_model?.manufacturer_id;
                setManufacturers(manRes.data);
                setForm({
                    manufacturer_id: manId || "",
                    car_model_id: car.car_model_id || "",
                    year: car.year || "",
                    price: car.price || "",
                    mileage: car.mileage || "",
                    fuel_type: car.fuel_type || "",
                    body_type: car.body_type || "",
                    transmission: car.transmission || "",
                    engine_volume: car.engine_volume || "",
                    color: car.color || "",
                    description: car.description || "",
                    status: car.status || "active",
                });
                // Загружаем модели выбранной марки
                if (manId) {
                    api.get(`/manufacturers/${manId}/models`).then((res) =>
                        setModels(res.data)
                    );
                }
            })
            .catch(() => navigate("/dashboard"))
            .finally(() => setPageLoading(false));
    }, [id]);

    useEffect(() => {
        if (form.manufacturer_id) {
            api.get(`/manufacturers/${form.manufacturer_id}/models`).then(
                (res) => setModels(res.data)
            );
        }
    }, [form.manufacturer_id]);

    const handleChange = (key, value) => {
        setForm((prev) => {
            const updated = { ...prev, [key]: value };
            if (key === "manufacturer_id") updated.car_model_id = "";
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        // Отправляем только заполненные поля
        const payload = {};
        Object.entries(form).forEach(([key, value]) => {
            if (key !== "manufacturer_id" && value !== "") {
                payload[key] = value;
            }
        });

        try {
            await api.put(`/cars/${id}`, payload);
            navigate(`/cars/${id}`);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClass = (field) =>
        `w-full bg-gray-800 border ${errors[field] ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500`;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">
                Rediģēt sludinājumu
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 space-y-6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Ražotājs</label>
                        <select value={form.manufacturer_id} onChange={(e) => handleChange("manufacturer_id", e.target.value)} className={inputClass("manufacturer_id")}>
                            <option value="">Izvēlieties</option>
                            {manufacturers.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Modelis</label>
                        <select value={form.car_model_id} onChange={(e) => handleChange("car_model_id", e.target.value)} className={inputClass("car_model_id")} disabled={!form.manufacturer_id}>
                            <option value="">Izvēlieties</option>
                            {models.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Gads</label>
                        <input type="number" value={form.year} onChange={(e) => handleChange("year", e.target.value)} className={inputClass("year")} />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Cena (€)</label>
                        <input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className={inputClass("price")} />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Nobraukums (km)</label>
                        <input type="number" value={form.mileage} onChange={(e) => handleChange("mileage", e.target.value)} className={inputClass("mileage")} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Dzinējs</label>
                        <select value={form.fuel_type} onChange={(e) => handleChange("fuel_type", e.target.value)} className={inputClass("fuel_type")}>
                            <option value="petrol">Benzīns</option>
                            <option value="diesel">Dīzelis</option>
                            <option value="electric">Elektriskais</option>
                            <option value="hybrid">Hibrīds</option>
                            <option value="petrol_lpg">Benz./gāze</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Virsbūve</label>
                        <select value={form.body_type} onChange={(e) => handleChange("body_type", e.target.value)} className={inputClass("body_type")}>
                            <option value="sedan">Sedans</option>
                            <option value="hatchback">Hečbeks</option>
                            <option value="wagon">Universāls</option>
                            <option value="suv">Apvidus</option>
                            <option value="coupe">Kupeja</option>
                            <option value="cabriolet">Kabriolets</option>
                            <option value="minivan">Minivens</option>
                            <option value="pickup">Pikaps</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Ātrumkārba</label>
                        <select value={form.transmission} onChange={(e) => handleChange("transmission", e.target.value)} className={inputClass("transmission")}>
                            <option value="manual">Manuāla</option>
                            <option value="automatic">Automāts</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Tilpums (L)</label>
                        <input type="number" step="0.1" value={form.engine_volume} onChange={(e) => handleChange("engine_volume", e.target.value)} className={inputClass("engine_volume")} />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Krāsa</label>
                        <input type="text" value={form.color} onChange={(e) => handleChange("color", e.target.value)} className={inputClass("color")} />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">Statuss</label>
                        <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className={inputClass("status")}>
                            <option value="active">Aktīvs</option>
                            <option value="sold">Pārdots</option>
                            <option value="inactive">Neaktīvs</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Apraksts</label>
                    <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className={inputClass("description")} rows="4" />
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors">
                        Atcelt
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 py-3 rounded-lg font-bold transition-colors">
                        {loading ? "Saglabā..." : "Saglabāt"}
                    </button>
                </div>
            </form>
        </div>
    );
}
