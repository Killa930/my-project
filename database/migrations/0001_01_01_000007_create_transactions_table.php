<?php

/*
 * Таблица TRANSACTIONS — darījumi (заявки на покупку)
 * 
 * Фиксирует взаимодействие между покупателем и продавцом.
 * Покупатель нажимает "Pirkt" → создаётся запись со статусом 'pending'.
 * Продавец может подтвердить ('completed') или отклонить ('failed').
 * 
 * Связи:
 *   ad_id → cars.id (какое объявление)
 *   buyer_id → users.id (кто покупает)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Ссылка на объявление
            $table->foreignId('ad_id')->constrained('cars')->cascadeOnDelete();

            // Покупатель
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();

            // Сумма сделки
            $table->decimal('amount', 10, 2);

            // Статус: pending (ожидает), completed (завершён), failed (отклонён)
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');

            // Дата сделки
            $table->timestamp('transaction_date')->useCurrent();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
