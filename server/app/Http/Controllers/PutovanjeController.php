<?php

namespace App\Http\Controllers;

use App\Http\Resources\PutovanjeResurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PutovanjeController extends ResponseController
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $putovanja = \App\Models\Putovanje::all();

        return $this->usepsno(PutovanjeResurs::collection($putovanja), 'Putovanja su uspešno učitana.');
    }

    public function unesiPutovanje(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nazivPutovanja' => 'required|string|max:255',
            'opis' => 'required|string',
            'lokacija' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $putovanje = \App\Models\Putovanje::create([
            'nazivPutovanja' => $request->nazivPutovanja,
            'opis' => $request->opis,
            'lokacija' => $request->lokacija,
        ]);

        return $this->usepsno(new PutovanjeResurs($putovanje), 'Putovanje je uspešno uneseno.');
    }

    public function obrisiPutovanje($id): \Illuminate\Http\JsonResponse
    {
        $putovanje = \App\Models\Putovanje::find($id);

        if (!$putovanje) {
            return $this->neuspesno('Putovanje nije pronađeno.');
        }

        $putovanje->delete();

        return $this->usepsno([], 'Putovanje je uspešno obrisano.');
    }

    public function pretraziPoDrzavi(Request $request): \Illuminate\Http\JsonResponse
    {
        $countryCode = $request->input('countryCode');
        $url = "https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode=" . $countryCode;

        $headers = [
            'X-RapidAPI-Host' => 'country-state-city-search-rest-api.p.rapidapi.com',
            'X-RapidAPI-Key' => env('RAPIDAPI_KEY'),
            'Content-Type' => 'application/json',
        ];

        //cache by country code for 1 hour
        $cacheKey = 'cities_by_country_' . $countryCode;
        $cachedResponse = \Illuminate\Support\Facades\Cache::get($cacheKey);

        if ($cachedResponse !== null) {
            return $this->usepsno($cachedResponse, 'Gradovi su uspešno preuzeti iz keša.');
        }else {
            $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                \Illuminate\Support\Facades\Cache::put($cacheKey, $data, 3600);
                return $this->usepsno($data, 'Gradovi su uspešno preuzeti.');
            } else {
                return $this->neuspesno('Greška prilikom preuzimanja gradova: ' . $response->status());
            }
        }
    }

    public function pretraziOblasiPoDrzavi(Request $request): \Illuminate\Http\JsonResponse
    {
        $countryCode = $request->input('countryCode');
        $url = "https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode=" . $countryCode;

        $headers = [
            'X-RapidAPI-Host' => 'country-state-city-search-rest-api.p.rapidapi.com',
            'X-RapidAPI-Key' => env('RAPIDAPI_KEY'),
            'Content-Type' => 'application/json',
        ];

        //cache by country code for 1 hour
        $cacheKey = 'states_by_country_' . $countryCode;
        $cachedResponse = \Illuminate\Support\Facades\Cache::get($cacheKey);
        if ($cachedResponse !== null) {
            return $this->usepsno($cachedResponse, 'Oblasti su uspešno preuzete iz keša.');
        } else {
            $response = \Illuminate\Support\Facades\Http::withHeaders($headers)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                \Illuminate\Support\Facades\Cache::put($cacheKey, $data, 3600);
                return $this->usepsno($data, 'Oblasti su uspešno preuzete.');
            } else {
                return $this->neuspesno('Greška prilikom preuzimanja oblasti: ' . $response->status());
            }
        }
    }
}
