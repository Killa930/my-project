<?php

namespace App\Models;

/*
 * Модель FAVORITE — запись в избранном
 * 
 * Связующая модель между User и Car.
 * Каждая запись означает: "пользователь X добавил авто Y в избранное".
 */

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'car_id',
    ];

    // ========== СВЯЗИ ==========

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
