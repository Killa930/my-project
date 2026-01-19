<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\TestDriveController;

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);

Route::post('/leads', [LeadController::class, 'store']);
Route::post('/test-drives', [TestDriveController::class, 'store']);
