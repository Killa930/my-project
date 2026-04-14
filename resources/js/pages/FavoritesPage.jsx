import { useState, useEffect } from "react";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import AnimateIn from "../components/AnimateIn";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { api.get("/favorites").then((res) => setFavorites(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);
    const toggleFavorite = async (carId) => { await api.post(`/favorites/toggle/${carId}`); setFavorites((p) => p.filter((f) => (f.car_id || f.car?.id) !== carId)); };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade"><h1 className="text-2xl font-bold text-content-primary mb-8">Izlase</h1></AnimateIn>
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
            ) : favorites.length === 0 ? (
                <AnimateIn><div className="text-center py-16 bg-surface-secondary border border-border rounded-xl">
                    <p className="text-content-muted text-lg">Izlase ir tukša</p><p className="text-content-muted text-sm mt-2">Pievienojiet automašīnas, nospiežot ♡</p></div></AnimateIn>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav, i) => <AnimateIn key={fav.id} delay={i * 80} animation="scale"><CarCard car={fav.car} onFavoriteToggle={toggleFavorite} isFavorite={true} /></AnimateIn>)}
                </div>
            )}
        </div>
    );
}
