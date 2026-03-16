/*
 * CatalogPage — каталог автомобилей с фильтрами
 *
 * Это самая сложная страница — реализует ВСЕ требования задания:
 * - Поиск по ключевому слову
 * - Простая фильтрация (один критерий)
 * - Расширенная фильтрация (несколько критериев)
 * - Сортировка (по цене, году, пробегу, дате)
 * - Данные из нескольких таблиц (JOIN через API)
 * - Пагинация
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import { useAuth } from "../context/AuthContext";
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function CatalogPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Данные
    const [cars, setCars] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    // Фильтры — начальные значения берём из URL (searchParams)
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        manufacturer_id: searchParams.get("manufacturer_id") || "",
        car_model_id: searchParams.get("car_model_id") || "",
        fuel_type: searchParams.get("fuel_type") || "",
        body_type: searchParams.get("body_type") || "",
        transmission: searchParams.get("transmission") || "",
        price_min: searchParams.get("price_min") || "",
        price_max: searchParams.get("price_max") || "",
        year_min: searchParams.get("year_min") || "",
        year_max: searchParams.get("year_max") || "",
        mileage_max: searchParams.get("mileage_max") || "",
        sort: searchParams.get("sort") || "created_at",
        order: searchParams.get("order") || "desc",
    });

    const [showFilters, setShowFilters] = useState(false);

    // Загружаем марки для выпадающего списка
    useEffect(() => {
        api.get("/manufacturers").then((res) =>
            setManufacturers(res.data)
        );
    }, []);

    // Когда выбрана марка — загружаем её модели
    useEffect(() => {
        if (filters.manufacturer_id) {
            api.get(`/manufacturers/${filters.manufacturer_id}/models`).then(
                (res) => setModels(res.data)
            );
        } else {
            setModels([]);
        }
    }, [filters.manufacturer_id]);

    // Загружаем избранное (если залогинен)
    useEffect(() => {
        if (user) {
            api.get("/favorites").then((res) => {
                const ids = new Set(
                    res.data.map((f) => f.car_id || f.car?.id)
                );
                setFavorites(ids);
            });
        }
    }, [user]);

    // Загружаем автомобили при изменении фильтров
    useEffect(() => {
        fetchCars();
    }, [searchParams]);

    const fetchCars = async (page = searchParams.get("page") || 1) => {
        setLoading(true);
        try {
            // Собираем только непустые параметры
            const params = { page };
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params[key] = value;
            });

            const res = await api.get("/cars", { params });
            setCars(res.data.data || []);
            setPagination({
                currentPage: res.data.current_page,
                lastPage: res.data.last_page,
                total: res.data.total,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Применить фильтры — обновляем URL
    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    };

    // Сбросить все фильтры
    const resetFilters = () => {
        const empty = {
            search: "",
            manufacturer_id: "",
            car_model_id: "",
            fuel_type: "",
            body_type: "",
            transmission: "",
            price_min: "",
            price_max: "",
            year_min: "",
            year_max: "",
            mileage_max: "",
            sort: "created_at",
            order: "desc",
        };
        setFilters(empty);
        setSearchParams(new URLSearchParams());
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const updated = { ...prev, [key]: value };
            // Если сменили марку — сбрасываем модель
            if (key === "manufacturer_id") {
                updated.car_model_id = "";
            }
            return updated;
        });
    };

    const toggleFavorite = async (carId) => {
        if (!user) return;
        try {
            const res = await api.post(`/favorites/toggle/${carId}`);
            setFavorites((prev) => {
                const next = new Set(prev);
                if (res.data.status === "added") {
                    next.add(carId);
                } else {
                    next.delete(carId);
                }
                return next;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const changePage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        setSearchParams(params);
    };

    // Стиль для select/input полей фильтра
    const inputClass =
        "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* === ЗАГОЛОВОК + ПОИСК === */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Auto katalogs</h1>

                <div className="flex gap-3">
                    {/* Поиск */}
                    <div className="relative flex-1 sm:w-72">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                handleFilterChange("search", e.target.value)
                            }
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                            placeholder="Meklēt..."
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Кнопка фильтров (мобильная) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-sm transition-colors lg:hidden"
                    >
                        <FunnelIcon className="w-4 h-4" />
                        Filtri
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* === ПАНЕЛЬ ФИЛЬТРОВ (боковая) === */}
                <aside
                    className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0`}
                >
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 sticky top-24">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white font-semibold">Filtri</h2>
                            <button
                                onClick={resetFilters}
                                className="text-xs text-gray-500 hover:text-amber-500 transition-colors"
                            >
                                Notīrīt
                            </button>
                        </div>

                        {/* Марка */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Ražotājs
                            </label>
                            <select
                                value={filters.manufacturer_id}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "manufacturer_id",
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="">Visi</option>
                                {manufacturers.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Модель (зависит от марки) */}
                        {models.length > 0 && (
                            <div>
                                <label className="block text-gray-400 text-xs mb-1.5">
                                    Modelis
                                </label>
                                <select
                                    value={filters.car_model_id}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "car_model_id",
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">Visi</option>
                                    {models.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Топливо */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Dzinējs
                            </label>
                            <select
                                value={filters.fuel_type}
                                onChange={(e) =>
                                    handleFilterChange("fuel_type", e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="">Visi</option>
                                <option value="petrol">Benzīns</option>
                                <option value="diesel">Dīzelis</option>
                                <option value="electric">Elektriskais</option>
                                <option value="hybrid">Hibrīds</option>
                                <option value="petrol_lpg">Benz./gāze</option>
                            </select>
                        </div>

                        {/* Кузов */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Virsbūve
                            </label>
                            <select
                                value={filters.body_type}
                                onChange={(e) =>
                                    handleFilterChange("body_type", e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="">Visi</option>
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

                        {/* КПП */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Ātrumkārba
                            </label>
                            <select
                                value={filters.transmission}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "transmission",
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="">Visi</option>
                                <option value="manual">Manuāla</option>
                                <option value="automatic">Automāts</option>
                            </select>
                        </div>

                        {/* Цена */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Cena (€)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={filters.price_min}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "price_min",
                                            e.target.value
                                        )
                                    }
                                    placeholder="No"
                                    className={inputClass}
                                />
                                <input
                                    type="number"
                                    value={filters.price_max}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "price_max",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Līdz"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Год */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Gads
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={filters.year_min}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "year_min",
                                            e.target.value
                                        )
                                    }
                                    placeholder="No"
                                    className={inputClass}
                                />
                                <input
                                    type="number"
                                    value={filters.year_max}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "year_max",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Līdz"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Пробег */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Nobraukums (līdz km)
                            </label>
                            <input
                                type="number"
                                value={filters.mileage_max}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "mileage_max",
                                        e.target.value
                                    )
                                }
                                placeholder="Maks. nobraukums"
                                className={inputClass}
                            />
                        </div>

                        {/* Сортировка */}
                        <div>
                            <label className="block text-gray-400 text-xs mb-1.5">
                                Kārtot pēc
                            </label>
                            <select
                                value={`${filters.sort}_${filters.order}`}
                                onChange={(e) => {
                                    const [sort, order] =
                                        e.target.value.split("_");
                                    handleFilterChange("sort", sort);
                                    handleFilterChange("order", order);
                                }}
                                className={inputClass}
                            >
                                <option value="created_at_desc">
                                    Jaunākie vispirms
                                </option>
                                <option value="created_at_asc">
                                    Vecākie vispirms
                                </option>
                                <option value="price_asc">
                                    Cena: no mazākās
                                </option>
                                <option value="price_desc">
                                    Cena: no lielākās
                                </option>
                                <option value="year_desc">
                                    Gads: jaunākie
                                </option>
                                <option value="year_asc">
                                    Gads: vecākie
                                </option>
                                <option value="mileage_asc">
                                    Nobraukums: mazākais
                                </option>
                                <option value="mileage_desc">
                                    Nobraukums: lielākais
                                </option>
                            </select>
                        </div>

                        {/* Кнопка применить */}
                        <button
                            onClick={applyFilters}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                            Meklēt
                        </button>
                    </div>
                </aside>

                {/* === СПИСОК АВТОМОБИЛЕЙ === */}
                <div className="flex-1">
                    {/* Количество результатов */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-sm">
                            {pagination.total
                                ? `Atrasti ${pagination.total} sludinājumi`
                                : ""}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                Nav atrasts neviens sludinājums
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 text-amber-500 hover:text-amber-400"
                            >
                                Notīrīt filtrus
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {cars.map((car) => (
                                    <CarCard
                                        key={car.id}
                                        car={car}
                                        onFavoriteToggle={
                                            user ? toggleFavorite : undefined
                                        }
                                        isFavorite={favorites.has(car.id)}
                                    />
                                ))}
                            </div>

                            {/* Пагинация */}
                            {pagination.lastPage > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {Array.from(
                                        { length: pagination.lastPage },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => changePage(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                                page === pagination.currentPage
                                                    ? "bg-amber-500 text-gray-900"
                                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
