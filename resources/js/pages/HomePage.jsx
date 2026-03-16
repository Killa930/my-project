/*
 * HomePage — главная страница
 *
 * Содержит:
 * - Hero-секцию с быстрым поиском (как у CarBuy.lv)
 * - Последние добавленные авто
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [latestCars, setLatestCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Загружаем последние объявления при открытии страницы
    useEffect(() => {
        api.get("/cars", { params: { sort: "created_at", order: "desc" } })
            .then((res) => setLatestCars(res.data.data?.slice(0, 6) || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate("/catalog");
        }
    };

    return (
        <div>
            {/* === HERO СЕКЦИЯ === */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-20 sm:py-32">
                {/* Декоративный фон */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-600 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
                        Atrodi savu{" "}
                        <span className="text-amber-500">sapņu auto</span>
                    </h1>
                    <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
                        Plašākā lietoto automašīnu izvēle Latvijā. Drošs
                        darījums, izdevīgas cenas.
                    </p>

                    {/* Поисковая форма */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-2xl mx-auto flex gap-3"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Meklēt marku, modeli..."
                            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-gray-500 transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-colors whitespace-nowrap"
                        >
                            Meklēt
                        </button>
                    </form>

                    {/* Быстрые ссылки на марки */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {[
                            "BMW",
                            "Audi",
                            "Mercedes-Benz",
                            "Volkswagen",
                            "Toyota",
                            "Volvo",
                        ].map((brand) => (
                            <button
                                key={brand}
                                onClick={() =>
                                    navigate(
                                        `/catalog?search=${encodeURIComponent(brand)}`
                                    )
                                }
                                className="text-sm text-gray-400 bg-gray-800/60 hover:bg-gray-800 hover:text-amber-500 px-4 py-2 rounded-lg transition-colors border border-gray-800"
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* === ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ === */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">
                        Jaunākie sludinājumi
                    </h2>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                    >
                        Skatīt visus →
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestCars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
