<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $q = Car::query()->with('brand')->orderByDesc('created_at');

        if ($request->filled('status')) $q->where('status', $request->string('status'));
        if ($request->filled('brand_id')) $q->where('brand_id', $request->integer('brand_id'));
        if ($request->filled('min_price')) $q->where('price', '>=', $request->integer('min_price'));
        if ($request->filled('max_price')) $q->where('price', '<=', $request->integer('max_price'));

        return $q->paginate(12);
    }

    public function show(Car $car)
    {
        return $car->load('brand');
    }
}

