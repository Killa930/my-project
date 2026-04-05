import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const fuelLabels = { petrol: "Benzīns", diesel: "Dīzelis", electric: "Elektriskais", hybrid: "Hibrīds", petrol_lpg: "Benz./gāze" };
const transmissionLabels = { manual: "Manuāla", automatic: "Automāts" };

export default function CarCard({ car, onFavoriteToggle, isFavorite }) {
    const manufacturer = car.car_model?.manufacturer?.name || "";
    const model = car.car_model?.name || "";
    const imageUrl = car.main_image?.image_path ? `/storage/${car.main_image.image_path}` : "/images/car-placeholder.svg";

    return (
        <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden hover:border-border-hover transition-all duration-300 group">
            <Link to={`/cars/${car.id}`} className="block relative">
                <div className="aspect-[16/10] bg-surface-tertiary overflow-hidden">
                    <img src={imageUrl} alt={`${manufacturer} ${model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }} />
                </div>
                {car.status === "sold" && (
                    <div className="absolute top-3 left-3 bg-status-danger text-white text-xs font-bold px-2.5 py-1 rounded-md">Pārdots</div>
                )}
            </Link>
            <div className="p-4">
                <Link to={`/cars/${car.id}`}>
                    <h3 className="text-content-primary font-semibold text-lg hover:text-accent transition-colors">
                        {manufacturer} {model}
                    </h3>
                </Link>
                <p className="text-accent text-xl font-bold mt-1">{Number(car.price).toLocaleString("lv-LV")} €</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-surface-tertiary text-content-secondary px-2.5 py-1 rounded-md">{car.year}</span>
                    <span className="text-xs bg-surface-tertiary text-content-secondary px-2.5 py-1 rounded-md">{Number(car.mileage).toLocaleString("lv-LV")} km</span>
                    <span className="text-xs bg-surface-tertiary text-content-secondary px-2.5 py-1 rounded-md">{fuelLabels[car.fuel_type] || car.fuel_type}</span>
                    <span className="text-xs bg-surface-tertiary text-content-secondary px-2.5 py-1 rounded-md">{transmissionLabels[car.transmission] || car.transmission}</span>
                    {car.engine_volume && <span className="text-xs bg-surface-tertiary text-content-secondary px-2.5 py-1 rounded-md">{car.engine_volume} L</span>}
                </div>
                {onFavoriteToggle && (
                    <button onClick={() => onFavoriteToggle(car.id)} className="mt-3 flex items-center gap-1 text-sm text-content-muted hover:text-accent transition-colors">
                        {isFavorite ? <HeartSolidIcon className="w-4 h-4 text-accent" /> : <HeartIcon className="w-4 h-4" />}
                        {isFavorite ? "Izlasē" : "Pievienot izlasei"}
                    </button>
                )}
            </div>
        </div>
    );
}
