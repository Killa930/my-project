<?php

namespace App\Models;

/*
 * Модель CAR_MODEL — конкретная модель автомобиля (3 Series, A4, Corolla...)
 * 
 * Каждая модель принадлежит одной марке (manufacturer).
 * И к каждой модели может быть привязано много объявлений (cars).
 * 
 * ВАЖНО: $table = 'car_models' — явно указываем имя таблицы.
 * По умолчанию Laravel ищет таблицу по имени класса: CarModel → car_models.
 * В данном случае совпадает, но лучше указать явно для ясности.
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarModel extends Model
{
    use HasFactory;

    protected $table = 'car_models';

    protected $fillable = [
        'manufacturer_id',
        'name',
    ];

    // ========== СВЯЗИ ==========

    /*
     * Модель принадлежит одной марке.
     * belongsTo = "принадлежит"
     * 
     * Использование: $carModel->manufacturer — вернёт объект Manufacturer
     * Пример: $carModel->manufacturer->name → "BMW"
     */
    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    /*
     * К одной модели может быть привязано много объявлений.
     * Например, может быть 10 разных BMW 3 Series на продажу.
     */
    public function cars()
    {
        return $this->hasMany(Car::class);
    }
}
