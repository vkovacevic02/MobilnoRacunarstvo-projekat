<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanAranzmanaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aranzmani = \App\Models\Aranzman::all();

        foreach ($aranzmani as $aranzman) {
            $faker = \Faker\Factory::create();
            $brojDana = rand(1, 14); // Random number of days between 1 and 14

            for ($i = 0; $i < $brojDana; $i++) {
                \App\Models\PlanAranzmana::create([
                    'aranzman_id' => $aranzman->id,
                    'dan' =>'Dan ' . ($i + 1),
                    'opis' => $faker->paragraph(),
                ]);
            }
        }
    }
}
