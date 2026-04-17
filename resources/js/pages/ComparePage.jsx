/*
 * ComparePage — страница сравнения авто (до 3 машин)
 *
 * Показывает выбранные авто рядом в виде таблицы.
 * Подсвечивает различия и лучшие значения:
 * - Зелёным — меньшая цена, меньший пробег, больший год
 * - Красным — бОльшая цена, пробег, меньший год
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { XMarkIcon, ArrowPathIcon, ScaleIcon } from "@heroicons/react/24/outline";

const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const bodyLabels = { sedan: "Sedans", hatchback: "Hečbeks", wagon: "Universāls", suv: "Apvidus", coupe: "Kupeja", cabriolet: "Kabriolets", minivan: "Minivens", pickup: "Pikaps", other: "Cits" };
const transmissionLabels = { manual: "Manuāla", automatic: "Automāts" };

export default function ComparePage() {
    const { compareIds, removeFromCompare, clearCompare } = useCompare();
    const toast = useToast();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadCars(); }, [compareIds]);

    const loadCars = async () => {
        if (compareIds.length === 0) { setCars([]); setLoading(false); return; }
        setLoading(true);
        try {
            const promises = compareIds.map((id) => api.get(`/cars/${id}`).catch(() => null));
            const results = await Promise.all(promises);
            setCars(results.filter((r) => r).map((r) => r.data));
        } catch {} finally { setLoading(false); }
    };

    const handleRemove = (id) => {
        removeFromCompare(id);
        toast.success("Noņemts no salīdzinājuma");
    };

    const handleClear = () => {
        clearCompare();
        toast.success("Salīdzinājums notīrīts");
    };

    // Определяем лучшее значение для каждого параметра
    const getBestValue = (field, lower = true) => {
        if (cars.length < 2) return null;
        const values = cars.map((c) => Number(c[field])).filter((v) => !isNaN(v));
        if (!values.length) return null;
        return lower ? Math.min(...values) : Math.max(...values);
    };

    const priceBest = getBestValue("price", true);
    const mileageBest = getBestValue("mileage", true);
    const yearBest = getBestValue("year", false);

    const getCellClass = (value, best, lower = true) => {
        if (!best || cars.length < 2) return "text-content-primary";
        const n = Number(value);
        if (n === best) return "text-status-success font-semibold";
        return "text-content-primary";
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;

    if (cars.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
                <AnimateIn>
                    <div className="w-20 h-20 bg-surface-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                        <ScaleIcon className="w-10 h-10 text-content-muted" />
                    </div>
                    <h1 className="text-2xl font-bold text-content-primary mb-3">Salīdzinājums ir tukšs</h1>
                    <p className="text-content-secondary mb-8">
                        Atlasiet auto salīdzināšanai, nospiežot ikonu <ScaleIcon className="w-4 h-4 inline" /> uz sludinājuma kartes.
                    </p>
                    <Link to="/catalog" className="inline-block bg-accent hover:bg-accent-hover text-content-inverted px-6 py-3 rounded-lg font-semibold transition-colors">
                        Atvērt katalogu
                    </Link>
                </AnimateIn>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-content-primary">
                        Salīdzinājums ({cars.length})
                    </h1>
                    <button onClick={handleClear} className="flex items-center gap-2 text-content-muted hover:text-status-danger transition-colors text-sm">
                        <ArrowPathIcon className="w-4 h-4" /> Notīrīt visu
                    </button>
                </div>
            </AnimateIn>

            {/* Карточки-заголовки */}
            <div className={`grid gap-4 mb-6 ${cars.length === 2 ? "grid-cols-2" : cars.length === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
                {cars.map((car, i) => {
                    const img = car.main_image?.image_path || car.images?.[0]?.image_path;
                    return (
                        <AnimateIn key={car.id} delay={i * 100} animation="scale">
                            <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden relative">
                                <button onClick={() => handleRemove(car.id)}
                                    className="absolute top-2 right-2 z-10 bg-surface-primary/80 backdrop-blur rounded-lg p-1.5 text-content-secondary hover:text-status-danger transition-colors">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                                <Link to={`/cars/${car.id}`} className="block">
                                    <div className="aspect-[16/10] bg-surface-tertiary">
                                        <img src={img ? `/storage/${img}` : "/images/car-placeholder.svg"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }} />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-content-primary font-semibold hover:text-accent transition-colors">
                                            {car.car_model?.manufacturer?.name} {car.car_model?.name}
                                        </h3>
                                        <p className="text-accent text-xl font-bold mt-1">
                                            {Number(car.price).toLocaleString("lv-LV")} €
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </AnimateIn>
                    );
                })}
            </div>

            {/* Таблица параметров */}
            <AnimateIn delay={300}>
                <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden">
                    <table className="w-full">
                        <tbody>
                            {/* Цена */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4 w-40">Cena</td>
                                {cars.map((car) => (
                                    <td key={car.id} className={`p-4 ${getCellClass(car.price, priceBest)}`}>
                                        {Number(car.price).toLocaleString("lv-LV")} €
                                    </td>
                                ))}
                            </tr>

                            {/* Год */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Gads</td>
                                {cars.map((car) => (
                                    <td key={car.id} className={`p-4 ${getCellClass(car.year, yearBest)}`}>
                                        {car.year}
                                    </td>
                                ))}
                            </tr>

                            {/* Пробег */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Nobraukums</td>
                                {cars.map((car) => (
                                    <td key={car.id} className={`p-4 ${getCellClass(car.mileage, mileageBest)}`}>
                                        {Number(car.mileage).toLocaleString("lv-LV")} km
                                    </td>
                                ))}
                            </tr>

                            {/* Топливо */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Dzinējs</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4 text-content-primary">
                                        {fuelLabels[car.fuel_type]}
                                    </td>
                                ))}
                            </tr>

                            {/* Коробка */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Ātrumkārba</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4 text-content-primary">
                                        {transmissionLabels[car.transmission]}
                                    </td>
                                ))}
                            </tr>

                            {/* Кузов */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Virsbūve</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4 text-content-primary">
                                        {bodyLabels[car.body_type]}
                                    </td>
                                ))}
                            </tr>

                            {/* Объём */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Tilpums</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4 text-content-primary">
                                        {car.engine_volume ? `${car.engine_volume} L` : "—"}
                                    </td>
                                ))}
                            </tr>

                            {/* Цвет */}
                            <tr className="border-b border-border">
                                <td className="text-content-muted text-sm p-4">Krāsa</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4 text-content-primary">{car.color}</td>
                                ))}
                            </tr>

                            {/* Продавец */}
                            <tr>
                                <td className="text-content-muted text-sm p-4">Pārdevējs</td>
                                {cars.map((car) => (
                                    <td key={car.id} className="p-4">
                                        <Link to={`/seller/${car.user_id}`} className="text-accent hover:text-accent-hover transition-colors">
                                            {car.user?.name || "—"}
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </AnimateIn>

            {/* Легенда */}
            {cars.length >= 2 && (
                <AnimateIn delay={400}>
                    <p className="text-content-muted text-sm mt-4 text-center">
                        <span className="text-status-success font-semibold">Zaļā krāsā</span> izcelti vislabākie parametri
                    </p>
                </AnimateIn>
            )}
        </div>
    );
}
