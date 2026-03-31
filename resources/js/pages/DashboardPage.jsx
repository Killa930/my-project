/*
 * DashboardPage — личный кабинет пользователя
 *
 * Для обычного пользователя: профиль + мои объявления
 * Для админа: профиль + мои объявления + ВСЕ объявления всех пользователей
 */
 
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    UserIcon,
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
 
/*
 * CarListItem — одна строка объявления в списке.
 * Вынесен в отдельный компонент чтобы не дублировать код
 * для "моих" и "всех" объявлений.
 * 
 * showOwner — показывать ли имя владельца (для админской секции)
 */
function CarListItem({ car, onDelete, onStatusChange, showOwner = false }) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
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
                        e.target.src = "/images/car-placeholder.svg";
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
                    {Number(car.price).toLocaleString("lv-LV")} €
                </p>
                <div className="flex items-center flex-wrap gap-3 mt-2">
                    <span className="text-gray-500 text-sm">{car.year}</span>
                    <span className="text-gray-500 text-sm">
                        {Number(car.mileage).toLocaleString("lv-LV")} km
                    </span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded border ${statusColors[car.status]}`}
                    >
                        {statusLabels[car.status]}
                    </span>
                    {/* Показываем владельца в админской секции */}
                    {showOwner && car.user && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <UserIcon className="w-3 h-3" />
                            {car.user.name}
                        </span>
                    )}
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
                        onClick={() => onStatusChange(car.id, "sold")}
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                    >
                        Pārdots
                    </button>
                ) : (
                    <button
                        onClick={() => onStatusChange(car.id, "active")}
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                    >
                        Aktivizēt
                    </button>
                )}
                <button
                    onClick={() => onDelete(car.id)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors bg-gray-800 px-3 py-2 rounded-lg"
                >
                    <TrashIcon className="w-4 h-4" />
                    Dzēst
                </button>
            </div>
        </div>
    );
}
 
export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myCars, setMyCars] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("my"); // 'my' или 'all' (для админа)
 
    useEffect(() => {
        loadCars();
    }, [user]);
 
    const loadCars = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await api.get("/cars", {
                params: { status: "all" },
            });
            const cars = res.data.data || [];
 
            // Мои объявления
            setMyCars(cars.filter((car) => car.user_id === user.id));
 
            // Все объявления (для админа)
            if (user.role === "admin") {
                setAllCars(cars);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
 
    const handleDelete = async (carId) => {
        if (!confirm("Vai tiešām vēlaties dzēst šo sludinājumu?")) return;
        try {
            await api.delete(`/cars/${carId}`);
            setMyCars((prev) => prev.filter((c) => c.id !== carId));
            setAllCars((prev) => prev.filter((c) => c.id !== carId));
        } catch (err) {
            alert("Kļūda dzēšot sludinājumu");
        }
    };
 
    const handleStatusChange = async (carId, newStatus) => {
        try {
            await api.put(`/cars/${carId}`, { status: newStatus });
            const updateList = (list) =>
                list.map((c) =>
                    c.id === carId ? { ...c, status: newStatus } : c
                );
            setMyCars(updateList);
            setAllCars(updateList);
        } catch (err) {
            alert("Kļūda mainot statusu");
        }
    };
 
    // Какие объявления показывать
    const displayCars = activeTab === "all" ? allCars : myCars;
 
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
                        {user?.role === "admin" && (
                            <span className="inline-block mt-1 text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                                Administrators
                            </span>
                        )}
                    </div>
                </div>
            </div>
 
            {/* Заголовок + табы (для админа) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">
                        Sludinājumi
                    </h2>
 
                    {/* Табы — показываются только админу */}
                    {user?.role === "admin" && (
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab("my")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === "my"
                                        ? "bg-amber-500 text-gray-900"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Mani ({myCars.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === "all"
                                        ? "bg-amber-500 text-gray-900"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Visi ({allCars.length})
                            </button>
                        </div>
                    )}
                </div>
 
                <Link
                    to="/cars/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2.5 rounded-lg font-semibold transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Pievienot
                </Link>
            </div>
 
            {/* Список объявлений */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : displayCars.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
                    <p className="text-gray-500 text-lg mb-4">
                        {activeTab === "all"
                            ? "Nav neviena sludinājuma"
                            : "Jums vēl nav sludinājumu"}
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
                    {displayCars.map((car) => (
                        <CarListItem
                            key={car.id}
                            car={car}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                            showOwner={activeTab === "all"}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}