<?php

namespace Database\Seeders;

/*
 * ManufacturerSeeder — заполняет таблицы manufacturers и car_models
 * 
 * Здесь реальные марки и модели, популярные в Латвии.
 * Сидер проверяет firstOrCreate — если запустить повторно,
 * дубликаты НЕ создадутся.
 */

use App\Models\Manufacturer;
use App\Models\CarModel;
use Illuminate\Database\Seeder;

class ManufacturerSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Массив: марка => [список моделей]
         * 
         * Структура специально вынесена в массив, а не захардкожена
         * внутри циклов — так проще добавлять новые марки/модели.
         */
        $data = [
            'Audi' => ['A3', 'A4', 'A5', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
            'BMW' => ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6'],
            'Mercedes-Benz' => ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS'],
            'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'T-Roc', 'ID.4'],
            'Toyota' => ['Corolla', 'Camry', 'RAV4', 'Yaris', 'Land Cruiser', 'C-HR', 'Prius'],
            'Volvo' => ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
            'Ford' => ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Puma', 'Mustang'],
            'Opel' => ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Grandland'],
            'Škoda' => ['Octavia', 'Superb', 'Fabia', 'Kodiaq', 'Karoq', 'Kamiq'],
            'Hyundai' => ['i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq 5'],
            'Kia' => ['Ceed', 'Sportage', 'Sorento', 'Stonic', 'Niro', 'EV6'],
            'Mazda' => ['3', '6', 'CX-5', 'CX-30', 'MX-5', 'CX-60'],
            'Nissan' => ['Qashqai', 'Juke', 'X-Trail', 'Leaf', 'Micra'],
            'Peugeot' => ['208', '308', '3008', '5008', '508'],
            'Renault' => ['Clio', 'Megane', 'Captur', 'Kadjar', 'Arkana'],
            'Honda' => ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'],
            'Mitsubishi' => ['Outlander', 'ASX', 'Eclipse Cross', 'L200'],
            'Subaru' => ['Outback', 'Forester', 'XV', 'Impreza', 'Legacy'],
            'Lexus' => ['IS', 'ES', 'NX', 'RX', 'UX'],
            'Land Rover' => ['Range Rover', 'Range Rover Sport', 'Discovery', 'Defender', 'Evoque'],
        ];

        foreach ($data as $manufacturerName => $models) {
            /*
             * firstOrCreate — ищет запись по name.
             * Если нашёл — возвращает существующую.
             * Если не нашёл — создаёт новую.
             * Это защищает от дубликатов при повторном запуске.
             */
            $manufacturer = Manufacturer::firstOrCreate(['name' => $manufacturerName]);

            foreach ($models as $modelName) {
                CarModel::firstOrCreate([
                    'manufacturer_id' => $manufacturer->id,
                    'name' => $modelName,
                ]);
            }
        }
    }
}
