<?php

namespace App\Http\Controllers\Api;

/*
 * FavoriteController — управление избранным
 * 
 * Простой контроллер с тремя действиями:
 * - index()  → показать все избранные авто пользователя
 * - toggle() → добавить/убрать из избранного (один маршрут на оба действия)
 */

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /*
     * INDEX — список избранных авто текущего пользователя
     * 
     * GET /api/favorites
     */
    public function index()
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->with(['car.carModel.manufacturer', 'car.mainImage'])
            ->latest() // сначала последние добавленные
            ->get();

        return response()->json($favorites);
    }

    /*
     * TOGGLE — добавить или убрать из избранного
     * 
     * POST /api/favorites/toggle/5 (где 5 = car_id)
     * 
     * Если авто УЖЕ в избранном — удаляет.
     * Если НЕТ — добавляет.
     * Один маршрут вместо двух (add + remove) — удобнее для фронтенда.
     */
    public function toggle($carId)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('car_id', $carId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'status' => 'removed',
                'message' => 'Noņemts no izlases',
            ]);
        }

        Favorite::create([
            'user_id' => Auth::id(),
            'car_id' => $carId,
        ]);

        return response()->json([
            'status' => 'added',
            'message' => 'Pievienots izlasei',
        ]);
    }
}
