<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

public function run(): void
{
    DB::table('cars')->insert([
        [
            'brand' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2017,
            'price' => 10900,
            'mileage' => 145000,
            'fuel' => 'Бензин',
            'transmission' => 'Автомат',
            'description' => 'Надёжный городской автомобиль.',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'brand' => 'Volkswagen',
            'model' => 'Passat',
            'year' => 2016,
            'price' => 12500,
            'mileage' => 178000,
            'fuel' => 'Дизель',
            'transmission' => 'Механика',
            'description' => 'Комфортный седан для трассы.',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'brand' => 'BMW',
            'model' => '320d',
            'year' => 2015,
            'price' => 13900,
            'mileage' => 210000,
            'fuel' => 'Дизель',
            'transmission' => 'Автомат',
            'description' => 'Динамика и управляемость.',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
}

}
