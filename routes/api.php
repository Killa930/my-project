<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;

Route::get('/cars', [CarController::class, 'index']);



