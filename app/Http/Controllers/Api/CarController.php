<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;

class CarController extends Controller
{
    public function index()
    {
        return response()->json(
            Car::query()->orderByDesc('id')->get()
        );
    }
}



