<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MessageController;

// ПУБЛИЧНЫЕ
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);
Route::get('/manufacturers', [ManufacturerController::class, 'index']);
Route::get('/manufacturers/{manufacturer}/models', [ManufacturerController::class, 'models']);
Route::get('/reviews', [ReviewController::class, 'index']);

// ЗАЩИЩЁННЫЕ
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']); // НОВЫЙ
    Route::delete('/account', [AuthController::class, 'deleteAccount']);

    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle/{car}', [FavoriteController::class, 'toggle']);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);

    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/statistics', [StatisticsController::class, 'index']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users/{user}/block', [UserController::class, 'block']);
    Route::post('/users/{user}/unblock', [UserController::class, 'unblock']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/messages/{user}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages-unread-count', [MessageController::class, 'unreadCount']);
    Route::delete('/messages/{user}', [MessageController::class, 'destroy']);
});
