<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_id',
        'buyer_id',
        'amount',
        'status',
        'transaction_date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transaction_date' => 'datetime',
        ];
    }

    // Объявление (авто)
    public function car()
    {
        return $this->belongsTo(Car::class, 'ad_id');
    }

    // Покупатель
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Продавец (через объявление)
    public function seller()
    {
        return $this->hasOneThrough(User::class, Car::class, 'id', 'id', 'ad_id', 'user_id');
    }

    // Отзыв за этот darījums
    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
