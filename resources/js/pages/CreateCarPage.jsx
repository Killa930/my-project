/*
 * CreateCarPage — форма создания объявления
 *
 * Реализует: формы с валидацией, загрузку фотографий,
 * зависимые выпадающие списки (марка → модель).
 */

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
        images: [],
    });

    useEffect(() => {
        api.get("/manufacturers").then((res) => setManufacturers(res.data));
    }, []);

    useEffect(() => {
        if (form.manufacturer_id) {
            api.get(`/manufacturers/${form.manufacturer_id}/models`).then(
                (res) => setModels(res.data)
            );
        } else {
            setModels([]);
        }
    }, [form.manufacturer_id]);

    const handleChange = (key, value) => {
        setForm((prev) => {
            const updated = { ...prev, [key]: value };
            if (key === "manufacturer_id") updated.car_model_id = "";
            return updated;
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));

        // Создаём превью для каждого фото
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [
                    ...prev,
                    { file, url: reader.result },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        /*
         * FormData — специальный объект для отправки файлов.
         * Обычный JSON не может содержать файлы, поэтому используем FormData.
         * Content-Type автоматически станет multipart/form-data.
         */
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((file) => formData.append("images[]", file));
            } else if (value) {
                formData.append(key, value);
            }
        });

        try {
            const res = await api.post("/cars", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate(`/cars/${res.data.id}`);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-gray-800 border ${errors[field] ? "border-red-500" : "border-gray-700"} text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500`;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">
                Jauns sludinājums
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 space-y-6"
            >
                {/* Марка + Модель */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Ražotājs *
                        </label>
                        <select
                            value={form.manufacturer_id}
                            onChange={(e) =>
                                handleChange("manufacturer_id", e.target.value)
                            }
                            className={inputClass("manufacturer_id")}
                        >
                            <option value="">Izvēlieties</option>
                            {manufacturers.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                        {errors.manufacturer_id && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.manufacturer_id[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Modelis *
                        </label>
                        <select
                            value={form.car_model_id}
                            onChange={(e) =>
                                handleChange("car_model_id", e.target.value)
                            }
                            className={inputClass("car_model_id")}
                            disabled={!form.manufacturer_id}
                        >
                            <option value="">Izvēlieties</option>
                            {models.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                        {errors.car_model_id && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.car_model_id[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Год, Цена, Пробег */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Gads *
                        </label>
                        <input
                            type="number"
                            value={form.year}
                            onChange={(e) =>
                                handleChange("year", e.target.value)
                            }
                            className={inputClass("year")}
                            placeholder="2020"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                        />
                        {errors.year && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.year[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Cena (€) *
                        </label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                handleChange("price", e.target.value)
                            }
                            className={inputClass("price")}
                            placeholder="15000"
                        />
                        {errors.price && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.price[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Nobraukums (km) *
                        </label>
                        <input
                            type="number"
                            value={form.mileage}
                            onChange={(e) =>
                                handleChange("mileage", e.target.value)
                            }
                            className={inputClass("mileage")}
                            placeholder="50000"
                        />
                        {errors.mileage && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.mileage[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Топливо, Кузов, КПП */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Dzinējs *
                        </label>
                        <select
                            value={form.fuel_type}
                            onChange={(e) =>
                                handleChange("fuel_type", e.target.value)
                            }
                            className={inputClass("fuel_type")}
                        >
                            <option value="">Izvēlieties</option>
                            <option value="petrol">Benzīns</option>
                            <option value="diesel">Dīzelis</option>
                            <option value="electric">Elektriskais</option>
                            <option value="hybrid">Hibrīds</option>
                            <option value="petrol_lpg">Benz./gāze</option>
                        </select>
                        {errors.fuel_type && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.fuel_type[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Virsbūve *
                        </label>
                        <select
                            value={form.body_type}
                            onChange={(e) =>
                                handleChange("body_type", e.target.value)
                            }
                            className={inputClass("body_type")}
                        >
                            <option value="">Izvēlieties</option>
                            <option value="sedan">Sedans</option>
                            <option value="hatchback">Hečbeks</option>
                            <option value="wagon">Universāls</option>
                            <option value="suv">Apvidus</option>
                            <option value="coupe">Kupeja</option>
                            <option value="cabriolet">Kabriolets</option>
                            <option value="minivan">Minivens</option>
                            <option value="pickup">Pikaps</option>
                        </select>
                        {errors.body_type && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.body_type[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Ātrumkārba *
                        </label>
                        <select
                            value={form.transmission}
                            onChange={(e) =>
                                handleChange("transmission", e.target.value)
                            }
                            className={inputClass("transmission")}
                        >
                            <option value="">Izvēlieties</option>
                            <option value="manual">Manuāla</option>
                            <option value="automatic">Automāts</option>
                        </select>
                        {errors.transmission && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.transmission[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Объём двигателя + Цвет */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Tilpums (L)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={form.engine_volume}
                            onChange={(e) =>
                                handleChange("engine_volume", e.target.value)
                            }
                            className={inputClass("engine_volume")}
                            placeholder="2.0"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1.5">
                            Krāsa *
                        </label>
                        <input
                            type="text"
                            value={form.color}
                            onChange={(e) =>
                                handleChange("color", e.target.value)
                            }
                            className={inputClass("color")}
                            placeholder="Melns"
                        />
                        {errors.color && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.color[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Описание */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1.5">
                        Apraksts
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        className={inputClass("description")}
                        rows="4"
                        placeholder="Automašīnas apraksts, aprīkojums, stāvoklis..."
                    />
                </div>

                {/* Загрузка фото */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1.5">
                        Fotoattēli * (pirmais = galvenais)
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={preview.url}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-amber-500 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        Galvenais
                                    </span>
                                )}
                            </div>
                        ))}

                        {/* Кнопка добавить фото */}
                        <label className="aspect-square bg-gray-800 border-2 border-dashed border-gray-700 hover:border-amber-500 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors">
                            <PhotoIcon className="w-8 h-8 text-gray-600" />
                            <span className="text-gray-600 text-xs mt-1">
                                Pievienot
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {errors.images && (
                        <p className="text-red-400 text-xs">
                            {errors.images[0]}
                        </p>
                    )}
                </div>

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 py-3.5 rounded-lg font-bold text-lg transition-colors"
                >
                    {loading
                        ? "Notiek saglabāšana..."
                        : "Publicēt sludinājumu"}
                </button>
            </form>
        </div>
    );
}
