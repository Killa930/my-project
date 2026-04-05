import { useState, useEffect } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const bodyLabels = { sedan: "Sedans", hatchback: "Hečbeks", wagon: "Universāls", suv: "Apvidus", coupe: "Kupeja", cabriolet: "Kabriolets", minivan: "Minivens", pickup: "Pikaps", other: "Cits" };

export default function AdminPage() {
    const { theme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { api.get("/statistics").then((res) => setStats(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
    if (!stats) return null;

    const fuelData = stats.by_fuel_type.map((i) => ({ name: fuelLabels[i.fuel_type] || i.fuel_type, value: i.count }));
    const bodyData = stats.by_body_type.map((i) => ({ name: bodyLabels[i.body_type] || i.body_type, value: i.count }));

    /* Цвета для графиков адаптируются к теме */
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
    const tickColor = theme === "dark" ? "#9ca3af" : "#6b7280";
    const tooltipBg = theme === "dark" ? "#1f2937" : "#ffffff";
    const tooltipBorder = theme === "dark" ? "#374151" : "#e5e7eb";
    const tooltipText = theme === "dark" ? "#ffffff" : "#111827";

    const tooltipStyle = { backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: tooltipText };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-content-primary mb-8">Administrācija</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {[
                    { label: "Kopā", value: stats.general.total_cars },
                    { label: "Aktīvie", value: stats.general.active_cars, color: "text-status-success" },
                    { label: "Pārdotie", value: stats.general.sold_cars, color: "text-status-danger" },
                    { label: "Lietotāji", value: stats.general.total_users },
                    { label: "Vid. cena", value: `${Number(stats.general.avg_price).toLocaleString("lv-LV")} €`, color: "text-accent" },
                    { label: "Vid. nobrauk.", value: `${Number(stats.general.avg_mileage).toLocaleString("lv-LV")} km` },
                ].map((s, i) => (
                    <div key={i} className="bg-surface-secondary border border-border rounded-xl p-4">
                        <p className="text-content-muted text-xs">{s.label}</p>
                        <p className={`text-xl font-bold mt-1 ${s.color || "text-content-primary"}`}>{s.value}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <h2 className="text-content-primary font-semibold mb-4">Sludinājumi pēc ražotāja</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.by_manufacturer}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fill: tickColor }} /><Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <h2 className="text-content-primary font-semibold mb-4">Sadalījums pēc dzinēja</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart><Pie data={fuelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                            {fuelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
                            <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} /></PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <h2 className="text-content-primary font-semibold mb-4">Vidējā cena pēc ražotāja (€)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.avg_price_by_manufacturer}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fill: tickColor }} /><Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Number(v).toLocaleString("lv-LV")} €`} />
                            <Bar dataKey="avg_price" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <h2 className="text-content-primary font-semibold mb-4">Sadalījums pēc virsbūves</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart><Pie data={bodyData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                            {bodyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
                            <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} /></PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
