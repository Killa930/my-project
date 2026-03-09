<?php

namespace Database\Seeders;

/*
 * CarSeeder — создаёт тестовых пользователей и объявления
 * 
 * Создаёт:
 * - 1 администратора (admin@carbuy.lv / password)
 * - 1 обычного пользователя (user@carbuy.lv / password)
 * - 15 тестовых объявлений с разными характеристиками
 * 
 * Зачем: чтобы при разработке фронтенда было что показывать,
 * фильтровать, сортировать.
 */

use App\Models\User;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\CarModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        // === СОЗДАЁМ ПОЛЬЗОВАТЕЛЕЙ ===

        /*
         * Админ — можешь входить как admin@carbuy.lv с паролем "password"
         * Обрати внимание: role задаётся напрямую, а не через $fillable.
         * Это безопасно потому что мы в сидере, а не в контроллере.
         */
        $admin = User::firstOrCreate(
            ['email' => 'admin@carbuy.lv'],
            [
                'name' => 'Administrators',
                'password' => Hash::make('password'),
                'phone' => '+371 20000001',
                'role' => 'admin',
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'user@carbuy.lv'],
            [
                'name' => 'Jānis Bērziņš',
                'password' => Hash::make('password'),
                'phone' => '+371 20000002',
                'role' => 'user',
            ]
        );

        // === ТЕСТОВЫЕ ОБЪЯВЛЕНИЯ ===

        /*
         * Каждое объявление — ассоциативный массив с данными.
         * 'manufacturer' и 'model' используются для поиска car_model_id.
         * 
         * Разнообразие данных важно для тестирования:
         * - разные марки, типы топлива, кузова, цены
         * - чтобы фильтры и сортировка работали корректно
         */
        $listings = [
            [
                'manufacturer' => 'BMW', 'model' => '3 Series',
                'year' => 2019, 'price' => 24500, 'mileage' => 67000,
                'fuel_type' => 'diesel', 'body_type' => 'sedan',
                'transmission' => 'automatic', 'engine_volume' => 2.0,
                'color' => 'Melns', 'status' => 'active',
                'description' => 'BMW 320d, lieliski uzturēts, pilna servisa vēsture. LED lukturi, navigācija, ādas salons.',
            ],
            [
                'manufacturer' => 'Audi', 'model' => 'A4',
                'year' => 2020, 'price' => 27900, 'mileage' => 45000,
                'fuel_type' => 'petrol', 'body_type' => 'wagon',
                'transmission' => 'automatic', 'engine_volume' => 2.0,
                'color' => 'Balts', 'status' => 'active',
                'description' => 'Audi A4 Avant, S-line pakete, virtuālais kokpits, B&O skaņas sistēma.',
            ],
            [
                'manufacturer' => 'Volkswagen', 'model' => 'Golf',
                'year' => 2018, 'price' => 15900, 'mileage' => 89000,
                'fuel_type' => 'diesel', 'body_type' => 'hatchback',
                'transmission' => 'manual', 'engine_volume' => 1.6,
                'color' => 'Pelēks', 'status' => 'active',
                'description' => 'VW Golf 7.5, ekonomisks dīzelis, labi uzturēts, jaunas riepas.',
            ],
            [
                'manufacturer' => 'Toyota', 'model' => 'RAV4',
                'year' => 2021, 'price' => 35500, 'mileage' => 32000,
                'fuel_type' => 'hybrid', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 2.5,
                'color' => 'Zils', 'status' => 'active',
                'description' => 'Toyota RAV4 Hybrid, ļoti ekonomisks, pilna drošības pakete, kamera 360°.',
            ],
            [
                'manufacturer' => 'Mercedes-Benz', 'model' => 'C-Class',
                'year' => 2017, 'price' => 22900, 'mileage' => 95000,
                'fuel_type' => 'diesel', 'body_type' => 'sedan',
                'transmission' => 'automatic', 'engine_volume' => 2.1,
                'color' => 'Sudrabs', 'status' => 'active',
                'description' => 'Mercedes C220d, AMG pakete, panorāmas jumts, COMAND navigācija.',
            ],
            [
                'manufacturer' => 'Volvo', 'model' => 'XC60',
                'year' => 2020, 'price' => 38900, 'mileage' => 55000,
                'fuel_type' => 'diesel', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 2.0,
                'color' => 'Melns', 'status' => 'active',
                'description' => 'Volvo XC60 D5 AWD, Inscription pakete, Bowers & Wilkins audio, Head-Up displejs.',
            ],
            [
                'manufacturer' => 'Škoda', 'model' => 'Octavia',
                'year' => 2021, 'price' => 21500, 'mileage' => 41000,
                'fuel_type' => 'petrol', 'body_type' => 'wagon',
                'transmission' => 'automatic', 'engine_volume' => 1.5,
                'color' => 'Balts', 'status' => 'active',
                'description' => 'Škoda Octavia Combi, Style pakete, virtuālais kokpits, LED Matrix lukturi.',
            ],
            [
                'manufacturer' => 'Hyundai', 'model' => 'Tucson',
                'year' => 2022, 'price' => 32000, 'mileage' => 18000,
                'fuel_type' => 'hybrid', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 1.6,
                'color' => 'Zaļš', 'status' => 'active',
                'description' => 'Hyundai Tucson Hybrid, jaunais modelis, Premium pakete, BOSE audio.',
            ],
            [
                'manufacturer' => 'Ford', 'model' => 'Mustang',
                'year' => 2019, 'price' => 42000, 'mileage' => 28000,
                'fuel_type' => 'petrol', 'body_type' => 'coupe',
                'transmission' => 'automatic', 'engine_volume' => 5.0,
                'color' => 'Sarkans', 'status' => 'active',
                'description' => 'Ford Mustang GT 5.0 V8, 450 ZS, aktīvā izpūtēja sistēma, Recaro sēdekļi.',
            ],
            [
                'manufacturer' => 'Mazda', 'model' => 'CX-5',
                'year' => 2020, 'price' => 26500, 'mileage' => 52000,
                'fuel_type' => 'petrol', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 2.5,
                'color' => 'Sarkans', 'status' => 'active',
                'description' => 'Mazda CX-5, SkyActiv-G, pilna drošības pakete, ādas salons, BOSE.',
            ],
            [
                'manufacturer' => 'Kia', 'model' => 'Sportage',
                'year' => 2023, 'price' => 34900, 'mileage' => 12000,
                'fuel_type' => 'hybrid', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 1.6,
                'color' => 'Pelēks', 'status' => 'active',
                'description' => 'Kia Sportage HEV, GT-Line pakete, panorāmas displejs, ventilējamie sēdekļi.',
            ],
            [
                'manufacturer' => 'Peugeot', 'model' => '3008',
                'year' => 2019, 'price' => 19900, 'mileage' => 73000,
                'fuel_type' => 'diesel', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 1.5,
                'color' => 'Zils', 'status' => 'active',
                'description' => 'Peugeot 3008, i-Cockpit, GT-Line, digitālais panelis, Apple CarPlay.',
            ],
            [
                'manufacturer' => 'Volkswagen', 'model' => 'Passat',
                'year' => 2017, 'price' => 16500, 'mileage' => 120000,
                'fuel_type' => 'diesel', 'body_type' => 'wagon',
                'transmission' => 'automatic', 'engine_volume' => 2.0,
                'color' => 'Melns', 'status' => 'sold',
                'description' => 'VW Passat Variant, Highline, digitālais panelis, DCC piekare, LED.',
            ],
            [
                'manufacturer' => 'Nissan', 'model' => 'Leaf',
                'year' => 2021, 'price' => 23900, 'mileage' => 25000,
                'fuel_type' => 'electric', 'body_type' => 'hatchback',
                'transmission' => 'automatic', 'engine_volume' => null,
                'color' => 'Balts', 'status' => 'active',
                'description' => 'Nissan Leaf 40kWh, ProPilot, e-Pedal, ātrā uzlāde CHAdeMO.',
            ],
            [
                'manufacturer' => 'BMW', 'model' => 'X5',
                'year' => 2018, 'price' => 45000, 'mileage' => 78000,
                'fuel_type' => 'diesel', 'body_type' => 'suv',
                'transmission' => 'automatic', 'engine_volume' => 3.0,
                'color' => 'Melns', 'status' => 'active',
                'description' => 'BMW X5 xDrive30d, M-Sport pakete, panorāmas jumts, gaisa piekare, Harman Kardon.',
            ],
        ];

        foreach ($listings as $index => $listing) {
            /*
             * Atrodam car_model_id:
             * 1) Vispirms atrodam ražotāju pēc nosaukuma
             * 2) Tad atrodam modeli, kas pieder šim ražotājam
             * 
             * whereHas — meklē CarModel, kuram manufacturer.name = norādītais.
             * Tas ir JOIN caur Eloquent — elegantāk nekā rakstīt SQL.
             */
            $carModel = CarModel::whereHas('manufacturer', function ($q) use ($listing) {
                $q->where('name', $listing['manufacturer']);
            })->where('name', $listing['model'])->first();

            // Ja modelis nav atrasts — izlaižam (nevajadzētu notikt ar pareiziem datiem)
            if (!$carModel) continue;

            // Объявления чередуются между admin и user
            $car = Car::create([
                'user_id' => $index % 2 === 0 ? $admin->id : $user->id,
                'car_model_id' => $carModel->id,
                'year' => $listing['year'],
                'price' => $listing['price'],
                'mileage' => $listing['mileage'],
                'fuel_type' => $listing['fuel_type'],
                'body_type' => $listing['body_type'],
                'transmission' => $listing['transmission'],
                'engine_volume' => $listing['engine_volume'],
                'color' => $listing['color'],
                'description' => $listing['description'],
                'status' => $listing['status'],
            ]);

            /*
             * Создаём заглушку для главного фото.
             * Позже, когда сделаем загрузку фото, заменим на реальные.
             * Пока что фронтенд будет показывать placeholder.
             */
            CarImage::create([
                'car_id' => $car->id,
                'image_path' => 'placeholder.jpg',
                'is_main' => true,
                'sort_order' => 0,
            ]);
        }
    }
}
