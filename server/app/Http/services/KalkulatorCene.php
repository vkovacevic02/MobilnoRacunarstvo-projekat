<?php

namespace App\Http\Services;

class KalkulatorCene
{

    public function izracunajCenu(float $cena, float $popust): float
    {
        if ($popust > 0) {
            $cena = $cena - ($cena * ($popust / 100));
        }
        return $cena;
    }
}
