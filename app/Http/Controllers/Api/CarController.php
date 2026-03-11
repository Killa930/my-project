<?php

namespace App\Http\Controllers\Api;

/*
 * CarController — главный контроллер для работы с объявлениями
 * 
 * Обрабатывает все операции с автомобилями:
 * - index()   → GET /api/cars         — список с фильтрами и сортировкой
 * - show()    → GET /api/cars/{id}    — одно объявление (карточка авто)
 * - store()   → POST /api/cars        — создать объявление (нужна авторизация)
 * - update()  → PUT /api/cars/{id}    — редактировать (только своё или админ)
 * - destroy() → DELETE /api/cars/{id} — удалить (только своё или админ)
 * 
 * Это называется CRUD — Create, Read, Update, Delete.
 * Все методы возвращают JSON (не HTML), потому что фронтенд на React.
 */

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    /*
     * INDEX — список автомобилей с фильтрацией, сортировкой, поиском
     * 
     * GET /api/cars?fuel_type=diesel&price_min=5000&price_max=20000&sort=price&order=asc
     * 
     * Это самый сложный метод — здесь реализованы ВСЕ требования из задания:
     * - Простая фильтрация (по одному критерию)
     * - Расширенная фильтрация (несколько критериев одновременно)
     * - Сортировка (по цене, году, пробегу, дате)
     * - Поиск по ключевому слову
     * - JOIN — данные из нескольких таблиц (марка + модель + фото)
     * - Пагинация — разбивка на страницы
     */
    public function index(Request $request)
    {
        /*
         * with() — загружает связанные данные СРАЗУ, одним запросом.
         * Без with() Laravel делал бы отдельный запрос для каждого авто
         * (N+1 проблема). С with() — всего 3-4 запроса вместо 50+.
         * 
         * 'carModel.manufacturer' — загружает модель И её марку.
         * Точка означает вложенную связь: Car → CarModel → Manufacturer
         */
        $query = Car::with(['carModel.manufacturer', 'mainImage']);

        // === ПОИСК ПО КЛЮЧЕВОМУ СЛОВУ ===
        // GET /api/cars?search=BMW+X5
        if ($request->filled('search')) {
            $search = $request->search;
            /*
             * whereHas — ищет авто, у которых СВЯЗАННАЯ модель или марка
             * содержит искомое слово. LIKE '%bmw%' = содержит "bmw" в любом месте.
             * 
             * orWhereHas — ИЛИ. Ищет по марке ИЛИ по модели ИЛИ по описанию.
             */
            $query->where(function ($q) use ($search) {
                $q->whereHas('carModel', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('carModel.manufacturer', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('color', 'LIKE', "%{$search}%");
            });
        }

        // === ФИЛЬТРЫ ===

        // Фильтр по марке: GET /api/cars?manufacturer_id=1
        if ($request->filled('manufacturer_id')) {
            $query->whereHas('carModel', function ($q) use ($request) {
                $q->where('manufacturer_id', $request->manufacturer_id);
            });
        }

        // Фильтр по модели: GET /api/cars?car_model_id=5
        if ($request->filled('car_model_id')) {
            $query->where('car_model_id', $request->car_model_id);
        }

        // Фильтр по типу топлива: GET /api/cars?fuel_type=diesel
        if ($request->filled('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        // Фильтр по типу кузова: GET /api/cars?body_type=suv
        if ($request->filled('body_type')) {
            $query->where('body_type', $request->body_type);
        }

        // Фильтр по коробке передач: GET /api/cars?transmission=automatic
        if ($request->filled('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        // Фильтр по диапазону цен: GET /api/cars?price_min=5000&price_max=20000
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Фильтр по диапазону годов: GET /api/cars?year_min=2018&year_max=2023
        if ($request->filled('year_min')) {
            $query->where('year', '>=', $request->year_min);
        }
        if ($request->filled('year_max')) {
            $query->where('year', '<=', $request->year_max);
        }

        // Фильтр по пробегу: GET /api/cars?mileage_max=100000
        if ($request->filled('mileage_max')) {
            $query->where('mileage', '<=', $request->mileage_max);
        }

        // Фильтр по статусу (по умолчанию показываем только активные)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'active');
        }

        // === СОРТИРОВКА ===
        // GET /api/cars?sort=price&order=asc
        $sortField = $request->input('sort', 'created_at'); // по умолчанию — по дате
        $sortOrder = $request->input('order', 'desc');       // по умолчанию — сначала новые

        // Разрешённые поля для сортировки (защита от SQL-инъекций)
        $allowedSorts = ['price', 'year', 'mileage', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        // === ПАГИНАЦИЯ ===
        // paginate(12) = 12 объявлений на страницу
        // Laravel автоматически добавляет ссылки на следующую/предыдущую страницу
        $cars = $query->paginate(12);

        return response()->json($cars);
    }

    /*
     * SHOW — одно объявление (карточка автомобиля)
     * 
     * GET /api/cars/1
     * 
     * Загружает авто со ВСЕМИ связанными данными:
     * модель, марка, ВСЕ фото, информация о продавце.
     */
    public function show(Car $car)
    {
        $car->load(['carModel.manufacturer', 'images', 'user:id,name,phone,created_at']);

        return response()->json($car);
    }

    /*
     * STORE — создать новое объявление
     * 
     * POST /api/cars
     * 
     * Доступно только авторизованным пользователям.
     * Принимает данные из формы + загруженные фото.
     */
    public function store(Request $request)
    {
        // Валидация — проверяем ВСЕ поля перед сохранением
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
            'images.*'      => 'image|mimes:jpeg,png,webp|max:5120', // макс 5MB на фото
        ]);

        /*
         * Auth::id() — возвращает id текущего залогиненного пользователя.
         * Мы НЕ берём user_id из формы (это было бы дырой в безопасности —
         * кто-то мог бы подставить чужой id). Всегда берём из сессии.
         */
        $validated['user_id'] = Auth::id();
        $validated['status'] = 'active';

        // Убираем images из validated — они сохраняются отдельно
        $images = $request->file('images');
        unset($validated['images']);

        $car = Car::create($validated);

        // Сохраняем фотографии
        foreach ($images as $index => $image) {
            /*
             * store('cars', 'public') — сохраняет файл в storage/app/public/cars/
             * Laravel генерирует уникальное имя файла автоматически.
             * Возвращает путь вроде 'cars/abc123def456.jpg'
             */
            $path = $image->store('cars', 'public');

            CarImage::create([
                'car_id' => $car->id,
                'image_path' => $path,
                'is_main' => $index === 0, // первое фото = главное
                'sort_order' => $index,
            ]);
        }

        // Загружаем связи и возвращаем готовый объект
        $car->load(['carModel.manufacturer', 'images']);

        return response()->json($car, 201); // 201 = Created
    }

    /*
     * UPDATE — редактировать объявление
     * 
     * PUT /api/cars/1
     * 
     * Может редактировать только владелец или админ.
     */
    public function update(Request $request, Car $car)
    {
        // Проверка прав: только владелец или админ
        if ($car->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403); // 403 = Forbidden
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

        /*
         * 'sometimes' вместо 'required' — поле проверяется ТОЛЬКО если оно
         * присутствует в запросе. Это позволяет отправлять только изменённые поля.
         */

        $car->update($validated);
        $car->load(['carModel.manufacturer', 'images']);

        return response()->json($car);
    }

    /*
     * DESTROY — удалить объявление
     * 
     * DELETE /api/cars/1
     * 
     * Удаляет объявление + все его фото из хранилища.
     */
    public function destroy(Car $car)
    {
        if ($car->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        // Удаляем файлы фотографий с диска
        foreach ($car->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        /*
         * delete() удаляет запись из БД.
         * Благодаря cascadeOnDelete() в миграциях, связанные записи
         * (car_images, favorites) удалятся автоматически.
         */
        $car->delete();

        return response()->json(['message' => 'Sludinājums dzēsts'], 200);
    }
}
