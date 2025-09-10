<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PutovanjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $putovanja = [
            [
                'nazivPutovanja' => 'Putovanje u Pariz',
                'opis' => 'Uživajte u čarima Pariza, gradu ljubavi i svetlosti.',
                'lokacija' => 'Pariz, Francuska',
            ],
            [
                'nazivPutovanja' => 'Egzotično putovanje na Bali',
                'opis' => 'Otkrijte rajske plaže i bogatu kulturu Balija.',
                'lokacija' => 'Bali, Indonezija',
            ],
            [
                'nazivPutovanja' => 'Avantura u Amazoniji',
                'opis' => 'Istražite netaknutu prirodu i divlje životinje Amazona.',
                'lokacija' => 'Amazon, Brazil',
            ],
            [
                'nazivPutovanja' => 'Kultura i istorija u Rimu',
                'opis' => 'Posetite drevne znamenitosti i uživajte u italijanskoj kuhinji.',
                'lokacija' => 'Rim, Italija',
            ],
            [
                'nazivPutovanja' => 'Skandinavska turneja',
                'opis' => 'Otkrijte lepotu Norveške, Švedske i Danske.',
                'lokacija' => 'Skandinavija',
            ]
        ];

        foreach ($putovanja as $putovanje) {
            \App\Models\Putovanje::create($putovanje);
        }
    }
}
