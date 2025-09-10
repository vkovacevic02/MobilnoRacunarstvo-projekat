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
            'role' => User::ROLE_ADMIN,
        ]);

        User::create([
            'name' => 'Vukasin',
            'email' => 'vukasin@gmail.com',
            'password' => bcrypt('vukasin123'),
            'role' => User::ROLE_FINANSIJKI_ADMIN,
        ]);

        User::create([
            'name' => 'Agent',
            'email' => 'agent@gmail.com',
            'password' => bcrypt('agent123'),
            'role' => User::ROLE_AGENT,
        ]);

        User::create([
            'name' => 'Vodja Puta',
            'email' => 'vodja@gmail.com',
            'password' => bcrypt('vodja123'),
            'role' => User::ROLE_VODJA_PUTA,
        ]);

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => bcrypt('password123'),
                'role' => User::ROLE_PUTNIK,
            ]);
        }
    }
}
