<?php

namespace App\Models;

/*
 * Модель CAR — объявление о продаже автомобиля
 * 
 * Это центральная модель проекта. Связана почти со всеми другими таблицами.
 * Здесь также определены скоупы (scopes) — готовые фильтры для запросов.
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'car_model_id',
        'year',
        'price',
        'mileage',
        'fuel_type',
        'body_type',
        'transmission',
        'engine_volume',
        'color',
        'description',
        'status',
    ];

    /*
     * casts — автоматическое преобразование типов.
     * Когда Laravel читает price из базы, он получает строку "15999.99".
     * Cast 'decimal:2' автоматически превращает её в число с 2 знаками.
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'engine_volume' => 'decimal:1',
            'year' => 'integer',
            'mileage' => 'integer',
        ];
    }

    // ========== СВЯЗИ ==========

    /*
     * Объявление принадлежит пользователю (кто его создал).
     * Использование: $car->user->name → "Jānis"
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
     * Объявление привязано к модели авто.
     * Использование: $car->carModel->name → "3 Series"
     * 
     * А через модель можно получить марку:
     * $car->carModel->manufacturer->name → "BMW"
     */
    public function carModel()
    {
        return $this->belongsTo(CarModel::class);
    }

    /*
     * У объявления может быть много фотографий.
     * Использование: $car->images — вернёт коллекцию всех фото
     */
    public function images()
    {
        return $this->hasMany(CarImage::class)->orderBy('sort_order');
    }

    /*
     * Главное фото объявления (is_main = true).
     * hasOne = "имеет одно" (а не много)
     * Использование: $car->mainImage->image_path → "cars/abc123.jpg"
     */
    public function mainImage()
    {
        return $this->hasOne(CarImage::class)->where('is_main', true);
    }

    /*
     * Записи избранного для этого авто.
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /*
     * Пользователи, которые добавили это авто в избранное.
     * belongsToMany через таблицу favorites.
     */
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    // ========== СКОУПЫ (Scopes) ==========

    /*
     * Скоупы — это готовые фильтры, которые можно применять к запросам.
     * Вместо: Car::where('status', 'active')->get()
     * Пишем:  Car::active()->get()
     * 
     * Это удобнее и читабельнее, особенно когда фильтров много:
     * Car::active()->where('fuel_type', 'diesel')->where('price', '<', 5000)->get()
     * 
     * scope + Active = scopeActive, вызывается как ->active()
     * Laravel автоматически убирает "scope" и делает первую букву маленькой.
     */

    // Только активные (видимые) объявления
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Фильтр по типу топлива
    public function scopeByFuel($query, $fuelType)
    {
        return $query->where('fuel_type', $fuelType);
    }

    // Фильтр по диапазону цен
    public function scopeByPriceRange($query, $min, $max)
    {
        if ($min) $query->where('price', '>=', $min);
        if ($max) $query->where('price', '<=', $max);
        return $query;
    }

    // Фильтр по диапазону годов
    public function scopeByYearRange($query, $min, $max)
    {
        if ($min) $query->where('year', '>=', $min);
        if ($max) $query->where('year', '<=', $max);
        return $query;
    }
}
