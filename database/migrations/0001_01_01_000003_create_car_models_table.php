<?php

/*
 * Таблица CAR_MODELS — модели автомобилей
 * 
 * Зачем: у каждой марки есть конкретные модели.
 * BMW → 3 Series, 5 Series, X5...
 * Audi → A3, A4, Q5...
 * 
 * ВАЖНО: таблица называется "car_models", а не "models", потому что
 * в Laravel слово "Model" зарезервировано (Eloquent Model), и это
 * может вызвать путаницу.
 * 
 * Связи: 
 *   manufacturer_id → manufacturers.id (каждая модель принадлежит одной марке)
 *   car_models → cars (одна модель может быть у многих объявлений)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_models', function (Blueprint $table) {
            $table->id();

            // manufacturer_id — ссылка на таблицу manufacturers
            // constrained() = создаёт внешний ключ (foreign key)
            // Это значит: значение manufacturer_id ОБЯЗАНО существовать в manufacturers.id
            // cascadeOnDelete() = если удалить марку, все её модели тоже удалятся
            $table->foreignId('manufacturer_id')->constrained('manufacturers')->cascadeOnDelete();

            // name — название модели (например "3 Series", "A4", "Corolla")
            $table->string('name');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_models');
    }
};
