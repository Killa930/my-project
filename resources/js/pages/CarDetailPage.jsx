/*
 * CarDetailPage — страница одного автомобиля (карточка)
 *
 * Показывает все данные: фото, характеристики, описание, продавец.
 * useParams() — достаёт id из URL: /cars/5 → id = "5"
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    HeartIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const fuelLabels = {
    petrol: "Benzīns",
    diesel: "Dīzelis",
    electric: "Elektriskais",
    hybrid: "Hibrīds",
    petrol_lpg: "Benz./gāze",
};
const bodyLabels = {
    sedan: "Sedans",
    hatchback: "Hečbeks",
    wagon: "Universāls",
    suv: "Apvidus",
    coupe: "Kupeja",
    cabriolet: "Kabriolets",
    minivan: "Minivens",
    pickup: "Pikaps",
    other: "Cits",
};
const transmissionLabels = { manual: "Manuāla", automatic: "Automāts" };

export default function CarDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        api.get(`/cars/${id}`)
            .then((res) => setCar(res.data))
            .catch(() => navigate("/catalog"))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (user) {
            api.get("/favorites").then((res) => {
                const ids = res.data.map((f) => f.car_id || f.car?.id);
                setIsFavorite(ids.includes(Number(id)));
            });
        }
    }, [user, id]);

    const toggleFavorite = async () => {
        if (!user) return navigate("/login");
        const res = await api.post(`/favorites/toggle/${id}`);
        setIsFavorite(res.data.status === "added");
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!car) return null;

    const manufacturer = car.car_model?.manufacturer?.name || "";
    const model = car.car_model?.name || "";
    const images =
        car.images?.length > 0
            ? car.images
            : [{ image_path: "placeholder.jpg" }];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Кнопка назад */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Atpakaļ
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* === ФОТО (3 колонки) === */}
                <div className="lg:col-span-3">
                    {/* Главное фото */}
                    <div className="aspect-[16/10] bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        <img
                            src={
                                images[activeImage]?.image_path
                                    ? `/storage/${images[activeImage].image_path}`
                                    : "/images/car-placeholder.svg"
                            }
                            alt={`${manufacturer} ${model}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/images/car-placeholder.svg";
                            }}
                        />
                    </div>

                    {/* Миниатюры */}
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                                        index === activeImage
                                            ? "border-amber-500"
                                            : "border-gray-800 hover:border-gray-600"
                                    }`}
                                >
                                    <img
                                        src={`/storage/${img.image_path}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src =
                                                "/images/car-placeholder.svg";
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* === ИНФОРМАЦИЯ (2 колонки) === */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Заголовок + цена */}
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {manufacturer} {model}
                        </h1>
                        <p className="text-3xl font-black text-amber-500 mt-2">
                            {Number(car.price).toLocaleString("lv-LV")} €
                        </p>
                    </div>

                    {/* Кнопка избранного */}
                    <button
                        onClick={toggleFavorite}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors border ${
                            isFavorite
                                ? "bg-amber-500/10 border-amber-500 text-amber-500"
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                    >
                        {isFavorite ? (
                            <HeartSolidIcon className="w-5 h-5" />
                        ) : (
                            <HeartIcon className="w-5 h-5" />
                        )}
                        {isFavorite
                            ? "Pievienots izlasei"
                            : "Pievienot izlasei"}
                    </button>

                    {/* Характеристики */}
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                        <h2 className="text-white font-semibold mb-4">
                            Parametri
                        </h2>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                            <div className="text-gray-500">Gads</div>
                            <div className="text-white">{car.year}</div>

                            <div className="text-gray-500">Nobraukums</div>
                            <div className="text-white">
                                {Number(car.mileage).toLocaleString("lv-LV")} km
                            </div>

                            <div className="text-gray-500">Dzinējs</div>
                            <div className="text-white">
                                {fuelLabels[car.fuel_type]}
                            </div>

                            <div className="text-gray-500">Ātrumkārba</div>
                            <div className="text-white">
                                {transmissionLabels[car.transmission]}
                            </div>

                            <div className="text-gray-500">Virsbūve</div>
                            <div className="text-white">
                                {bodyLabels[car.body_type]}
                            </div>

                            {car.engine_volume && (
                                <>
                                    <div className="text-gray-500">
                                        Tilpums
                                    </div>
                                    <div className="text-white">
                                        {car.engine_volume} L
                                    </div>
                                </>
                            )}

                            <div className="text-gray-500">Krāsa</div>
                            <div className="text-white">{car.color}</div>
                        </div>
                    </div>

                    {/* Продавец */}
                    {car.user && (
                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                            <h2 className="text-white font-semibold mb-3">
                                Pārdevējs
                            </h2>
                            <p className="text-white">{car.user.name}</p>
                            {car.user.phone && (
                                <a
                                    href={`tel:${car.user.phone}`}
                                    className="flex items-center gap-2 text-amber-500 hover:text-amber-400 mt-2 transition-colors"
                                >
                                    <PhoneIcon className="w-4 h-4" />
                                    {car.user.phone}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Кнопки редактирования (владелец или админ) */}
                    {user &&
                        (car.user_id === user.id ||
                            user.role === "admin") && (
                            <div className="flex gap-3">
                                <Link
                                    to={`/cars/${car.id}/edit`}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-center py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    Rediģēt
                                </Link>
                            </div>
                        )}
                </div>
            </div>

            {/* Описание */}
            {car.description && (
                <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h2 className="text-white font-semibold mb-3">
                        Apraksts
                    </h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {car.description}
                    </p>
                </div>
            )}
        </div>
    );
}
