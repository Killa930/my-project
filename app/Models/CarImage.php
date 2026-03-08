<?php

namespace App\Models;

/*
 * Модель CAR_IMAGE — фотография автомобиля
 * 
 * Простая модель. Каждое фото принадлежит одному объявлению (car).
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'image_path',
        'is_main',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_main' => 'boolean',
        ];
    }

    // ========== СВЯЗИ ==========

    /*
     * Фото принадлежит одному объявлению.
     * Использование: $image->car->price → 15999.99
     */
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
