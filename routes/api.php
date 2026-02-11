<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\AuthController;

Route::get('/cars', [CarController::class, 'index']);


Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// READ доступен всем:
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);

// C/U/D только админ:
Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::post('/cars', [CarController::class, 'store']);      // позже сделаем
    Route::put('/cars/{car}', [CarController::class, 'update']); // позже
    Route::delete('/cars/{car}', [CarController::class, 'destroy']); // позже
});
