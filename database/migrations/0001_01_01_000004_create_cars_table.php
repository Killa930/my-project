<?php

/*
 * Таблица CARS — объявления о продаже автомобилей
 * 
 * Это ГЛАВНАЯ таблица проекта. Каждая строка = одно объявление.
 * Содержит все характеристики автомобиля + ссылки на пользователя и модель.
 * 
 * Связи:
 *   user_id → users.id (кто разместил объявление)
 *   car_model_id → car_models.id (какая модель автомобиля)
 *   cars → car_images (у одного авто может быть много фото)
 *   cars → favorites (авто может быть в избранном у многих пользователей)
 * 
 * Поля fuel_type, body_type, transmission — используют ENUM.
 * ENUM — это тип данных, который разрешает только определённые значения.
 * Например fuel_type может быть ТОЛЬКО 'petrol', 'diesel', 'electric', 'hybrid'.
 * Это защищает от неправильных данных в базе.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();

            // === СВЯЗИ ===

            // user_id — кто создал объявление
            // cascadeOnDelete: если удалить пользователя — его объявления тоже удалятся
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // car_model_id — какая модель (через модель можно узнать и марку)
            $table->foreignId('car_model_id')->constrained('car_models')->cascadeOnDelete();

            // === ХАРАКТЕРИСТИКИ АВТО ===

            // year — год выпуска (smallInteger = число до 65535, экономит место)
            $table->smallInteger('year');

            // price — цена в EUR
            // decimal(10, 2) = число с 2 знаками после запятой, до 10 цифр всего
            // Пример: 15999.99, 3500.00
            $table->decimal('price', 10, 2);

            // mileage — пробег в километрах (unsignedInteger = только положительные числа)
            $table->unsignedInteger('mileage');

            // fuel_type — тип топлива
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid', 'petrol_lpg']);

            // body_type — тип кузова
            $table->enum('body_type', [
                'sedan',      // Седан
                'hatchback',  // Хэтчбек
                'wagon',      // Универсал
                'suv',        // Внедорожник
                'coupe',      // Купе
                'cabriolet',  // Кабриолет
                'minivan',    // Минивэн
                'pickup',     // Пикап
                'other'       // Другой
            ]);

            // transmission — коробка передач
            $table->enum('transmission', ['manual', 'automatic']);

            // engine_volume — объём двигателя в литрах (например 2.0, 1.6, 3.5)
            // nullable потому что у электромобилей нет объёма двигателя
            $table->decimal('engine_volume', 3, 1)->nullable();

            // color — цвет автомобиля
            $table->string('color', 50);

            // description — описание объявления, длинный текст
            $table->text('description')->nullable();

            // === СТАТУС ОБЪЯВЛЕНИЯ ===

            // status — текущее состояние объявления:
            // 'active' = видно всем, 'sold' = продано, 'inactive' = скрыто владельцем
            $table->enum('status', ['active', 'sold', 'inactive'])->default('active');

            // === ИНДЕКСЫ ===
            // Индексы ускоряют поиск и фильтрацию по этим полям
            // Без индексов MySQL будет просматривать ВСЮ таблицу при каждом запросе
            $table->index('price');
            $table->index('year');
            $table->index('fuel_type');
            $table->index('body_type');
            $table->index('status');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
