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
            // Santorini - 3 aranžmana
            [
                'nazivAranzmana' => 'Santorini - Grčka Ostrva',
                'datumOd' => '2026-05-01',
                'datumDo' => '2026-05-15',
                'popust' => 10,
                'cena' => 1200.00,
                'kapacitet' => 20,
                'putovanje_id' => $putovanja->where('lokacija', 'Grčka')->first()->id
            ],
            [
                'nazivAranzmana' => 'Santorini - Romantični Izlet',
                'datumOd' => '2026-06-01',
                'datumDo' => '2026-06-08',
                'popust' => 15,
                'cena' => 950.00,
                'kapacitet' => 15,
                'putovanje_id' => $putovanja->where('lokacija', 'Grčka')->first()->id
            ],
            [
                'nazivAranzmana' => 'Santorini - Letnja Avantura',
                'datumOd' => '2026-07-15',
                'datumDo' => '2026-07-22',
                'popust' => 5,
                'cena' => 1100.00,
                'kapacitet' => 25,
                'putovanje_id' => $putovanja->where('lokacija', 'Grčka')->first()->id
            ],
            
            // Pariz - 3 aranžmana
            [
                'nazivAranzmana' => 'Pariz - Grad Ljubavi',
                'datumOd' => '2026-06-01',
                'datumDo' => '2026-06-10',
                'popust' => 15,
                'cena' => 800.00,
                'kapacitet' => 30,
                'putovanje_id' => $putovanja->where('lokacija', 'Francuska')->first()->id
            ],
            [
                'nazivAranzmana' => 'Pariz - Kulturni Izlet',
                'datumOd' => '2026-08-01',
                'datumDo' => '2026-08-12',
                'popust' => 20,
                'cena' => 750.00,
                'kapacitet' => 20,
                'putovanje_id' => $putovanja->where('lokacija', 'Francuska')->first()->id
            ],
            [
                'nazivAranzmana' => 'Pariz - Zimski Čar',
                'datumOd' => '2026-12-15',
                'datumDo' => '2026-12-25',
                'popust' => 10,
                'cena' => 900.00,
                'kapacitet' => 18,
                'putovanje_id' => $putovanja->where('lokacija', 'Francuska')->first()->id
            ],
            
            // Zermatt - 3 aranžmana
            [
                'nazivAranzmana' => 'Zermatt - Alpsko Skijanje',
                'datumOd' => '2026-07-01',
                'datumDo' => '2026-07-10',
                'popust' => 5,
                'cena' => 900.00,
                'kapacitet' => 25,
                'putovanje_id' => $putovanja->where('lokacija', 'Švajcarska')->first()->id
            ],
            [
                'nazivAranzmana' => 'Zermatt - Zimska Sezona',
                'datumOd' => '2026-01-15',
                'datumDo' => '2026-01-25',
                'popust' => 12,
                'cena' => 1200.00,
                'kapacitet' => 20,
                'putovanje_id' => $putovanja->where('lokacija', 'Švajcarska')->first()->id
            ],
            [
                'nazivAranzmana' => 'Zermatt - Planinarska Avantura',
                'datumOd' => '2026-08-20',
                'datumDo' => '2026-08-30',
                'popust' => 8,
                'cena' => 850.00,
                'kapacitet' => 15,
                'putovanje_id' => $putovanja->where('lokacija', 'Švajcarska')->first()->id
            ],
            
            // Dubai - 3 aranžmana
            [
                'nazivAranzmana' => 'Dubai - Luksuz i Shopping',
                'datumOd' => '2026-08-01',
                'datumDo' => '2026-08-15',
                'popust' => 20,
                'cena' => 1500.00,
                'kapacitet' => 15,
                'putovanje_id' => $putovanja->where('lokacija', 'UAE')->first()->id
            ],
            [
                'nazivAranzmana' => 'Dubai - Zimski Raj',
                'datumOd' => '2026-11-01',
                'datumDo' => '2026-11-14',
                'popust' => 25,
                'cena' => 1300.00,
                'kapacitet' => 20,
                'putovanje_id' => $putovanja->where('lokacija', 'UAE')->first()->id
            ],
            [
                'nazivAranzmana' => 'Dubai - Ekskluzivni Doživljaj',
                'datumOd' => '2026-03-01',
                'datumDo' => '2026-03-10',
                'popust' => 15,
                'cena' => 1800.00,
                'kapacitet' => 12,
                'putovanje_id' => $putovanja->where('lokacija', 'UAE')->first()->id
            ],
            
            // Barcelona - 3 aranžmana
            [
                'nazivAranzmana' => 'Barcelona - Gaudijev Grad',
                'datumOd' => '2026-09-01',
                'datumDo' => '2026-09-15',
                'popust' => 25,
                'cena' => 1800.00,
                'kapacitet' => 10,
                'putovanje_id' => $putovanja->where('lokacija', 'Španija')->first()->id
            ],
            [
                'nazivAranzmana' => 'Barcelona - Kulturni Festival',
                'datumOd' => '2026-05-20',
                'datumDo' => '2026-05-30',
                'popust' => 18,
                'cena' => 1200.00,
                'kapacitet' => 25,
                'putovanje_id' => $putovanja->where('lokacija', 'Španija')->first()->id
            ],
            [
                'nazivAranzmana' => 'Barcelona - Mediteranski Čar',
                'datumOd' => '2026-07-01',
                'datumDo' => '2026-07-12',
                'popust' => 22,
                'cena' => 1400.00,
                'kapacitet' => 18,
                'putovanje_id' => $putovanja->where('lokacija', 'Španija')->first()->id
            ],
            
            // Maldivi - 3 aranžmana
            [
                'nazivAranzmana' => 'Maldivi - Tropski Raj',
                'datumOd' => '2026-10-01',
                'datumDo' => '2026-10-15',
                'popust' => 30,
                'cena' => 2500.00,
                'kapacitet' => 8,
                'putovanje_id' => $putovanja->where('lokacija', 'Maldivi')->first()->id
            ],
            [
                'nazivAranzmana' => 'Maldivi - Romantični Izlet',
                'datumOd' => '2026-02-14',
                'datumDo' => '2026-02-21',
                'popust' => 35,
                'cena' => 2200.00,
                'kapacitet' => 6,
                'putovanje_id' => $putovanja->where('lokacija', 'Maldivi')->first()->id
            ],
            [
                'nazivAranzmana' => 'Maldivi - Letnja Avantura',
                'datumOd' => '2026-06-15',
                'datumDo' => '2026-06-25',
                'popust' => 28,
                'cena' => 2000.00,
                'kapacitet' => 10,
                'putovanje_id' => $putovanja->where('lokacija', 'Maldivi')->first()->id
            ]
        ];

        foreach ($aranzmani as $aranzman) {
            \App\Models\Aranzman::create($aranzman);
        }
    }
}
