<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AranzmanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $putovanja = \App\Models\Putovanje::all();

        $aranzmani = [
            [
                'nazivAranzmana' => 'Bali - Raj na Zemlji',
                'datumOd' => '2026-05-01',
                'datumDo' => '2026-05-15',
                'popust' => 10,
                'cena' => 1200.00,
                'kapacitet' => 20,
                'putovanje_id' => $putovanja->where('lokacija', 'Bali, Indonezija')->first()->id
            ],
            [
                'nazivAranzmana' => 'Rim - Kultura i Istorija',
                'datumOd' => '2026-06-01',
                'datumDo' => '2026-06-10',
                'popust' => 15,
                'cena' => 800.00,
                'kapacitet' => 30,
                'putovanje_id' => $putovanja->where('lokacija', 'Rim, Italija')->first()->id
            ],
            [
                'nazivAranzmana' => 'Pariz - Grad Ljubavi',
                'datumOd' => '2026-07-01',
                'datumDo' => '2026-07-10',
                'popust' => 5,
                'cena' => 900.00,
                'kapacitet' => 25,
                'putovanje_id' => $putovanja->where('lokacija', 'Pariz, Francuska')->first()->id
            ],
            [
                'nazivAranzmana' => 'Skandinavija - Priroda i Avantura',
                'datumOd' => '2026-08-01',
                'datumDo' => '2026-08-15',
                'popust' => 20,
                'cena' => 1500.00,
                'kapacitet' => 15,
                'putovanje_id' => $putovanja->where('lokacija', 'Skandinavija')->first()->id
            ],
            [
                'nazivAranzmana' => 'Amazonija - Istraživanje Džungle',
                'datumOd' => '2026-09-01',
                'datumDo' => '2026-09-15',
                'popust' => 25,
                'cena' => 1800.00,
                'kapacitet' => 10,
                'putovanje_id' => $putovanja->where('lokacija', 'Amazon, Brazil')->first()->id
            ]
        ];

        foreach ($aranzmani as $aranzman) {
            \App\Models\Aranzman::create($aranzman);
        }
    }
}
