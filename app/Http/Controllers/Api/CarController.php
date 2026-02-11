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

    public function store(Request $request)
{
    $data = $request->validate([
        'brand' => ['required','string'],
        'model' => ['required','string'],
        'year' => ['required','integer'],
        'price' => ['required','numeric'],
        'mileage' => ['nullable','integer'],
        'description' => ['nullable','string'],
    ]);

    $car = \App\Models\Car::create($data);

    return response()->json($car, 201);
}

}



