<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ProfanityFilter;
use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with(['carModel.manufacturer', 'mainImage']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('carModel', fn($q) => $q->where('name', 'LIKE', "%{$search}%"))
                    ->orWhereHas('carModel.manufacturer', fn($q) => $q->where('name', 'LIKE', "%{$search}%"))
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('color', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('manufacturer_id')) $query->whereHas('carModel', fn($q) => $q->where('manufacturer_id', $request->manufacturer_id));
        if ($request->filled('car_model_id')) $query->where('car_model_id', $request->car_model_id);
        if ($request->filled('fuel_type')) $query->where('fuel_type', $request->fuel_type);
        if ($request->filled('body_type')) $query->where('body_type', $request->body_type);
        if ($request->filled('transmission')) $query->where('transmission', $request->transmission);
        if ($request->filled('price_min')) $query->where('price', '>=', $request->price_min);
        if ($request->filled('price_max')) $query->where('price', '<=', $request->price_max);
        if ($request->filled('year_min')) $query->where('year', '>=', $request->year_min);
        if ($request->filled('year_max')) $query->where('year', '<=', $request->year_max);
        if ($request->filled('mileage_max')) $query->where('mileage', '<=', $request->mileage_max);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } elseif (!$request->filled('status')) {
            $query->where('status', 'active');
        }

        $sortField = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc');
        $allowedSorts = ['price', 'year', 'mileage', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $cars = $query->paginate(12);

        // Цензура описаний в списке
        $cars->getCollection()->transform(function ($car) {
            $car->description = ProfanityFilter::clean($car->description);
            return $car;
        });

        return response()->json($cars);
    }

    public function show(Car $car)
    {
        $car->load(['carModel.manufacturer', 'images', 'user:id,name,phone,created_at']);

        // Цензура в описании
        $car->description = ProfanityFilter::clean($car->description);

        return response()->json($car);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_model_id'  => 'required|exists:car_models,id',
            'year'          => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price'         => 'required|numeric|min:0|max:9999999',
            'mileage'       => 'required|integer|min:0',
            'fuel_type'     => 'required|in:petrol,diesel,electric,hybrid,petrol_lpg',
            'body_type'     => 'required|in:sedan,hatchback,wagon,suv,coupe,cabriolet,minivan,pickup,other',
            'transmission'  => 'required|in:manual,automatic',
            'engine_volume' => 'nullable|numeric|min:0|max:15',
            'color'         => 'required|string|max:50',
            'description'   => 'nullable|string|max:5000',
            'images'        => 'required|array|min:1|max:15',
            'images.*'      => 'image|mimes:jpeg,png,webp|max:5120',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'active';

        // Применяем фильтр к описанию
        if (!empty($validated['description'])) {
            $validated['description'] = ProfanityFilter::clean($validated['description']);
        }

        $images = $request->file('images');
        unset($validated['images']);

        $car = Car::create($validated);

        foreach ($images as $index => $image) {
            $path = $image->store('cars', 'public');
            CarImage::create([
                'car_id' => $car->id,
                'image_path' => $path,
                'is_main' => $index === 0,
                'sort_order' => $index,
            ]);
        }

        $car->load(['carModel.manufacturer', 'images']);
        return response()->json($car, 201);
    }

    public function update(Request $request, Car $car)
    {
        if ($car->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        $validated = $request->validate([
            'car_model_id'  => 'sometimes|exists:car_models,id',
            'year'          => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'price'         => 'sometimes|numeric|min:0|max:9999999',
            'mileage'       => 'sometimes|integer|min:0',
            'fuel_type'     => 'sometimes|in:petrol,diesel,electric,hybrid,petrol_lpg',
            'body_type'     => 'sometimes|in:sedan,hatchback,wagon,suv,coupe,cabriolet,minivan,pickup,other',
            'transmission'  => 'sometimes|in:manual,automatic',
            'engine_volume' => 'nullable|numeric|min:0|max:15',
            'color'         => 'sometimes|string|max:50',
            'description'   => 'nullable|string|max:5000',
            'status'        => 'sometimes|in:active,sold,inactive',
        ]);

        // Цензура при обновлении
        if (!empty($validated['description'])) {
            $validated['description'] = ProfanityFilter::clean($validated['description']);
        }

        $car->update($validated);
        $car->load(['carModel.manufacturer', 'images']);
        return response()->json($car);
    }

    public function destroy(Car $car)
    {
        if ($car->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        foreach ($car->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $car->delete();
        return response()->json(['message' => 'Sludinājums dzēsts'], 200);
    }
}
