/*
 * CarCard — карточка автомобиля для каталога
 *
 * Переиспользуемый компонент — показывается в каталоге, избранном,
 * на главной странице. Принимает объект car через props.
 *
 * Props:
 *   car — объект с данными авто (price, year, mileage, carModel, mainImage...)
 *   onFavoriteToggle — функция для добавления/удаления из избранного (опционально)
 *   isFavorite — в избранном ли (опционально)
 */

import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Маппинг английских значений → латышские подписи для отображения
const fuelLabels = {
    petrol: "Benzīns",
    diesel: "Dīzelis",
    electric: "Elektriskais",
    hybrid: "Hibrīds",
    petrol_lpg: "Benz./gāze",
};

const transmissionLabels = {
    manual: "Manuāla",
    automatic: "Automāts",
};

export default function CarCard({ car, onFavoriteToggle, isFavorite }) {
    /*
     * car.car_model — связанная модель (загружена через with() на бэкенде)
     * car.car_model.manufacturer — связанная марка
     * car.main_image — главное фото
     *
     * Оператор ?. (optional chaining) — защита от ошибки если связь не загружена.
     * car.car_model?.name — если car_model = null, вернёт undefined вместо ошибки.
     */
    const manufacturer = car.car_model?.manufacturer?.name || "";
    const model = car.car_model?.name || "";
    const imageUrl = car.main_image?.image_path
        ? `/storage/${car.main_image.image_path}`
        : "/images/car-placeholder.svg";

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 group">
            {/* Фото */}
            <Link to={`/cars/${car.id}`} className="block relative">
                <div className="aspect-[16/10] bg-gray-800 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={`${manufacturer} ${model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = "/images/car-placeholder.svg";
                        }}
                    />
                </div>

                {/* Бейдж статуса */}
                {car.status === "sold" && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        Pārdots
                    </div>
                )}
            </Link>

            <div className="p-4">
                {/* Заголовок — марка + модель */}
                <Link to={`/cars/${car.id}`}>
                    <h3 className="text-white font-semibold text-lg hover:text-amber-500 transition-colors">
                        {manufacturer} {model}
                    </h3>
                </Link>

                {/* Цена */}
                <p className="text-amber-500 text-xl font-bold mt-1">
                    {Number(car.price).toLocaleString("lv-LV")} €
                </p>

                {/* Характеристики */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md">
                        {car.year}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md">
                        {Number(car.mileage).toLocaleString("lv-LV")} km
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md">
                        {fuelLabels[car.fuel_type] || car.fuel_type}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md">
                        {transmissionLabels[car.transmission] ||
                            car.transmission}
                    </span>
                    {car.engine_volume && (
                        <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md">
                            {car.engine_volume} L
                        </span>
                    )}
                </div>

                {/* Кнопка избранного */}
                {onFavoriteToggle && (
                    <button
                        onClick={() => onFavoriteToggle(car.id)}
                        className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-amber-500 transition-colors"
                    >
                        {isFavorite ? (
                            <HeartSolidIcon className="w-4 h-4 text-amber-500" />
                        ) : (
                            <HeartIcon className="w-4 h-4" />
                        )}
                        {isFavorite ? "Izlasē" : "Pievienot izlasei"}
                    </button>
                )}
            </div>
        </div>
    );
}
