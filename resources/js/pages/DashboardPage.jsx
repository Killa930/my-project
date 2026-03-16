/*
 * DashboardPage — личный кабинет пользователя
 *
 * Показывает: информация о профиле + список МОИХ объявлений.
 * Пользователь может управлять своими объявлениями (редактировать, удалять).
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

const statusLabels = {
    active: "Aktīvs",
    sold: "Pārdots",
    inactive: "Neaktīvs",
};
const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    sold: "bg-red-500/10 text-red-400 border-red-500/20",
    inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем ВСЕ объявления, потом фильтруем по user_id на клиенте
        // (В идеале нужен отдельный API endpoint /api/my-cars)
        api.get("/cars", { params: { status: "all" } })
            .then((res) => {
                const myCars = (res.data.data || []).filter(
                    (car) => car.user_id === user?.id
                );
                setCars(myCars);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const handleDelete = async (carId) => {
        if (!confirm("Vai tiešām vēlaties dzēst šo sludinājumu?")) return;
        try {
            await api.delete(`/cars/${carId}`);
            setCars((prev) => prev.filter((c) => c.id !== carId));
        } catch (err) {
            alert("Kļūda dzēšot sludinājumu");
        }
    };

    const handleStatusChange = async (carId, newStatus) => {
        try {
            await api.put(`/cars/${carId}`, { status: newStatus });
            setCars((prev) =>
                prev.map((c) =>
                    c.id === carId ? { ...c, status: newStatus } : c
                )
            );
        } catch (err) {
            alert("Kļūda mainot statusu");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Профиль */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <span className="text-amber-500 text-2xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {user?.name}
                        </h1>
                        <p className="text-gray-500">{user?.email}</p>
                        {user?.phone && (
                            <p className="text-gray-500 text-sm">
                                {user.phone}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Мои объявления */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                    Mani sludinājumi
                </h2>
                <Link
                    to="/cars/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2.5 rounded-lg font-semibold transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Pievienot
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : cars.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-500 text-lg mb-4">
                        Jums vēl nav sludinājumu
                    </p>
                    <Link
                        to="/cars/create"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Izveidot pirmo sludinājumu
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                        >
                            {/* Фото */}
                            <Link
                                to={`/cars/${car.id}`}
                                className="w-full sm:w-40 h-28 bg-gray-800 rounded-lg overflow-hidden shrink-0"
                            >
                                <img
                                    src={
                                        car.main_image?.image_path
                                            ? `/storage/${car.main_image.image_path}`
                                            : "/images/car-placeholder.svg"
                                    }
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/car-placeholder.svg";
                                    }}
                                />
                            </Link>

                            {/* Информация */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    to={`/cars/${car.id}`}
                                    className="text-white font-semibold hover:text-amber-500 transition-colors"
                                >
                                    {car.car_model?.manufacturer?.name}{" "}
                                    {car.car_model?.name}
                                </Link>
                                <p className="text-amber-500 font-bold mt-1">
                                    {Number(car.price).toLocaleString("lv-LV")}{" "}
                                    €
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-gray-500 text-sm">
                                        {car.year}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {Number(
                                            car.mileage
                                        ).toLocaleString("lv-LV")}{" "}
                                        km
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded border ${statusColors[car.status]}`}
                                    >
                                        {statusLabels[car.status]}
                                    </span>
                                </div>
                            </div>

                            {/* Действия */}
                            <div className="flex sm:flex-col gap-2 shrink-0">
                                <Link
                                    to={`/cars/${car.id}/edit`}
                                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-amber-500 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                    Rediģēt
                                </Link>
                                {car.status === "active" ? (
                                    <button
                                        onClick={() =>
                                            handleStatusChange(
                                                car.id,
                                                "sold"
                                            )
                                        }
                                        className="text-sm text-gray-400 hover:text-green-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                                    >
                                        Pārdots
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleStatusChange(
                                                car.id,
                                                "active"
                                            )
                                        }
                                        className="text-sm text-gray-400 hover:text-green-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                                    >
                                        Aktivizēt
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Dzēst
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
