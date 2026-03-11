<?php

namespace App\Http\Controllers\Api;

/*
 * StatisticsController — статистика для админ-панели
 * 
 * Здесь реализованы требования из задания:
 * - Aprēķinu veikšana (COUNT, AVG, SUM)
 * - Grupēšana (GROUP BY)
 * - Результаты для таблиц и диаграмм
 * 
 * GET /api/statistics
 */

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\User;
use App\Models\Manufacturer;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index()
    {
        // === ОБЩИЕ ЦИФРЫ ===

        $general = [
            'total_cars' => Car::count(),                                    // Всего объявлений
            'active_cars' => Car::where('status', 'active')->count(),        // Активных
            'sold_cars' => Car::where('status', 'sold')->count(),            // Проданных
            'total_users' => User::count(),                                  // Всего пользователей
            'avg_price' => round(Car::where('status', 'active')->avg('price'), 2),    // Средняя цена
            'avg_mileage' => round(Car::where('status', 'active')->avg('mileage')),   // Средний пробег
        ];

        // === ОБЪЯВЛЕНИЯ ПО МАРКАМ (для диаграммы) ===
        /*
         * Это JOIN + GROUP BY + COUNT через Eloquent:
         * 
         * SQL эквивалент:
         * SELECT manufacturers.name, COUNT(cars.id) as count
         * FROM cars
         * JOIN car_models ON cars.car_model_id = car_models.id
         * JOIN manufacturers ON car_models.manufacturer_id = manufacturers.id
         * GROUP BY manufacturers.name
         * ORDER BY count DESC
         */
        $byManufacturer = Car::join('car_models', 'cars.car_model_id', '=', 'car_models.id')
            ->join('manufacturers', 'car_models.manufacturer_id', '=', 'manufacturers.id')
            ->select('manufacturers.name', DB::raw('COUNT(cars.id) as count'))
            ->groupBy('manufacturers.name')
            ->orderByDesc('count')
            ->get();

        // === ОБЪЯВЛЕНИЯ ПО ТИПУ ТОПЛИВА ===
        $byFuelType = Car::select('fuel_type', DB::raw('COUNT(*) as count'))
            ->groupBy('fuel_type')
            ->get();

        // === СРЕДНЯЯ ЦЕНА ПО МАРКАМ ===
        $avgPriceByManufacturer = Car::join('car_models', 'cars.car_model_id', '=', 'car_models.id')
            ->join('manufacturers', 'car_models.manufacturer_id', '=', 'manufacturers.id')
            ->select('manufacturers.name', DB::raw('ROUND(AVG(cars.price), 2) as avg_price'))
            ->where('cars.status', 'active')
            ->groupBy('manufacturers.name')
            ->orderByDesc('avg_price')
            ->get();

        // === ОБЪЯВЛЕНИЯ ПО ТИПУ КУЗОВА ===
        $byBodyType = Car::select('body_type', DB::raw('COUNT(*) as count'))
            ->groupBy('body_type')
            ->get();

        // === ОБЪЯВЛЕНИЯ ПО МЕСЯЦАМ (активность) ===
        /*
         * Показывает сколько объявлений создавалось каждый месяц.
         * DATE_FORMAT — MySQL функция для форматирования даты.
         */
        $byMonth = Car::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'general' => $general,
            'by_manufacturer' => $byManufacturer,
            'by_fuel_type' => $byFuelType,
            'avg_price_by_manufacturer' => $avgPriceByManufacturer,
            'by_body_type' => $byBodyType,
            'by_month' => $byMonth,
        ]);
    }
}
