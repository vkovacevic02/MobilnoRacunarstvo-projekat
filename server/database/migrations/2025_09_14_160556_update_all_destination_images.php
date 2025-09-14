<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ažuriraj sve slike destinacija
        $updates = [
            'Santorini' => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
            'Pariz' => 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=400&h=300&fit=crop',
            'Zermatt' => 'https://www.travelandleisure.com/thmb/F3V1ei2YrUH4Qd_fvSgkAneZ4R8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-header-zermatt-switzerland-ZERMATT0123-08b7127082434b9f83db57251c051c1b.jpg',
            'Dubai' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
            'Barcelona' => 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
            'Maldivi' => 'https://itravel.rs/wp-content/uploads/2019/10/Maldivi-najbolje-ponude.jpg'
        ];

        foreach ($updates as $destination => $imageUrl) {
            DB::table('putovanja')
                ->where('nazivPutovanja', $destination)
                ->update(['slika' => $imageUrl]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Vrati na default slike
        DB::table('putovanja')
            ->update(['slika' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=200&fit=crop']);
    }
};