<?php
 
namespace Database\Seeders;
 
use App\Models\User;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\CarModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
 
class CarSeeder extends Seeder
{
    public function run(): void
    {
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
 
        // Создаём папку для фото если нет
        Storage::disk('public')->makeDirectory('cars');
 
        /*
         * Генерируем простые SVG-заглушки с разными цветами для каждого авто.
         * В реальном проекте здесь были бы настоящие фото.
         * Для учебного проекта — цветные заглушки с названием авто.
         */
 
        $listings = [
            ['manufacturer' => 'BMW', 'model' => '3 Series', 'year' => 2019, 'price' => 24500, 'mileage' => 67000, 'fuel_type' => 'diesel', 'body_type' => 'sedan', 'transmission' => 'automatic', 'engine_volume' => 2.0, 'color' => 'Melns', 'status' => 'active', 'description' => 'BMW 320d, lieliski uzturēts, pilna servisa vēsture. LED lukturi, navigācija, ādas salons.', 'img_color' => '#1e3a5f'],
            ['manufacturer' => 'Audi', 'model' => 'A4', 'year' => 2020, 'price' => 27900, 'mileage' => 45000, 'fuel_type' => 'petrol', 'body_type' => 'wagon', 'transmission' => 'automatic', 'engine_volume' => 2.0, 'color' => 'Balts', 'status' => 'active', 'description' => 'Audi A4 Avant, S-line pakete, virtuālais kokpits, B&O skaņas sistēma.', 'img_color' => '#8b0000'],
            ['manufacturer' => 'Volkswagen', 'model' => 'Golf', 'year' => 2018, 'price' => 15900, 'mileage' => 89000, 'fuel_type' => 'diesel', 'body_type' => 'hatchback', 'transmission' => 'manual', 'engine_volume' => 1.6, 'color' => 'Pelēks', 'status' => 'active', 'description' => 'VW Golf 7.5, ekonomisks dīzelis, labi uzturēts, jaunas riepas.', 'img_color' => '#2d5016'],
            ['manufacturer' => 'Toyota', 'model' => 'RAV4', 'year' => 2021, 'price' => 35500, 'mileage' => 32000, 'fuel_type' => 'hybrid', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 2.5, 'color' => 'Zils', 'status' => 'active', 'description' => 'Toyota RAV4 Hybrid, ļoti ekonomisks, pilna drošības pakete, kamera 360°.', 'img_color' => '#1a4d6e'],
            ['manufacturer' => 'Mercedes-Benz', 'model' => 'C-Class', 'year' => 2017, 'price' => 22900, 'mileage' => 95000, 'fuel_type' => 'diesel', 'body_type' => 'sedan', 'transmission' => 'automatic', 'engine_volume' => 2.1, 'color' => 'Sudrabs', 'status' => 'active', 'description' => 'Mercedes C220d, AMG pakete, panorāmas jumts, COMAND navigācija.', 'img_color' => '#4a4a4a'],
            ['manufacturer' => 'Volvo', 'model' => 'XC60', 'year' => 2020, 'price' => 38900, 'mileage' => 55000, 'fuel_type' => 'diesel', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 2.0, 'color' => 'Melns', 'status' => 'active', 'description' => 'Volvo XC60 D5 AWD, Inscription pakete, Bowers & Wilkins audio, Head-Up displejs.', 'img_color' => '#1a1a2e'],
            ['manufacturer' => 'Škoda', 'model' => 'Octavia', 'year' => 2021, 'price' => 21500, 'mileage' => 41000, 'fuel_type' => 'petrol', 'body_type' => 'wagon', 'transmission' => 'automatic', 'engine_volume' => 1.5, 'color' => 'Balts', 'status' => 'active', 'description' => 'Škoda Octavia Combi, Style pakete, virtuālais kokpits, LED Matrix lukturi.', 'img_color' => '#0d4d0d'],
            ['manufacturer' => 'Hyundai', 'model' => 'Tucson', 'year' => 2022, 'price' => 32000, 'mileage' => 18000, 'fuel_type' => 'hybrid', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 1.6, 'color' => 'Zaļš', 'status' => 'active', 'description' => 'Hyundai Tucson Hybrid, jaunais modelis, Premium pakete, BOSE audio.', 'img_color' => '#2e4057'],
            ['manufacturer' => 'Ford', 'model' => 'Mustang', 'year' => 2019, 'price' => 42000, 'mileage' => 28000, 'fuel_type' => 'petrol', 'body_type' => 'coupe', 'transmission' => 'automatic', 'engine_volume' => 5.0, 'color' => 'Sarkans', 'status' => 'active', 'description' => 'Ford Mustang GT 5.0 V8, 450 ZS, aktīvā izpūtēja sistēma, Recaro sēdekļi.', 'img_color' => '#8b0000'],
            ['manufacturer' => 'Mazda', 'model' => 'CX-5', 'year' => 2020, 'price' => 26500, 'mileage' => 52000, 'fuel_type' => 'petrol', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 2.5, 'color' => 'Sarkans', 'status' => 'active', 'description' => 'Mazda CX-5, SkyActiv-G, pilna drošības pakete, ādas salons, BOSE.', 'img_color' => '#6b1d1d'],
            ['manufacturer' => 'Kia', 'model' => 'Sportage', 'year' => 2023, 'price' => 34900, 'mileage' => 12000, 'fuel_type' => 'hybrid', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 1.6, 'color' => 'Pelēks', 'status' => 'active', 'description' => 'Kia Sportage HEV, GT-Line pakete, panorāmas displejs, ventilējamie sēdekļi.', 'img_color' => '#3d3d5c'],
            ['manufacturer' => 'Peugeot', 'model' => '3008', 'year' => 2019, 'price' => 19900, 'mileage' => 73000, 'fuel_type' => 'diesel', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 1.5, 'color' => 'Zils', 'status' => 'active', 'description' => 'Peugeot 3008, i-Cockpit, GT-Line, digitālais panelis, Apple CarPlay.', 'img_color' => '#1b3a4b'],
            ['manufacturer' => 'Volkswagen', 'model' => 'Passat', 'year' => 2017, 'price' => 16500, 'mileage' => 120000, 'fuel_type' => 'diesel', 'body_type' => 'wagon', 'transmission' => 'automatic', 'engine_volume' => 2.0, 'color' => 'Melns', 'status' => 'sold', 'description' => 'VW Passat Variant, Highline, digitālais panelis, DCC piekare, LED.', 'img_color' => '#1a1a1a'],
            ['manufacturer' => 'Nissan', 'model' => 'Leaf', 'year' => 2021, 'price' => 23900, 'mileage' => 25000, 'fuel_type' => 'electric', 'body_type' => 'hatchback', 'transmission' => 'automatic', 'engine_volume' => null, 'color' => 'Balts', 'status' => 'active', 'description' => 'Nissan Leaf 40kWh, ProPilot, e-Pedal, ātrā uzlāde CHAdeMO.', 'img_color' => '#0a5c36'],
            ['manufacturer' => 'BMW', 'model' => 'X5', 'year' => 2018, 'price' => 45000, 'mileage' => 78000, 'fuel_type' => 'diesel', 'body_type' => 'suv', 'transmission' => 'automatic', 'engine_volume' => 3.0, 'color' => 'Melns', 'status' => 'active', 'description' => 'BMW X5 xDrive30d, M-Sport pakete, panorāmas jumts, gaisa piekare, Harman Kardon.', 'img_color' => '#0d1b2a'],
        ];
 
        foreach ($listings as $index => $listing) {
            $carModel = CarModel::whereHas('manufacturer', function ($q) use ($listing) {
                $q->where('name', $listing['manufacturer']);
            })->where('name', $listing['model'])->first();
 
            if (!$carModel) continue;
 
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
 
            // Генерируем SVG-заглушку с цветом и названием авто
            $label = $listing['manufacturer'] . ' ' . $listing['model'];
            $bgColor = $listing['img_color'];
            $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="{$bgColor}"/>
  <rect x="120" y="140" width="400" height="140" rx="20" fill="rgba(255,255,255,0.1)"/>
  <rect x="160" y="120" width="320" height="35" rx="12" fill="rgba(255,255,255,0.1)"/>
  <circle cx="210" cy="280" r="32" fill="{$bgColor}" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
  <circle cx="210" cy="280" r="12" fill="rgba(255,255,255,0.15)"/>
  <circle cx="430" cy="280" r="32" fill="{$bgColor}" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
  <circle cx="430" cy="280" r="12" fill="rgba(255,255,255,0.15)"/>
  <text x="320" y="60" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="28" font-weight="bold">{$label}</text>
  <text x="320" y="90" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="16">{$listing['year']} · {$listing['color']}</text>
  <text x="320" y="360" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="20" font-weight="bold">{$listing['price']} €</text>
</svg>
SVG;
 
            $filename = 'cars/car-' . $car->id . '.svg';
            Storage::disk('public')->put($filename, $svg);
 
            CarImage::create([
                'car_id' => $car->id,
                'image_path' => $filename,
                'is_main' => true,
                'sort_order' => 0,
            ]);
        }
    }
}
