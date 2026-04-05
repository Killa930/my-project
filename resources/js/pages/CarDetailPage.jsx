import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { HeartIcon, PhoneIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const bodyLabels = { sedan: "Sedans", hatchback: "Hečbeks", wagon: "Universāls", suv: "Apvidus", coupe: "Kupeja", cabriolet: "Kabriolets", minivan: "Minivens", pickup: "Pikaps", other: "Cits" };
const transmissionLabels = { manual: "Manuāla", automatic: "Automāts" };

export default function CarDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => { api.get(`/cars/${id}`).then((res) => setCar(res.data)).catch(() => navigate("/catalog")).finally(() => setLoading(false)); }, [id]);
    useEffect(() => { if (user) { api.get("/favorites").then((res) => { setIsFavorite(res.data.map((f) => f.car_id || f.car?.id).includes(Number(id))); }).catch(() => {}); } }, [user, id]);

    const toggleFavorite = async () => {
        if (!user) return navigate("/login");
        const res = await api.post(`/favorites/toggle/${id}`);
        setIsFavorite(res.data.status === "added");
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
    if (!car) return null;

    const manufacturer = car.car_model?.manufacturer?.name || "";
    const model = car.car_model?.name || "";
    const images = car.images?.length > 0 ? car.images : [{ image_path: "placeholder.jpg" }];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-content-secondary hover:text-content-primary mb-6 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" /> Atpakaļ
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <div className="aspect-[16/10] bg-surface-secondary rounded-xl overflow-hidden border border-border">
                        <img src={images[activeImage]?.image_path ? `/storage/${images[activeImage].image_path}` : "/images/car-placeholder.svg"}
                            alt={`${manufacturer} ${model}`} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }} />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                            {images.map((img, index) => (
                                <button key={index} onClick={() => setActiveImage(index)}
                                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${index === activeImage ? "border-accent" : "border-border hover:border-border-hover"}`}>
                                    <img src={`/storage/${img.image_path}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-content-primary">{manufacturer} {model}</h1>
                        <p className="text-3xl font-black text-accent mt-2">{Number(car.price).toLocaleString("lv-LV")} €</p>
                    </div>
                    <button onClick={toggleFavorite}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors border ${isFavorite ? "bg-accent-subtle border-accent text-accent" : "bg-surface-tertiary border-border text-content-secondary hover:border-border-hover"}`}>
                        {isFavorite ? <HeartSolidIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                        {isFavorite ? "Pievienots izlasei" : "Pievienot izlasei"}
                    </button>
                    <div className="bg-surface-secondary rounded-xl border border-border p-5">
                        <h2 className="text-content-primary font-semibold mb-4">Parametri</h2>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                            <div className="text-content-muted">Gads</div><div className="text-content-primary">{car.year}</div>
                            <div className="text-content-muted">Nobraukums</div><div className="text-content-primary">{Number(car.mileage).toLocaleString("lv-LV")} km</div>
                            <div className="text-content-muted">Dzinējs</div><div className="text-content-primary">{fuelLabels[car.fuel_type]}</div>
                            <div className="text-content-muted">Ātrumkārba</div><div className="text-content-primary">{transmissionLabels[car.transmission]}</div>
                            <div className="text-content-muted">Virsbūve</div><div className="text-content-primary">{bodyLabels[car.body_type]}</div>
                            {car.engine_volume && <><div className="text-content-muted">Tilpums</div><div className="text-content-primary">{car.engine_volume} L</div></>}
                            <div className="text-content-muted">Krāsa</div><div className="text-content-primary">{car.color}</div>
                        </div>
                    </div>
                    {car.user && (
                        <div className="bg-surface-secondary rounded-xl border border-border p-5">
                            <h2 className="text-content-primary font-semibold mb-3">Pārdevējs</h2>
                            <p className="text-content-primary">{car.user.name}</p>
                            {car.user.phone && <a href={`tel:${car.user.phone}`} className="flex items-center gap-2 text-accent hover:text-accent-hover mt-2 transition-colors"><PhoneIcon className="w-4 h-4" />{car.user.phone}</a>}
                        </div>
                    )}
                    {user && (car.user_id === user.id || user.role === "admin") && (
                        <Link to={`/cars/${car.id}/edit`} className="block bg-surface-tertiary hover:bg-border-hover text-content-primary text-center py-2.5 rounded-lg font-medium transition-colors">Rediģēt</Link>
                    )}
                </div>
            </div>
            {car.description && (
                <div className="mt-8 bg-surface-secondary rounded-xl border border-border p-6">
                    <h2 className="text-content-primary font-semibold mb-3">Apraksts</h2>
                    <p className="text-content-secondary leading-relaxed whitespace-pre-line">{car.description}</p>
                </div>
            )}
        </div>
    );
}
