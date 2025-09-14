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
                'nazivPutovanja' => 'Santorini',
                'opis' => 'Uživajte u čarima grčkih ostrva sa predivnim zalaskom sunca.',
                'lokacija' => 'Grčka',
                'slika' => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
                'cena' => 499.00,
            ],
            [
                'nazivPutovanja' => 'Pariz',
                'opis' => 'Grad ljubavi i svetlosti sa Eiffelovom kulom i bogatom kulturom.',
                'lokacija' => 'Francuska',
                'slika' => 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=400&h=300&fit=crop',
                'cena' => 559.00,
            ],
            [
                'nazivPutovanja' => 'Zermatt',
                'opis' => 'Alpsko skijalište sa predivnim pogledom na Matterhorn.',
                'lokacija' => 'Švajcarska',
                'slika' => 'https://www.travelandleisure.com/thmb/F3V1ei2YrUH4Qd_fvSgkAneZ4R8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-header-zermatt-switzerland-ZERMATT0123-08b7127082434b9f83db57251c051c1b.jpg',
                'cena' => 799.00,
            ],
            [
                'nazivPutovanja' => 'Dubai',
                'opis' => 'Moderni grad sa najvišim neboderom na svetu i luksuznim shoppingom.',
                'lokacija' => 'UAE',
                'slika' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
                'cena' => 649.00,
            ],
            [
                'nazivPutovanja' => 'Barcelona',
                'opis' => 'Grad Gaudija sa Sagrada Familijom i živopisnim ulicama.',
                'lokacija' => 'Španija',
                'slika' => 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
                'cena' => 399.00,
            ],
            [
                'nazivPutovanja' => 'Maldivi',
                'opis' => 'Tropski raj sa kristalno čistim morem i predivnim plažama.',
                'lokacija' => 'Maldivi',
                'slika' => 'https://itravel.rs/wp-content/uploads/2019/10/Maldivi-najbolje-ponude.jpg',
                'cena' => 1299.00,
            ]
        ];

        foreach ($putovanja as $putovanje) {
            \App\Models\Putovanje::create($putovanje);
        }
    }
}
