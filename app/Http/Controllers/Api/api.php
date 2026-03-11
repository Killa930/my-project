<?php

/*
 * API РОУТЫ — определяют какой URL вызывает какой метод контроллера
 * 
 * Все роуты здесь автоматически получают префикс /api/
 * То есть Route::get('/cars') = GET /api/cars
 * 
 * Роуты делятся на 3 группы:
 * 1. Публичные — доступны всем (каталог, марки, авторизация)
 * 2. Защищённые — только для залогиненных (создание, избранное, профиль)
 * 3. Админские — только для администратора (статистика)
 * 
 * middleware('auth:sanctum') — проверяет токен.
 * Если токена нет или он невалидный → 401 ошибка.
 */

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\StatisticsController;
use Illuminate\Support\Facades\Route;

// === ПУБЛИЧНЫЕ РОУТЫ (доступны без авторизации) ===

// Авторизация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Каталог — просмотр доступен всем
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);

// Марки и модели (для фильтров)
Route::get('/manufacturers', [ManufacturerController::class, 'index']);
Route::get('/manufacturers/{manufacturer}/models', [ManufacturerController::class, 'models']);


// === ЗАЩИЩЁННЫЕ РОУТЫ (нужна авторизация) ===

Route::middleware('auth:sanctum')->group(function () {

    // Профиль
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Управление объявлениями (создание, редактирование, удаление)
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);

    // Избранное
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle/{car}', [FavoriteController::class, 'toggle']);

    // Статистика (админ)
    Route::get('/statistics', [StatisticsController::class, 'index']);
});
