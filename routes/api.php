<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\StatisticsController;

// === ПУБЛИЧНЫЕ РОУТЫ ===

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);

Route::get('/manufacturers', [ManufacturerController::class, 'index']);
Route::get('/manufacturers/{manufacturer}/models', [ManufacturerController::class, 'models']);

// === ЗАЩИЩЁННЫЕ РОУТЫ ===

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle/{car}', [FavoriteController::class, 'toggle']);

    Route::get('/statistics', [StatisticsController::class, 'index']);
});