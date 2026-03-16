import { useState, useEffect } from "react";
import api from "../api/axios";
import CarCard from "../components/CarCard";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/favorites")
            .then((res) => setFavorites(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleFavorite = async (carId) => {
        await api.post(`/favorites/toggle/${carId}`);
        setFavorites((prev) => prev.filter((f) => (f.car_id || f.car?.id) !== carId));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">Izlase</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-500 text-lg">Izlase ir tukša</p>
                    <p className="text-gray-600 text-sm mt-2">Pievienojiet automašīnas, nospiežot ♡</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <CarCard
                            key={fav.id}
                            car={fav.car}
                            onFavoriteToggle={toggleFavorite}
                            isFavorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
