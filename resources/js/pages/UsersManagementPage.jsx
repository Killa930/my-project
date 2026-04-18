/*
 * UsersManagementPage — страница управления пользователями (только для админа)
 *
 * Показывает список всех пользователей с:
 * - Поиском по имени/email
 * - Фильтром по роли и статусу
 * - Статистикой (сколько объявлений, darījumi, избранного)
 * - Действиями: блокировка, разблокировка, удаление
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import {
    MagnifyingGlassIcon, UserCircleIcon, NoSymbolIcon,
    CheckCircleIcon, TrashIcon, ShieldCheckIcon, ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function UsersManagementPage() {
    const { user: currentUser } = useAuth();
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", role: "", status: "" });
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => { load(); }, [filters]);

    const load = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page };
            Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
            const res = await api.get("/users", { params });
            setUsers(res.data.data || []);
            setPagination({ current: res.data.current_page, last: res.data.last_page, total: res.data.total });
        } catch (err) {
            toast.error("Kļūda ielādējot lietotājus");
        } finally { setLoading(false); }
    };

    const handleBlock = async (user) => {
        try {
            await api.post(`/users/${user.id}/block`);
            toast.success(`${user.name} bloķēts`);
            load(pagination.current);
        } catch (err) {
            toast.error(err.response?.data?.message || "Kļūda");
        } finally { setConfirmAction(null); }
    };

    const handleUnblock = async (user) => {
        try {
            await api.post(`/users/${user.id}/unblock`);
            toast.success(`${user.name} atbloķēts`);
            load(pagination.current);
        } catch {
            toast.error("Kļūda");
        }
    };

    const handleDelete = async (user) => {
        try {
            await api.delete(`/users/${user.id}`);
            toast.success(`${user.name} dzēsts`);
            load(pagination.current);
        } catch (err) {
            toast.error(err.response?.data?.message || "Kļūda");
        } finally { setConfirmAction(null); }
    };

    const inputClass = "w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-content-primary">Lietotāju pārvaldība</h1>
                    <Link to="/admin" className="text-content-secondary hover:text-accent text-sm">← Uz administrāciju</Link>
                </div>
            </AnimateIn>

            {/* Фильтры */}
            <AnimateIn delay={100}>
                <div className="bg-surface-secondary border border-border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative sm:col-span-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
                        <input type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Meklēt pēc vārda vai e-pasta..."
                            className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent" />
                    </div>
                    <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className={inputClass}>
                        <option value="">Visas lomas</option>
                        <option value="user">Lietotāji</option>
                        <option value="admin">Administratori</option>
                    </select>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={inputClass}>
                        <option value="">Visi statusi</option>
                        <option value="active">Aktīvi</option>
                        <option value="blocked">Bloķēti</option>
                    </select>
                </div>
            </AnimateIn>

            {/* Список */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
            ) : users.length === 0 ? (
                <div className="text-center py-16 bg-surface-secondary border border-border rounded-xl">
                    <p className="text-content-muted">Nav atrasts neviens lietotājs</p>
                </div>
            ) : (
                <>
                    <p className="text-content-muted text-sm mb-4">Kopā: {pagination.total}</p>
                    <div className="space-y-3">
                        {users.map((user, i) => (
                            <AnimateIn key={user.id} delay={i * 50}>
                                <div className={`bg-surface-secondary border rounded-xl p-4 ${
                                    user.is_blocked ? "border-status-danger/30" : "border-border"
                                }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Аватар + инфо */}
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                                user.is_blocked ? "bg-status-dangerBg" : "bg-accent-subtle"
                                            }`}>
                                                <span className={`text-xl font-bold ${user.is_blocked ? "text-status-danger" : "text-accent"}`}>
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link to={`/seller/${user.id}`} className="text-content-primary font-semibold hover:text-accent transition-colors">
                                                        {user.name}
                                                    </Link>
                                                    {user.role === "admin" && (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-accent-subtle text-accent border border-accent/20 px-2 py-0.5 rounded">
                                                            <ShieldCheckIcon className="w-3 h-3" /> Admin
                                                        </span>
                                                    )}
                                                    {user.is_blocked && (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-status-dangerBg text-status-danger border border-status-danger/20 px-2 py-0.5 rounded">
                                                            <NoSymbolIcon className="w-3 h-3" /> Bloķēts
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-content-muted text-sm truncate">{user.email}</p>
                                                {user.phone && <p className="text-content-muted text-xs">{user.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Статистика */}
                                        <div className="flex gap-4 text-center shrink-0">
                                            <div>
                                                <p className="text-content-primary font-bold">{user.cars_count || 0}</p>
                                                <p className="text-content-muted text-xs">Sludināj.</p>
                                            </div>
                                            <div>
                                                <p className="text-content-primary font-bold">{user.transactions_count || 0}</p>
                                                <p className="text-content-muted text-xs">Darījumi</p>
                                            </div>
                                            <div>
                                                <p className="text-content-primary font-bold">{user.favorites_count || 0}</p>
                                                <p className="text-content-muted text-xs">Izlase</p>
                                            </div>
                                        </div>

                                        {/* Действия */}
                                        {user.id !== currentUser?.id && user.role !== "admin" && (
                                            <div className="flex gap-2 shrink-0">
                                                {user.is_blocked ? (
                                                    <button onClick={() => handleUnblock(user)}
                                                        className="flex items-center gap-1 bg-status-successBg text-status-success px-3 py-2 rounded-lg text-sm font-medium hover:bg-status-success/20 transition-colors"
                                                        title="Atbloķēt">
                                                        <CheckCircleIcon className="w-4 h-4" /> Atbloķēt
                                                    </button>
                                                ) : (
                                                    <button onClick={() => setConfirmAction({ type: "block", user })}
                                                        className="flex items-center gap-1 bg-status-warningBg text-status-warning px-3 py-2 rounded-lg text-sm font-medium hover:bg-status-warning/20 transition-colors"
                                                        title="Bloķēt">
                                                        <NoSymbolIcon className="w-4 h-4" /> Bloķēt
                                                    </button>
                                                )}
                                                <button onClick={() => setConfirmAction({ type: "delete", user })}
                                                    className="flex items-center gap-1 bg-status-dangerBg text-status-danger px-3 py-2 rounded-lg text-sm font-medium hover:bg-status-danger/20 transition-colors"
                                                    title="Dzēst">
                                                    <TrashIcon className="w-4 h-4" /> Dzēst
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>

                    {/* Пагинация */}
                    {pagination.last > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: pagination.last }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => load(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        page === pagination.current ? "bg-accent text-content-inverted" : "bg-surface-tertiary text-content-secondary hover:bg-border-hover"
                                    }`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Модалка подтверждения */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
                    <div className="bg-surface-secondary border border-border rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                confirmAction.type === "delete" ? "bg-status-dangerBg" : "bg-status-warningBg"
                            }`}>
                                <ExclamationTriangleIcon className={`w-8 h-8 ${
                                    confirmAction.type === "delete" ? "text-status-danger" : "text-status-warning"
                                }`} />
                            </div>
                            <h2 className="text-xl font-bold text-content-primary">
                                {confirmAction.type === "delete" ? "Dzēst lietotāju?" : "Bloķēt lietotāju?"}
                            </h2>
                            <p className="text-content-secondary text-sm mt-2">
                                {confirmAction.type === "delete"
                                    ? `Tiks neatgriezeniski dzēsts lietotājs "${confirmAction.user.name}" un visi viņa dati.`
                                    : `Lietotājs "${confirmAction.user.name}" vairs nevarēs pieslēgties sistēmai.`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmAction(null)}
                                className="flex-1 bg-surface-tertiary hover:bg-border-hover text-content-primary py-2.5 rounded-lg font-medium transition-colors">
                                Atcelt
                            </button>
                            <button
                                onClick={() => confirmAction.type === "delete" ? handleDelete(confirmAction.user) : handleBlock(confirmAction.user)}
                                className={`flex-1 text-white py-2.5 rounded-lg font-bold transition-colors ${
                                    confirmAction.type === "delete" ? "bg-status-danger hover:bg-red-600" : "bg-status-warning hover:bg-amber-600"
                                }`}>
                                {confirmAction.type === "delete" ? "Dzēst" : "Bloķēt"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
