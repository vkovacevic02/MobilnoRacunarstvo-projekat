<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PutniciSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();

        $aranzmani = \App\Models\Aranzman::all();

        $faker = \Faker\Factory::create();

        foreach ($aranzmani as $aranzman) {
            $randomNumber = rand(5, 10);
            for ($i = 0; $i < $randomNumber; $i++) {
                $randomUser = $users->random();
                $ukupnaCenaAranzmana = $aranzman->cena - ($aranzman->cena * ($aranzman->popust / 100));

                \App\Models\Putnici::create([
                    'user_id' => $randomUser->id,
                    'aranzman_id' => $aranzman->id,
                    'datum' => $faker->dateTimeBetween('-1 month', 'now'),
                    'ukupnaCenaAranzmana' => $ukupnaCenaAranzmana,
                ]);
            }
        }
    }
}
