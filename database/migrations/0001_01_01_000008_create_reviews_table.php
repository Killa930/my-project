<?php

/*
 * Таблица REVIEWS — atsauksmes (отзывы)
 * 
 * Покупатель может оставить отзыв только после завершённого darījums.
 * Содержит оценку (1-5) и текстовый комментарий.
 * 
 * Связи:
 *   transaction_id → transactions.id (за какой darījums отзыв)
 *   user_id → users.id (кто написал отзыв)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Ссылка на завершённую сделку
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();

            // Автор отзыва
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Оценка от 1 до 5
            $table->unsignedTinyInteger('rating');

            // Текстовый комментарий
            $table->text('comment')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
