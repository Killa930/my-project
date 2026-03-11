<?php

namespace App\Http\Controllers\Api;

/*
 * ManufacturerController — отдаёт данные для выпадающих списков
 * 
 * Когда пользователь открывает фильтры на фронтенде, React запрашивает:
 * - GET /api/manufacturers      → список всех марок (для первого dropdown)
 * - GET /api/manufacturers/1/models → модели конкретной марки (для второго dropdown)
 * 
 * Это классический паттерн "зависимые выпадающие списки":
 * выбрал марку BMW → подгружаются только модели BMW.
 */

use App\Http\Controllers\Controller;
use App\Models\Manufacturer;
use App\Models\CarModel;

class ManufacturerController extends Controller
{
    /*
     * Список всех марок, отсортированных по алфавиту.
     * 
     * GET /api/manufacturers
     * Ответ: [{ "id": 1, "name": "Audi" }, { "id": 2, "name": "BMW" }, ...]
     */
    public function index()
    {
        $manufacturers = Manufacturer::orderBy('name')->get(['id', 'name', 'logo']);

        return response()->json($manufacturers);
    }

    /*
     * Модели конкретной марки.
     * 
     * GET /api/manufacturers/2/models (где 2 = id BMW)
     * Ответ: [{ "id": 5, "name": "3 Series" }, { "id": 6, "name": "5 Series" }, ...]
     */
    public function models(Manufacturer $manufacturer)
    {
        $models = $manufacturer->carModels()->orderBy('name')->get(['id', 'name']);

        return response()->json($models);
    }
}
