import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { HeartIcon, PhoneIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import ImageGalleryModal from "../components/ImageGalleryModal";

const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const bodyLabels = { sedan: "Sedans", hatchback: "Hečbeks", wagon: "Universāls", suv: "Apvidus", coupe: "Kupeja", cabriolet: "Kabriolets", minivan: "Minivens", pickup: "Pikaps", other: "Cits" };
const transmissionLabels = { manual: "Manuāla", automatic: "Automāts" };

export default function CarDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [sellerRating, setSellerRating] = useState({ avg: 0, total: 0 });
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        api.get(`/cars/${id}`)
            .then((res) => { setCar(res.data); loadSellerRating(res.data.user_id); })
            .catch(() => navigate("/catalog"))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (user) {
            api.get("/favorites").then((res) => {
                setIsFavorite(res.data.map((f) => f.car_id || f.car?.id).includes(Number(id)));
            }).catch(() => {});
        }
    }, [user, id]);

    const loadSellerRating = async (sid) => {
        try {
            const r = await api.get("/reviews", { params: { seller_id: sid } });
            setSellerRating({ avg: r.data.average_rating || 0, total: r.data.total || 0 });
        } catch {}
    };

    const toggleFavorite = async () => {
        if (!user) return navigate("/login");
        const r = await api.post(`/favorites/toggle/${id}`);
        setIsFavorite(r.data.status === "added");
        toast.success(r.data.status === "added" ? "Pievienots izlasei" : "Noņemts no izlases");
    };

    const handleBuy = async () => {
        try {
            await api.post("/transactions", { ad_id: car.id });
            toast.success("Pieteikums nosūtīts pārdevējam!");
        } catch (e) {
            toast.error(e.response?.data?.message || "Kļūda");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!car) return null;

    const manufacturer = car.car_model?.manufacturer?.name || "";
    const model = car.car_model?.name || "";
    const images = car.images?.length > 0 ? car.images : [{ image_path: "placeholder.jpg" }];

    // Параметры для отображения в сетке
    const params = [
        { label: "Gads", value: car.year },
        { label: "Nobraukums", value: `${Number(car.mileage).toLocaleString("lv-LV")} km` },
        { label: "Dzinējs", value: fuelLabels[car.fuel_type] },
        { label: "Ātrumkārba", value: transmissionLabels[car.transmission] },
        { label: "Virsbūve", value: bodyLabels[car.body_type] },
        ...(car.engine_volume ? [{ label: "Tilpums", value: `${car.engine_volume} L` }] : []),
        { label: "Krāsa", value: car.color },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Назад */}
            <AnimateIn animation="fade">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-content-secondary hover:text-content-primary mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" /> Atpakaļ
                </button>
            </AnimateIn>

            {/* === ВЕРХНЯЯ ЧАСТЬ: Фото + Цена/Кнопки/Продавец === */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Фото — 3 колонки */}
                <div className="lg:col-span-3">
                    <AnimateIn animation="fade" delay={100}>
                        <div className="aspect-[16/10] bg-surface-secondary rounded-xl overflow-hidden border border-border cursor-zoom-in group"
                        onClick={() => setModalOpen(true)}
                        >
                            <img
                            src={images[activeImage]?.image_path ? `/storage/${images[activeImage].image_path}` : "/images/car-placeholder.svg"}
                            alt={`${manufacturer} ${model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }}
                            />
                            </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border-hover scrollbar-track-surface-secondary hover:scrollbar-thumb-content-muted">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                                            i === activeImage ? "border-accent" : "border-border hover:border-border-hover"
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${img.image_path}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </AnimateIn>
                </div>

                {/* Правая колонка — цена, кнопки, продавец */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Заголовок + цена */}
                    <AnimateIn delay={200}>
                        <div>
                            <h1 className="text-2xl font-bold text-content-primary">
                                {manufacturer} {model}
                            </h1>
                            <p className="text-3xl font-black text-accent mt-2">
                                {Number(car.price).toLocaleString("lv-LV")} €
                            </p>
                        </div>
                    </AnimateIn>

                    {/* Быстрые характеристики — бейджи
                    <AnimateIn delay={250}>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm bg-surface-tertiary text-content-secondary px-3 py-1.5 rounded-lg">{car.year}</span>
                            <span className="text-sm bg-surface-tertiary text-content-secondary px-3 py-1.5 rounded-lg">{Number(car.mileage).toLocaleString("lv-LV")} km</span>
                            <span className="text-sm bg-surface-tertiary text-content-secondary px-3 py-1.5 rounded-lg">{fuelLabels[car.fuel_type]}</span>
                            <span className="text-sm bg-surface-tertiary text-content-secondary px-3 py-1.5 rounded-lg">{transmissionLabels[car.transmission]}</span>
                            {car.engine_volume && (
                                <span className="text-sm bg-surface-tertiary text-content-secondary px-3 py-1.5 rounded-lg">{car.engine_volume} L</span>
                            )}
                        </div>
                    </AnimateIn> */}

                    {/* Избранное */}
                    <AnimateIn delay={300}>
                        <button
                            onClick={toggleFavorite}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors border ${
                                isFavorite
                                    ? "bg-accent-subtle border-accent text-accent"
                                    : "bg-surface-tertiary border-border text-content-secondary hover:border-border-hover"
                            }`}
                        >
                            {isFavorite ? <HeartSolidIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                            {isFavorite ? "Pievienots izlasei" : "Pievienot izlasei"}
                        </button>
                    </AnimateIn>

                    {/* Купить */}
                    {user && car.user_id !== user.id && car.status === "active" && (
                        <AnimateIn delay={350}>
                            <button
                                onClick={handleBuy}
                                className="w-full bg-accent hover:bg-accent-hover text-content-inverted py-3 rounded-xl font-semibold transition-colors"
                            >
                                Pirkt
                            </button>
                        </AnimateIn>
                    )}

                    {/* Продавец */}
                    {car.user && (
                        <AnimateIn delay={400}>
                            <div className="bg-surface-secondary rounded-xl border border-border p-5">
                                <h2 className="text-content-primary font-semibold mb-3">Pārdevējs</h2>
                                <Link
                                    to={`/seller/${car.user_id}`}
                                    className="text-accent hover:text-accent-hover font-medium transition-colors"
                                >
                                    {car.user.name}
                                </Link>

                                {sellerRating.total > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <StarSolidIcon
                                                    key={s}
                                                    className={`w-4 h-4 ${
                                                        s <= Math.round(sellerRating.avg) ? "text-accent" : "text-content-muted"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-content-secondary text-sm">
                                            {sellerRating.avg} ({sellerRating.total})
                                        </span>
                                    </div>
                                )}

                                {car.user.phone && (
                                    <a
                                        href={`tel:${car.user.phone}`}
                                        className="flex items-center gap-2 text-accent hover:text-accent-hover mt-2 transition-colors"
                                    >
                                        <PhoneIcon className="w-4 h-4" />
                                        {car.user.phone}
                                    </a>
                                )}

                                <Link
                                    to={`/seller/${car.user_id}`}
                                    className="block text-content-muted hover:text-content-secondary text-sm mt-2 transition-colors"
                                >
                                    Skatīt profilu un atsauksmes →
                                </Link>
                            </div>
                        </AnimateIn>
                    )}

                    {/* Редактировать */}
                    {user && (car.user_id === user.id || user.role === "admin") && (
                        <AnimateIn delay={450}>
                            <Link
                                to={`/cars/${car.id}/edit`}
                                className="block bg-surface-tertiary hover:bg-border-hover text-content-primary text-center py-2.5 rounded-lg font-medium transition-colors"
                            >
                                Rediģēt
                            </Link>
                        </AnimateIn>
                    )}
                </div>
            </div>

            {/* === НИЖНЯЯ ЧАСТЬ: Параметры + Описание === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Параметры — таблица */}
                <AnimateIn delay={300}>
                    <div className="bg-surface-secondary rounded-xl border border-border p-6">
                        <h2 className="text-content-primary font-semibold mb-4">Parametri</h2>
                        <div className="space-y-3">
                            {params.map((p, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between py-2 ${
                                        i < params.length - 1 ? "border-b border-border" : ""
                                    }`}
                                >
                                    <span className="text-content-muted text-sm">{p.label}</span>
                                    <span className="text-content-primary font-medium text-sm">{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimateIn>

                {/* Описание */}
                <AnimateIn delay={400}>
                    <div className="bg-surface-secondary rounded-xl border border-border p-6 h-full">
                        <h2 className="text-content-primary font-semibold mb-4">Apraksts</h2>
                        {car.description ? (
                            <p className="text-content-secondary leading-relaxed whitespace-pre-line">
                                {car.description}
                            </p>
                        ) : (
                            <p className="text-content-muted italic">Nav pievienots apraksts</p>
                        )}
                    </div>
                </AnimateIn>

            </div>

            {/* Модалка просмотра фото */}
            {modalOpen && (
                <ImageGalleryModal
                images={images}
                initialIndex={activeImage}
                onClose={() => setModalOpen(false)}
                />
                )}

        </div>
        
    );
}
