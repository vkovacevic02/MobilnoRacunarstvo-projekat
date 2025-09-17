<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Danica',
            'email' => 'danica@gmail.com',
            'password' => bcrypt('danica123'),
        ]);

         User::create([
            'name' => 'Katarina',
            'email' => 'katarina@gmail.com',
            'password' => bcrypt('katarina123'),
        ]);

         User::create([
            'name' => 'Valentina',
            'email' => 'valentina@gmail.com',
            'password' => bcrypt('valentina123'),
        ]);

        User::create([
            'name' => 'Vukasin',
            'email' => 'vukasin@gmail.com',
            'password' => bcrypt('vukasin123'),
        ]);

        User::create([
            'name' => 'Agent',
            'email' => 'agent@gmail.com',
            'password' => bcrypt('agent123'),
        ]);

        User::create([
            'name' => 'Vodja Puta',
            'email' => 'vodja@gmail.com',
            'password' => bcrypt('vodja123'),
        ]);

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => bcrypt('password123'),
            ]);
        }
    }
}
