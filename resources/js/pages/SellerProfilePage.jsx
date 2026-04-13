/*
 * SellerProfilePage — публичный профиль продавца
 *
 * Любой может открыть /seller/5 и увидеть:
 * - Имя продавца, дату регистрации
 * - Средний рейтинг и количество отзывов
 * - Все отзывы со звёздами
 * - Активные объявления этого продавца
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function SellerProfilePage() {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSellerData();
    }, [id]);

    const loadSellerData = async () => {
        setLoading(true);
        try {
            // Загружаем объявления продавца (из каталога фильтруем)
            const carsRes = await api.get("/cars", {
                params: { status: "active" },
            });
            const sellerCars = (carsRes.data.data || []).filter(
                (c) => c.user_id === Number(id)
            );
            setCars(sellerCars);

            // Получаем имя продавца из первого объявления или из карточки авто
            if (sellerCars.length > 0 && sellerCars[0].user) {
                setSeller(sellerCars[0].user);
            } else {
                // Если нет объявлений — пробуем загрузить через любое авто
                const carRes = await api.get("/cars", {
                    params: { status: "all" },
                });
                const anyUserCar = (carRes.data.data || []).find(
                    (c) => c.user_id === Number(id)
                );
                if (anyUserCar) {
                    // Загружаем карточку авто чтобы получить user
                    const detailRes = await api.get(`/cars/${anyUserCar.id}`);
                    setSeller(detailRes.data.user);
                }
            }

            // Загружаем отзывы
            const reviewsRes = await api.get("/reviews", {
                params: { seller_id: id },
            });
            setReviews(reviewsRes.data.reviews || []);
            setAvgRating(reviewsRes.data.average_rating || 0);
            setTotalReviews(reviewsRes.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Профиль продавца */}
            <div className="bg-surface-secondary border border-border rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center">
                        <span className="text-accent text-2xl font-bold">
                            {seller?.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-content-primary">
                            {seller?.name || "Pārdevējs"}
                        </h1>
                        {seller?.created_at && (
                            <p className="flex items-center gap-1 text-content-muted text-sm mt-1">
                                <CalendarIcon className="w-4 h-4" />
                                Reģistrēts:{" "}
                                {new Date(
                                    seller.created_at
                                ).toLocaleDateString("lv-LV", {
                                    year: "numeric",
                                    month: "long",
                                })}
                            </p>
                        )}

                        {/* Рейтинг */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarSolidIcon
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(avgRating)
                                                ? "text-accent"
                                                : "text-content-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-content-primary font-semibold">
                                {avgRating > 0 ? avgRating : "—"}
                            </span>
                            <span className="text-content-muted text-sm">
                                ({totalReviews}{" "}
                                {totalReviews === 1
                                    ? "atsauksme"
                                    : "atsauksmes"})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Отзывы */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-content-primary mb-4">
                    Atsauksmes
                </h2>

                {reviews.length === 0 ? (
                    <div className="bg-surface-secondary border border-border rounded-xl p-8 text-center">
                        <p className="text-content-muted">
                            Vēl nav atsauksmju
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-surface-secondary border border-border rounded-xl p-5"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-surface-tertiary rounded-full flex items-center justify-center">
                                            <span className="text-content-secondary text-sm font-medium">
                                                {review.user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "?"}
                                            </span>
                                        </div>
                                        <span className="text-content-primary font-medium text-sm">
                                            {review.user?.name || "Lietotājs"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarSolidIcon
                                                key={star}
                                                className={`w-4 h-4 ${
                                                    star <= review.rating
                                                        ? "text-accent"
                                                        : "text-content-muted"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-content-secondary text-sm leading-relaxed">
                                        {review.comment}
                                    </p>
                                )}
                                <p className="text-content-muted text-xs mt-2">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString("lv-LV")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Объявления продавца */}
            <div>
                <h2 className="text-xl font-bold text-content-primary mb-4">
                    Sludinājumi ({cars.length})
                </h2>

                {cars.length === 0 ? (
                    <div className="bg-surface-secondary border border-border rounded-xl p-8 text-center">
                        <p className="text-content-muted">
                            Nav aktīvu sludinājumu
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
