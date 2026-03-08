<?php

namespace App\Models;

/*
 * Модель MANUFACTURER — марка автомобиля (BMW, Audi, Toyota...)
 * 
 * Простая модель. Главное здесь — связь с моделями авто (carModels).
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
    ];

    // ========== СВЯЗИ ==========

    /*
     * У марки может быть МНОГО моделей.
     * BMW → [3 Series, 5 Series, X5, X3...]
     * 
     * Использование: $manufacturer->carModels — вернёт все модели этой марки
     */
    public function carModels()
    {
        return $this->hasMany(CarModel::class);
    }
}
