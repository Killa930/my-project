import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import AnimateIn from "../components/AnimateIn";

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [latestCars, setLatestCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/cars", { params: { sort: "created_at", order: "desc" } })
            .then((res) => setLatestCars(res.data.data?.slice(0, 6) || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(searchQuery.trim() ? `/catalog?search=${encodeURIComponent(searchQuery)}` : "/catalog");
    };

    return (
        <div>
            <section className="relative bg-gradient-to-br from-surface-secondary via-surface-primary to-surface-secondary py-20 sm:py-32">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-hover rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <AnimateIn animation="fade" delay={100}>
                        <h1 className="text-4xl sm:text-6xl font-black text-content-primary mb-4 tracking-tight">
                            Atrodi savu <span className="text-accent">sapņu auto</span>
                        </h1>
                    </AnimateIn>
                    <AnimateIn delay={250}>
                        <p className="text-content-secondary text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
                            Plašākā lietoto automašīnu izvēle Latvijā. Drošs darījums, izdevīgas cenas.
                        </p>
                    </AnimateIn>
                    <AnimateIn delay={400}>
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 px-4 sm:px-0">
        <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Meklēt marku, modeli..."
            className="flex-1 min-w-0 bg-surface-tertiary border border-border text-content-primary rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-content-muted transition-colors" 
        />
        <button 
            type="submit" 
            className="shrink-0 bg-accent hover:bg-accent-hover text-content-inverted px-8 py-4 rounded-xl font-bold text-lg transition-colors whitespace-nowrap"
        >
            Meklēt
        </button>
    </form>
</AnimateIn>
                    <AnimateIn delay={550}>
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {["BMW", "Audi", "Mercedes-Benz", "Volkswagen", "Toyota", "Volvo"].map((brand) => (
                                <button key={brand} onClick={() => navigate(`/catalog?search=${encodeURIComponent(brand)}`)}
                                    className="text-sm text-content-secondary bg-surface-tertiary/60 hover:bg-surface-tertiary hover:text-accent px-4 py-2 rounded-lg transition-colors border border-border">
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </AnimateIn>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <AnimateIn>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-content-primary">Jaunākie sludinājumi</h2>
                        <button onClick={() => navigate("/catalog")} className="text-accent hover:text-accent-hover font-medium transition-colors">Skatīt visus →</button>
                    </div>
                </AnimateIn>
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestCars.map((car, index) => (
                            <AnimateIn key={car.id} delay={index * 100} animation="scale">
                                <CarCard car={car} />
                            </AnimateIn>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
