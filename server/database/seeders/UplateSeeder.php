<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $putnici = \App\Models\Putnici::all();

        foreach ($putnici as $putnik) {
            $ukupnaCenaAranzmana = $putnik->ukupnaCenaAranzmana;
            $userId = $putnik->user_id;
            $aranzmanId = $putnik->aranzman_id;
            $datumUplate = now();

            $faker = \Faker\Factory::create();

            $randomBool = $faker->boolean();

            if ($randomBool) {
                \App\Models\Uplate::create([
                    'user_id' => $userId,
                    'aranzman_id' => $aranzmanId,
                    'datumUplate' => $datumUplate,
                    'iznos' => $ukupnaCenaAranzmana,
                ]);
            }
        }
    }
}
