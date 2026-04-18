import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import AnimateIn from "../components/AnimateIn";
import { UsersIcon } from "@heroicons/react/24/outline";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const bodyLabels = { sedan: "Sedans", hatchback: "Hečbeks", wagon: "Universāls", suv: "Apvidus", coupe: "Kupeja", cabriolet: "Kabriolets", minivan: "Minivens", pickup: "Pikaps", other: "Cits" };

export default function AdminPage() {
    const { theme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => { api.get("/statistics").then((r) => setStats(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
    if (!stats) return null;

    const fuelData = stats.by_fuel_type.map((i) => ({ name: fuelLabels[i.fuel_type] || i.fuel_type, value: i.count }));
    const bodyData = stats.by_body_type.map((i) => ({ name: bodyLabels[i.body_type] || i.body_type, value: i.count }));
    const g = theme === "dark" ? "#374151" : "#e5e7eb";
    const t = theme === "dark" ? "#9ca3af" : "#6b7280";
    const ts = { backgroundColor: theme === "dark" ? "#1f2937" : "#fff", border: `1px solid ${g}`, borderRadius: "8px", color: theme === "dark" ? "#fff" : "#111827" };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-content-primary">Administrācija</h1>
                    <Link to="/admin/users" className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-content-inverted px-4 py-2.5 rounded-lg font-semibold transition-colors">
                        <UsersIcon className="w-5 h-5" />
                        Lietotāji
                    </Link>
                </div>
            </AnimateIn>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {[{ l: "Kopā", v: stats.general.total_cars }, { l: "Aktīvie", v: stats.general.active_cars, c: "text-status-success" },
                    { l: "Pārdotie", v: stats.general.sold_cars, c: "text-status-danger" }, { l: "Lietotāji", v: stats.general.total_users },
                    { l: "Vid. cena", v: `${Number(stats.general.avg_price).toLocaleString("lv-LV")} €`, c: "text-accent" },
                    { l: "Vid. nobrauk.", v: `${Number(stats.general.avg_mileage).toLocaleString("lv-LV")} km` }].map((s, i) => (
                        <AnimateIn key={i} delay={i * 80} animation="scale">
                            <div className="bg-surface-secondary border border-border rounded-xl p-4">
                                <p className="text-content-muted text-xs">{s.l}</p>
                                <p className={`text-xl font-bold mt-1 ${s.c || "text-content-primary"}`}>{s.v}</p>
                            </div>
                        </AnimateIn>
                    ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                    { title: "Sludinājumi pēc ražotāja", data: stats.by_manufacturer, key: "count", color: "#ef4444" },
                    { title: "Vidējā cena pēc ražotāja (€)", data: stats.avg_price_by_manufacturer, key: "avg_price", color: "#3b82f6" },
                ].map((chart, i) => (
                    <AnimateIn key={i} delay={200 + i * 150}>
                        <div className="bg-surface-secondary border border-border rounded-xl p-6">
                            <h2 className="text-content-primary font-semibold mb-4">{chart.title}</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chart.data}><CartesianGrid strokeDasharray="3 3" stroke={g} />
                                    <XAxis dataKey="name" tick={{ fill: t, fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis tick={{ fill: t }} /><Tooltip contentStyle={ts} formatter={chart.key === "avg_price" ? (v) => `${Number(v).toLocaleString("lv-LV")} €` : undefined} />
                                    <Bar dataKey={chart.key} fill={chart.color} radius={[4, 4, 0, 0]} /></BarChart>
                            </ResponsiveContainer>
                        </div>
                    </AnimateIn>
                ))}
                {[{ title: "Sadalījums pēc dzinēja", data: fuelData }, { title: "Sadalījums pēc virsbūves", data: bodyData }].map((chart, i) => (
                    <AnimateIn key={i + 2} delay={400 + i * 150}>
                        <div className="bg-surface-secondary border border-border rounded-xl p-6">
                            <h2 className="text-content-primary font-semibold mb-4">{chart.title}</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart><Pie data={chart.data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                                    {chart.data.map((_, j) => <Cell key={j} fill={COLORS[j % COLORS.length]} />)}</Pie>
                                    <Tooltip contentStyle={ts} /><Legend wrapperStyle={{ color: t, fontSize: 12 }} /></PieChart>
                            </ResponsiveContainer>
                        </div>
                    </AnimateIn>
                ))}
            </div>
        </div>
    );
}
