import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { PlusIcon, PencilSquareIcon, TrashIcon, UserIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const statusLabels = { active: "Aktīvs", sold: "Pārdots", inactive: "Neaktīvs" };
const statusColors = {
    active: "bg-status-successBg text-status-success border-status-success/20",
    sold: "bg-status-dangerBg text-status-danger border-status-danger/20",
    inactive: "bg-surface-tertiary text-content-muted border-border",
};

function CarListItem({ car, onDelete, onStatusChange, showOwner = false }) {
    return (
        <div className="bg-surface-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4">
            <Link to={`/cars/${car.id}`} className="w-full sm:w-40 h-28 bg-surface-tertiary rounded-lg overflow-hidden shrink-0">
                <img src={car.main_image?.image_path ? `/storage/${car.main_image.image_path}` : "/images/car-placeholder.svg"}
                    className="w-full h-full object-cover" onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }} />
            </Link>
            <div className="flex-1 min-w-0">
                <Link to={`/cars/${car.id}`} className="text-content-primary font-semibold hover:text-accent transition-colors">
                    {car.car_model?.manufacturer?.name} {car.car_model?.name}</Link>
                <p className="text-accent font-bold mt-1">{Number(car.price).toLocaleString("lv-LV")} €</p>
                <div className="flex items-center flex-wrap gap-3 mt-2">
                    <span className="text-content-muted text-sm">{car.year}</span>
                    <span className="text-content-muted text-sm">{Number(car.mileage).toLocaleString("lv-LV")} km</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[car.status]}`}>{statusLabels[car.status]}</span>
                    {showOwner && car.user && <span className="flex items-center gap-1 text-xs text-content-muted"><UserIcon className="w-3 h-3" />{car.user.name}</span>}
                </div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
                <Link to={`/cars/${car.id}/edit`} className="flex items-center gap-1 text-sm text-content-secondary hover:text-accent transition-colors bg-surface-tertiary px-3 py-2 rounded-lg">
                    <PencilSquareIcon className="w-4 h-4" /> Rediģēt</Link>
                {car.status === "active" ? (
                    <button onClick={() => onStatusChange(car.id, "sold")} className="text-sm text-content-secondary hover:text-status-success transition-colors bg-surface-tertiary px-3 py-2 rounded-lg">Pārdots</button>
                ) : (
                    <button onClick={() => onStatusChange(car.id, "active")} className="text-sm text-content-secondary hover:text-status-success transition-colors bg-surface-tertiary px-3 py-2 rounded-lg">Aktivizēt</button>
                )}
                <button onClick={() => onDelete(car.id)} className="flex items-center gap-1 text-sm text-content-secondary hover:text-status-danger transition-colors bg-surface-tertiary px-3 py-2 rounded-lg">
                    <TrashIcon className="w-4 h-4" /> Dzēst</button>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [myCars, setMyCars] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("my");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => { if (user) loadCars(); }, [user]);

    const loadCars = async () => {
        setLoading(true);
        try {
            const res = await api.get("/cars", { params: { status: "all" } });
            const cars = res.data.data || [];
            setMyCars(cars.filter((c) => c.user_id === user.id));
            if (user.role === "admin") setAllCars(cars);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (carId) => {
        try {
            await api.delete(`/cars/${carId}`);
            setMyCars((p) => p.filter((c) => c.id !== carId));
            setAllCars((p) => p.filter((c) => c.id !== carId));
            toast.success("Sludinājums dzēsts");
        } catch { toast.error("Kļūda dzēšot sludinājumu"); }
    };

    const handleStatusChange = async (carId, s) => {
        try {
            await api.put(`/cars/${carId}`, { status: s });
            const upd = (l) => l.map((c) => (c.id === carId ? { ...c, status: s } : c));
            setMyCars(upd); setAllCars(upd);
            toast.success(s === "sold" ? "Atzīmēts kā pārdots" : "Sludinājums aktivizēts");
        } catch { toast.error("Kļūda mainot statusu"); }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) return;
        setDeleteLoading(true);
        try {
            await api.delete("/account", { data: { password: deletePassword } });
            toast.success("Konts dzēsts");
            await logout();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Kļūda dzēšot kontu");
        } finally { setDeleteLoading(false); }
    };

    const displayCars = activeTab === "all" ? allCars : myCars;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Профиль */}
            <AnimateIn animation="fade">
                <div className="bg-surface-secondary border border-border rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center">
                                <span className="text-accent text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-content-primary">{user?.name}</h1>
                                <p className="text-content-muted">{user?.email}</p>
                                {user?.phone && <p className="text-content-muted text-sm">{user.phone}</p>}
                                {user?.role === "admin" && <span className="inline-block mt-1 text-xs bg-accent-subtle text-accent border border-accent/20 px-2 py-0.5 rounded">Administrators</span>}
                            </div>
                        </div>
                    </div>
                    {/* Ссылки профиля */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                        <Link to="/transactions" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
                            Mani darījumi →
                        </Link>
                        <button onClick={() => setShowDeleteModal(true)} className="text-status-danger hover:text-red-400 text-sm font-medium transition-colors">
                            Dzēst kontu
                        </button>
                        {user?.role === "admin" && (
    <Link to="/admin" className="text-accent hover:text-accent-hover text-sm font-medium transition-colors">
        Statistika →
    </Link>
)}
                    </div>
                </div>
            </AnimateIn>

            {/* Объявления */}
            <AnimateIn delay={150}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-content-primary">Sludinājumi</h2>
                        {user?.role === "admin" && (
                            <div className="flex bg-surface-tertiary rounded-lg p-1">
                                <button onClick={() => setActiveTab("my")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "my" ? "bg-accent text-content-inverted" : "text-content-secondary hover:text-content-primary"}`}>Mani ({myCars.length})</button>
                                <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "all" ? "bg-accent text-content-inverted" : "text-content-secondary hover:text-content-primary"}`}>Visi ({allCars.length})</button>
                            </div>
                        )}
                    </div>
                    <Link to="/cars/create" className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-content-inverted px-4 py-2.5 rounded-lg font-semibold transition-colors">
                        <PlusIcon className="w-4 h-4" /> Pievienot</Link>
                </div>
            </AnimateIn>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
            ) : displayCars.length === 0 ? (
                <AnimateIn><div className="text-center py-16 bg-surface-secondary border border-border rounded-xl">
                    <p className="text-content-muted text-lg mb-4">{activeTab === "all" ? "Nav neviena sludinājuma" : "Jums vēl nav sludinājumu"}</p>
                    <Link to="/cars/create" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-content-inverted px-6 py-3 rounded-lg font-semibold transition-colors"><PlusIcon className="w-4 h-4" /> Izveidot</Link>
                </div></AnimateIn>
            ) : (
                <div className="space-y-4">
                    {displayCars.map((car, i) => (
                        <AnimateIn key={car.id} delay={i * 80}>
                            <CarListItem car={car} onDelete={handleDelete} onStatusChange={handleStatusChange} showOwner={activeTab === "all"} />
                        </AnimateIn>
                    ))}
                </div>
            )}

            {/* Модалка удаления аккаунта */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="relative bg-surface-secondary border border-border rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-status-dangerBg rounded-full flex items-center justify-center mx-auto mb-4">
                                <ExclamationTriangleIcon className="w-8 h-8 text-status-danger" />
                            </div>
                            <h2 className="text-xl font-bold text-content-primary">Dzēst kontu?</h2>
                            <p className="text-content-secondary text-sm mt-2">
                                Šī darbība ir neatgriezeniska. Tiks dzēsti visi jūsu sludinājumi, darījumi un dati.
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-content-secondary text-sm mb-1.5">Ievadiet paroli, lai apstiprinātu</label>
                            <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-status-danger focus:ring-1 focus:ring-status-danger"
                                placeholder="Jūsu parole" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }}
                                className="flex-1 bg-surface-tertiary hover:bg-border-hover text-content-primary py-2.5 rounded-lg font-medium transition-colors">
                                Atcelt
                            </button>
                            <button onClick={handleDeleteAccount} disabled={!deletePassword || deleteLoading}
                                className="flex-1 bg-status-danger hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-bold transition-colors">
                                {deleteLoading ? "Dzēš..." : "Dzēst kontu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
