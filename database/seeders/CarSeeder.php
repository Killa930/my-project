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
            'fuel' => 'Benzīns',
            'transmission' => 'Automāts',
            'description' => 'Uzticams izdevīgs auto',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'brand' => 'Volkswagen',
            'model' => 'Passat',
            'year' => 2016,
            'price' => 12500,
            'mileage' => 178000,
            'fuel' => 'Dīzelis',
            'transmission' => 'Manuāls',
            'description' => 'Ērts Sedans daily braukšanai',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'brand' => 'BMW',
            'model' => '320d',
            'year' => 2015,
            'price' => 13900,
            'mileage' => 210000,
            'fuel' => 'Dīzelis',
            'transmission' => 'Automāts',
            'description' => 'Dinamika un ērtība',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
}

}
