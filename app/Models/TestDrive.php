<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestDrive extends Model
{
    protected $fillable = ['car_id','name','phone','email','preferred_at','status'];

    protected $casts = ['preferred_at' => 'datetime'];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}

