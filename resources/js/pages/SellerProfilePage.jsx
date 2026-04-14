import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import AnimateIn from "../components/AnimateIn";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function SellerProfilePage() {
    const { id } = useParams(); const [seller, setSeller] = useState(null); const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0); const [totalReviews, setTotalReviews] = useState(0);
    const [cars, setCars] = useState([]); const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, [id]);
    const load = async () => { setLoading(true);
        try {
            const carsRes = await api.get("/cars", { params: { status: "active" } });
            const sc = (carsRes.data.data || []).filter((c) => c.user_id === Number(id)); setCars(sc);
            if (sc.length > 0) { const d = await api.get(`/cars/${sc[0].id}`); setSeller(d.data.user); }
            else { const all = await api.get("/cars", { params: { status: "all" } }); const any = (all.data.data || []).find((c) => c.user_id === Number(id));
                if (any) { const d = await api.get(`/cars/${any.id}`); setSeller(d.data.user); } }
            const rr = await api.get("/reviews", { params: { seller_id: id } }); setReviews(rr.data.reviews || []); setAvgRating(rr.data.average_rating || 0); setTotalReviews(rr.data.total || 0);
        } catch {} finally { setLoading(false); } };

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <div className="bg-surface-secondary border border-border rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-accent-subtle rounded-full flex items-center justify-center">
                            <span className="text-accent text-2xl font-bold">{seller?.name?.charAt(0)?.toUpperCase() || "?"}</span></div>
                        <div><h1 className="text-xl font-bold text-content-primary">{seller?.name || "Pārdevējs"}</h1>
                            {seller?.created_at && <p className="flex items-center gap-1 text-content-muted text-sm mt-1"><CalendarIcon className="w-4 h-4" />Reģistrēts: {new Date(seller.created_at).toLocaleDateString("lv-LV", { year: "numeric", month: "long" })}</p>}
                            <div className="flex items-center gap-2 mt-2"><div className="flex">{[1,2,3,4,5].map((s) => <StarSolidIcon key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? "text-accent" : "text-content-muted"}`} />)}</div>
                                <span className="text-content-primary font-semibold">{avgRating > 0 ? avgRating : "—"}</span>
                                <span className="text-content-muted text-sm">({totalReviews} {totalReviews === 1 ? "atsauksme" : "atsauksmes"})</span></div></div>
                    </div>
                </div>
            </AnimateIn>

            <AnimateIn delay={150}><h2 className="text-xl font-bold text-content-primary mb-4">Atsauksmes</h2></AnimateIn>
            {reviews.length === 0 ? <AnimateIn delay={200}><div className="bg-surface-secondary border border-border rounded-xl p-8 text-center mb-10"><p className="text-content-muted">Vēl nav atsauksmju</p></div></AnimateIn>
            : <div className="space-y-4 mb-10">{reviews.map((r, i) => (
                <AnimateIn key={r.id} delay={200 + i * 80}>
                    <div className="bg-surface-secondary border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-surface-tertiary rounded-full flex items-center justify-center"><span className="text-content-secondary text-sm font-medium">{r.user?.name?.charAt(0)?.toUpperCase() || "?"}</span></div>
                                <span className="text-content-primary font-medium text-sm">{r.user?.name || "Lietotājs"}</span></div>
                            <div className="flex">{[1,2,3,4,5].map((s) => <StarSolidIcon key={s} className={`w-4 h-4 ${s <= r.rating ? "text-accent" : "text-content-muted"}`} />)}</div></div>
                        {r.comment && <p className="text-content-secondary text-sm leading-relaxed">{r.comment}</p>}
                        <p className="text-content-muted text-xs mt-2">{new Date(r.created_at).toLocaleDateString("lv-LV")}</p></div>
                </AnimateIn>))}</div>}

            <AnimateIn delay={300}><h2 className="text-xl font-bold text-content-primary mb-4">Sludinājumi ({cars.length})</h2></AnimateIn>
            {cars.length === 0 ? <AnimateIn delay={350}><div className="bg-surface-secondary border border-border rounded-xl p-8 text-center"><p className="text-content-muted">Nav aktīvu sludinājumu</p></div></AnimateIn>
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{cars.map((c, i) => <AnimateIn key={c.id} delay={350 + i * 80} animation="scale"><CarCard car={c} /></AnimateIn>)}</div>}
        </div>
    );
}
