<?php

namespace Database\Seeders;

/*
 * DatabaseSeeder — главный сидер, который запускает все остальные.
 * 
 * Порядок важен! ManufacturerSeeder должен быть первым,
 * потому что CarSeeder ссылается на марки и модели.
 * 
 * Запуск: php artisan db:seed
 * Или сброс + заполнение: php artisan migrate:fresh --seed
 */

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Сначала марки и модели (от них зависят объявления)
        $this->call(ManufacturerSeeder::class);

        // 2. Потом пользователи и объявления
        $this->call(CarSeeder::class);
    }
}
