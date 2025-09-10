<?php

namespace App\Http\Controllers;

use App\Http\Resources\AranzmanResurs;
use App\Http\Services\KalkulatorCene;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

class AranzmaniController extends ResponseController
{


    public function vratiAktivneAranzmane(Request $request): \Illuminate\Http\JsonResponse
    {
        $now = new DateTime('now');
        $aranzmani = \App\Models\Aranzman::where('datumOd', '>', $now->format('Y-m-d'))->get();
        return $this->usepsno(AranzmanResurs::collection($aranzmani), 'Uspešno vraćeni aktivni aranžmani.');
    }

    public function vratiAranzmanePoPutovanju(Request $request, $putovanjeId): \Illuminate\Http\JsonResponse
    {
        $aranzmani = \App\Models\Aranzman::where('putovanje_id', $putovanjeId)->where('datumOd', '>', now())->get();
        return $this->usepsno(AranzmanResurs::collection($aranzmani), 'Uspešno vraćeni aranžmani za putovanje.');
    }

    public function noviAranzman(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'putovanje_id' => 'required|exists:putovanja,id',
            'nazivAranzmana' => 'required|string|max:255',
            'datumOd' => 'required|date',
            'datumDo' => 'required|date|after_or_equal:datumOd',
            'cena' => 'required|numeric|min:0',
            'popust' => 'required|decimal:2,4|min:0|max:100',
            'kapacitet' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $aranzman = \App\Models\Aranzman::create([
            'putovanje_id' => $request->putovanje_id,
            'nazivAranzmana' => $request->nazivAranzmana,
            'datumOd' => $request->datumOd,
            'datumDo' => $request->datumDo,
            'cena' => $request->cena,
            'popust' => $request->popust,
            'kapacitet' => $request->kapacitet,
        ]);

        return $this->usepsno(new AranzmanResurs($aranzman), 'Aranžman je uspešno kreiran.');
    }

    public function obrisiAranzman($id): \Illuminate\Http\JsonResponse
    {
        $aranzman = \App\Models\Aranzman::find($id);

        if (!$aranzman) {
            return $this->neuspesno('Aranžman nije pronađen.');
        }

        $aranzman->delete();

        return $this->usepsno([], 'Aranžman je uspešno obrisan.');
    }
}
