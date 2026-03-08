<?php

/*
 * Таблица MANUFACTURERS — производители (марки) автомобилей
 * 
 * Зачем: отдельная таблица для марок (BMW, Audi, Toyota...) нужна чтобы:
 * 1) Не дублировать название марки в каждом объявлении
 * 2) Пользователь выбирает марку из списка, а не вводит вручную (меньше ошибок)
 * 3) Можно добавить логотип марки
 * 
 * Это называется "нормализация" — данные хранятся в одном месте,
 * а остальные таблицы ссылаются на них по id.
 * 
 * Связи: manufacturers → models (у одной марки много моделей)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manufacturers', function (Blueprint $table) {
            $table->id();

            // name — название марки, уникальное (не может быть два "BMW")
            $table->string('name')->unique();

            // logo — путь к файлу логотипа марки (необязательно)
            $table->string('logo')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manufacturers');
    }
};
