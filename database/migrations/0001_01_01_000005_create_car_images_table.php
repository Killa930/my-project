<?php

/*
 * Таблица CAR_IMAGES — фотографии автомобилей
 * 
 * Зачем отдельная таблица: у одного объявления может быть МНОГО фото
 * (5, 10, 20...). Если бы мы хранили фото прямо в таблице cars,
 * пришлось бы делать колонки image1, image2, image3... — это плохой подход.
 * 
 * Отдельная таблица позволяет хранить сколько угодно фото для каждого авто.
 * Это называется связь "один ко многим" (one-to-many):
 * одно авто → много фото.
 * 
 * Связи: car_id → cars.id
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_images', function (Blueprint $table) {
            $table->id();

            // car_id — к какому объявлению относится фото
            $table->foreignId('car_id')->constrained('cars')->cascadeOnDelete();

            // image_path — путь к файлу фото (например 'cars/abc123.jpg')
            $table->string('image_path');

            // is_main — главное фото (показывается в каталоге и превью)
            // У каждого авто должно быть одно главное фото
            $table->boolean('is_main')->default(false);

            // sort_order — порядок показа фото (0 = первое, 1 = второе...)
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_images');
    }
};
