/*
 * AdminPage — панель администратора со статистикой
 *
 * Реализует требования: GROUP BY, COUNT, AVG, диаграммы.
 * Использует recharts для визуализации данных.
 */

import { useState, useEffect } from "react";
import api from "../api/axios";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
];

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

export default function AdminPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/statistics")
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Подготовка данных для диаграмм
    const fuelData = stats.by_fuel_type.map((item) => ({
        name: fuelLabels[item.fuel_type] || item.fuel_type,
        value: item.count,
    }));

    const bodyData = stats.by_body_type.map((item) => ({
        name: bodyLabels[item.body_type] || item.body_type,
        value: item.count,
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-8">
                Administrācija
            </h1>

            {/* === ОБЩАЯ СТАТИСТИКА === */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {[
                    {
                        label: "Kopā sludinājumi",
                        value: stats.general.total_cars,
                    },
                    {
                        label: "Aktīvie",
                        value: stats.general.active_cars,
                        color: "text-green-400",
                    },
                    {
                        label: "Pārdotie",
                        value: stats.general.sold_cars,
                        color: "text-red-400",
                    },
                    {
                        label: "Lietotāji",
                        value: stats.general.total_users,
                    },
                    {
                        label: "Vid. cena",
                        value: `${Number(stats.general.avg_price).toLocaleString("lv-LV")} €`,
                        color: "text-amber-500",
                    },
                    {
                        label: "Vid. nobrauk.",
                        value: `${Number(stats.general.avg_mileage).toLocaleString("lv-LV")} km`,
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                    >
                        <p className="text-gray-500 text-xs">{stat.label}</p>
                        <p
                            className={`text-xl font-bold mt-1 ${stat.color || "text-white"}`}
                        >
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* === ДИАГРАММЫ === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* По маркам — столбчатая */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">
                        Sludinājumi pēc ražotāja
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.by_manufacturer}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#9ca3af", fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis tick={{ fill: "#9ca3af" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* По топливу — круговая */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">
                        Sadalījums pēc dzinēja
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={fuelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {fuelData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Средняя цена по маркам */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">
                        Vidējā cena pēc ražotāja (€)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.avg_price_by_manufacturer}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#9ca3af", fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis tick={{ fill: "#9ca3af" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                                formatter={(value) =>
                                    `${Number(value).toLocaleString("lv-LV")} €`
                                }
                            />
                            <Bar
                                dataKey="avg_price"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* По типу кузова — круговая */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">
                        Sadalījums pēc virsbūves
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={bodyData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {bodyData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
