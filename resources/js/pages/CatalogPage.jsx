import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import { useAuth } from "../context/AuthContext";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CatalogPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "", manufacturer_id: searchParams.get("manufacturer_id") || "",
        car_model_id: searchParams.get("car_model_id") || "", fuel_type: searchParams.get("fuel_type") || "",
        body_type: searchParams.get("body_type") || "", transmission: searchParams.get("transmission") || "",
        price_min: searchParams.get("price_min") || "", price_max: searchParams.get("price_max") || "",
        year_min: searchParams.get("year_min") || "", year_max: searchParams.get("year_max") || "",
        mileage_max: searchParams.get("mileage_max") || "",
        sort: searchParams.get("sort") || "created_at", order: searchParams.get("order") || "desc",
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { api.get("/manufacturers").then((res) => setManufacturers(Array.isArray(res.data) ? res.data : [])); }, []);
    useEffect(() => {
        if (filters.manufacturer_id) { api.get(`/manufacturers/${filters.manufacturer_id}/models`).then((res) => setModels(res.data)); }
        else { setModels([]); }
    }, [filters.manufacturer_id]);
    useEffect(() => {
        if (user) { api.get("/favorites").then((res) => { setFavorites(new Set(res.data.map((f) => f.car_id || f.car?.id))); }).catch(() => {}); }
    }, [user]);
    useEffect(() => { fetchCars(); }, [searchParams]);

    const fetchCars = async (page = searchParams.get("page") || 1) => {
        setLoading(true);
        try {
            const params = { page };
            Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
            const res = await api.get("/cars", { params });
            setCars(res.data.data || []);
            setPagination({ currentPage: res.data.current_page, lastPage: res.data.last_page, total: res.data.total });
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
        setSearchParams(params);
    };
    const resetFilters = () => {
        const empty = { search: "", manufacturer_id: "", car_model_id: "", fuel_type: "", body_type: "", transmission: "", price_min: "", price_max: "", year_min: "", year_max: "", mileage_max: "", sort: "created_at", order: "desc" };
        setFilters(empty);
        setSearchParams(new URLSearchParams());
    };
    const handleFilterChange = (key, value) => {
        setFilters((prev) => { const u = { ...prev, [key]: value }; if (key === "manufacturer_id") u.car_model_id = ""; return u; });
    };
    const toggleFavorite = async (carId) => {
        if (!user) return;
        try {
            const res = await api.post(`/favorites/toggle/${carId}`);
            setFavorites((prev) => { const n = new Set(prev); res.data.status === "added" ? n.add(carId) : n.delete(carId); return n; });
        } catch (err) { console.error(err); }
    };
    const changePage = (page) => { const p = new URLSearchParams(searchParams); p.set("page", page); setSearchParams(p); };

    const inputClass = "w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-content-primary">Auto katalogs</h1>
                <div className="flex gap-3">
                    <div className="relative flex-1 sm:w-72">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
                        <input type="text" value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()} placeholder="Meklēt..."
                            className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-surface-tertiary border border-border text-content-secondary hover:text-content-primary px-4 py-2.5 rounded-lg text-sm transition-colors lg:hidden">
                        <FunnelIcon className="w-4 h-4" /> Filtri
                    </button>
                </div>
            </div>
            <div className="flex gap-6">
                <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0`}>
                    <div className="bg-surface-secondary border border-border rounded-xl p-5 space-y-4 sticky top-24">
                        <div className="flex items-center justify-between">
                            <h2 className="text-content-primary font-semibold">Filtri</h2>
                            <button onClick={resetFilters} className="text-xs text-content-muted hover:text-accent transition-colors">Notīrīt</button>
                        </div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Ražotājs</label>
                            <select value={filters.manufacturer_id} onChange={(e) => handleFilterChange("manufacturer_id", e.target.value)} className={inputClass}>
                                <option value="">Visi</option>
                                {manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select></div>
                        {models.length > 0 && <div><label className="block text-content-secondary text-xs mb-1.5">Modelis</label>
                            <select value={filters.car_model_id} onChange={(e) => handleFilterChange("car_model_id", e.target.value)} className={inputClass}>
                                <option value="">Visi</option>
                                {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select></div>}
                        <div><label className="block text-content-secondary text-xs mb-1.5">Dzinējs</label>
                            <select value={filters.fuel_type} onChange={(e) => handleFilterChange("fuel_type", e.target.value)} className={inputClass}>
                                <option value="">Visi</option><option value="petrol">Benzīns</option><option value="diesel">Dīzelis</option>
                                <option value="electric">Elektriskais</option><option value="hybrid">Hibrīds</option><option value="petrol_lpg">Benz./gāze</option>
                            </select></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Virsbūve</label>
                            <select value={filters.body_type} onChange={(e) => handleFilterChange("body_type", e.target.value)} className={inputClass}>
                                <option value="">Visi</option><option value="sedan">Sedans</option><option value="hatchback">Hečbeks</option>
                                <option value="wagon">Universāls</option><option value="suv">Apvidus</option><option value="coupe">Kupeja</option>
                                <option value="cabriolet">Kabriolets</option><option value="minivan">Minivens</option><option value="pickup">Pikaps</option>
                            </select></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Ātrumkārba</label>
                            <select value={filters.transmission} onChange={(e) => handleFilterChange("transmission", e.target.value)} className={inputClass}>
                                <option value="">Visi</option><option value="manual">Manuāla</option><option value="automatic">Automāts</option>
                            </select></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Cena (€)</label>
                            <div className="flex gap-2">
                                <input type="number" value={filters.price_min} onChange={(e) => handleFilterChange("price_min", e.target.value)} placeholder="No" className={inputClass} />
                                <input type="number" value={filters.price_max} onChange={(e) => handleFilterChange("price_max", e.target.value)} placeholder="Līdz" className={inputClass} />
                            </div></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Gads</label>
                            <div className="flex gap-2">
                                <input type="number" value={filters.year_min} onChange={(e) => handleFilterChange("year_min", e.target.value)} placeholder="No" className={inputClass} />
                                <input type="number" value={filters.year_max} onChange={(e) => handleFilterChange("year_max", e.target.value)} placeholder="Līdz" className={inputClass} />
                            </div></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Nobraukums (līdz km)</label>
                            <input type="number" value={filters.mileage_max} onChange={(e) => handleFilterChange("mileage_max", e.target.value)} placeholder="Maks." className={inputClass} /></div>
                        <div><label className="block text-content-secondary text-xs mb-1.5">Kārtot pēc</label>
                            <select value={`${filters.sort}_${filters.order}`} onChange={(e) => { const [s, o] = e.target.value.split("_"); handleFilterChange("sort", s); handleFilterChange("order", o); }} className={inputClass}>
                                <option value="created_at_desc">Jaunākie</option><option value="created_at_asc">Vecākie</option>
                                <option value="price_asc">Cena ↑</option><option value="price_desc">Cena ↓</option>
                                <option value="year_desc">Gads ↓</option><option value="year_asc">Gads ↑</option>
                                <option value="mileage_asc">Nobrauk. ↑</option><option value="mileage_desc">Nobrauk. ↓</option>
                            </select></div>
                        <button onClick={applyFilters} className="w-full bg-accent hover:bg-accent-hover text-content-inverted py-2.5 rounded-lg font-semibold transition-colors">Meklēt</button>
                    </div>
                </aside>
                <div className="flex-1">
                    <p className="text-content-muted text-sm mb-4">{pagination.total ? `Atrasti ${pagination.total} sludinājumi` : ""}</p>
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
                    ) : cars.length === 0 ? (
                        <div className="text-center py-20"><p className="text-content-muted text-lg">Nav atrasts neviens sludinājums</p>
                            <button onClick={resetFilters} className="mt-4 text-accent hover:text-accent-hover">Notīrīt filtrus</button></div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {cars.map((car) => <CarCard key={car.id} car={car} onFavoriteToggle={user ? toggleFavorite : undefined} isFavorite={favorites.has(car.id)} />)}
                            </div>
                            {pagination.lastPage > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                                        <button key={page} onClick={() => changePage(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pagination.currentPage ? "bg-accent text-content-inverted" : "bg-surface-tertiary text-content-secondary hover:bg-border-hover"}`}>
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
