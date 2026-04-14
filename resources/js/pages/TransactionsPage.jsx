import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { CheckCircleIcon, XCircleIcon, ClockIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const statusLabels = { pending: "Gaida apstiprinājumu", completed: "Pabeigts", failed: "Noraidīts" };
const statusIcons = { pending: <ClockIcon className="w-4 h-4 text-status-warning" />, completed: <CheckCircleIcon className="w-4 h-4 text-status-success" />, failed: <XCircleIcon className="w-4 h-4 text-status-danger" /> };
const statusColors = { pending: "bg-status-warningBg text-status-warning border-status-warning/20", completed: "bg-status-successBg text-status-success border-status-success/20", failed: "bg-status-dangerBg text-status-danger border-status-danger/20" };

function ReviewForm({ transactionId, onSubmitted, toast }) {
    const [rating, setRating] = useState(0); const [hover, setHover] = useState(0); const [comment, setComment] = useState(""); const [loading, setLoading] = useState(false);
    const submit = async () => { if (!rating) return; setLoading(true);
        try { await api.post("/reviews", { transaction_id: transactionId, rating, comment: comment || null }); toast.success("Atsauksme nosūtīta!"); onSubmitted(); }
        catch (e) { toast.error(e.response?.data?.message || "Kļūda"); } finally { setLoading(false); } };
    return (<div className="mt-3 bg-surface-tertiary rounded-lg p-4"><p className="text-content-primary text-sm font-medium mb-2">Uzrakstīt atsauksmi</p>
        <div className="flex gap-1 mb-3">{[1,2,3,4,5].map((s) => <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
            {s <= (hover || rating) ? <StarSolidIcon className="w-6 h-6 text-accent" /> : <StarIcon className="w-6 h-6 text-content-muted" />}</button>)}</div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Komentārs..." className="w-full bg-surface-secondary border border-border text-content-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent mb-3" rows="2" />
        <button onClick={submit} disabled={!rating || loading} className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted px-4 py-2 rounded-lg text-sm font-semibold transition-colors">{loading ? "Nosūta..." : "Nosūtīt"}</button></div>);
}

function ExistingReview({ review }) {
    return (<div className="mt-3 bg-surface-tertiary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1"><div className="flex">{[1,2,3,4,5].map((s) => <StarSolidIcon key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent" : "text-content-muted"}`} />)}</div>
            <span className="text-content-muted text-xs">{review.user?.name}</span></div>
        {review.comment && <p className="text-content-secondary text-sm">{review.comment}</p>}</div>);
}

export default function TransactionsPage() {
    const { user } = useAuth(); const toast = useToast();
    const [transactions, setTransactions] = useState([]); const [loading, setLoading] = useState(true); const [activeTab, setActiveTab] = useState("all");
    useEffect(() => { load(); }, []);
    const load = async () => { setLoading(true); try { const r = await api.get("/transactions"); setTransactions(r.data); } catch {} finally { setLoading(false); } };
    const changeStatus = async (id, s) => { try { await api.put(`/transactions/${id}`, { status: s }); toast.success(s === "completed" ? "Apstiprināts!" : "Noraidīts"); load(); } catch (e) { toast.error(e.response?.data?.message || "Kļūda"); } };
    const filtered = activeTab === "all" ? transactions : transactions.filter((t) => t.role === activeTab);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade"><h1 className="text-2xl font-bold text-content-primary mb-6">Darījumi</h1></AnimateIn>
            <AnimateIn delay={100}>
                <div className="flex bg-surface-tertiary rounded-lg p-1 mb-6 w-fit">
                    {[{k:"all",l:"Visi"},{k:"buyer",l:"Es pērku"},{k:"seller",l:"Man pērk"}].map((tab) => (
                        <button key={tab.k} onClick={() => setActiveTab(tab.k)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab.k ? "bg-accent text-content-inverted" : "text-content-secondary hover:text-content-primary"}`}>{tab.l}</button>))}
                </div>
            </AnimateIn>
            {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
            : filtered.length === 0 ? <AnimateIn><div className="text-center py-16 bg-surface-secondary border border-border rounded-xl"><p className="text-content-muted text-lg">Nav darījumu</p></div></AnimateIn>
            : <div className="space-y-4">{filtered.map((t, i) => (
                <AnimateIn key={t.id} delay={i * 80}>
                    <div className="bg-surface-secondary border border-border rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div><Link to={`/cars/${t.car?.id || t.ad_id}`} className="text-content-primary font-semibold hover:text-accent transition-colors">{t.car?.car_model?.manufacturer?.name} {t.car?.car_model?.name}</Link>
                                <p className="text-accent font-bold mt-1">{Number(t.amount).toLocaleString("lv-LV")} €</p>
                                <div className="flex items-center gap-3 mt-2 text-sm"><span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${statusColors[t.status]}`}>{statusIcons[t.status]}{statusLabels[t.status]}</span>
                                    <span className="text-content-muted">{t.role === "buyer" ? `Pārdevējs: ${t.car?.user?.name || "—"}` : `Pircējs: ${t.buyer?.name || "—"}`}</span></div></div>
                            {t.role === "seller" && t.status === "pending" && <div className="flex gap-2">
                                <button onClick={() => changeStatus(t.id, "completed")} className="flex items-center gap-1 bg-status-success text-white px-3 py-2 rounded-lg text-sm font-medium"><CheckCircleIcon className="w-4 h-4" /> Apstiprināt</button>
                                <button onClick={() => changeStatus(t.id, "failed")} className="flex items-center gap-1 bg-status-danger text-white px-3 py-2 rounded-lg text-sm font-medium"><XCircleIcon className="w-4 h-4" /> Noraidīt</button></div>}
                        </div>
                        {t.status === "completed" && t.role === "buyer" && (t.review ? <ExistingReview review={t.review} /> : <ReviewForm transactionId={t.id} onSubmitted={load} toast={toast} />)}
                        {t.status === "completed" && t.role === "seller" && t.review && <ExistingReview review={t.review} />}
                    </div>
                </AnimateIn>
            ))}</div>}
        </div>
    );
}
