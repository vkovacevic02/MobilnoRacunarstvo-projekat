<?php

namespace App\Http\Controllers;

use App\Models\Putnici;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UplateController extends ResponseController
{
    public function uplate(Request $request): \Illuminate\Http\JsonResponse
    {
        $uplate = \App\Models\Uplate::orderBy('datumUplate', 'desc')->get();
        return $this->usepsno(\App\Http\Resources\UplataResurs::collection($uplate), 'Uplate su uspešno učitane.');
    }

    public function paginacija(Request $request): \Illuminate\Http\JsonResponse
    {
        $perPage = $request->input('perPage', 5);

        $uplate = DB::table('uplate')
            ->join('aranzmani', 'uplate.aranzman_id', '=', 'aranzmani.id')
            ->join('users', 'uplate.user_id', '=', 'users.id')
            ->select('uplate.*', 'aranzmani.nazivAranzmana', 'users.name as korisnik')
            ->paginate($perPage);

        return $this->usepsno($uplate, 'Uplate su uspešno paginirane.');
    }

    public function uplatePoAranzmanu($aranzmanId): \Illuminate\Http\JsonResponse
    {
        $uplate = \App\Models\Uplate::where('aranzman_id', $aranzmanId)->orderBy('datumUplate', 'desc')->get();
        return $this->usepsno(\App\Http\Resources\UplataResurs::collection($uplate), 'Uplate za aranžman su uspešno učitane.');
    }

    public function novaUplata(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'aranzman_id' => 'required|exists:aranzmani,id',
            'user_id' => 'required|exists:users,id',
            'iznos' => 'required|numeric|min:0',
            'datumUplate' => 'required|date',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $aranzmana = \App\Models\Aranzman::find($request->aranzman_id);
        $user = \App\Models\User::find($request->user_id);

        $putnik = Putnici::where('aranzman_id', $request->aranzman_id)
            ->where('user_id', $request->user_id)
            ->first();

        if (!$putnik) {
            return $this->neuspesno('Korisnik nije registrovan za ovaj aranžman.');
        }

        $cena = $putnik->ukupnaCenaAranzmana;

        if ($request->iznos > $cena) {
            return $this->neuspesno('Iznos uplate ne može biti veći od ukupne cene aranžmana.');
        }

        $uplata = \App\Models\Uplate::create([
            'aranzman_id' => $request->aranzman_id,
            'user_id' => $request->user_id,
            'iznos' => $request->iznos,
            'datumUplate' => $request->datumUplate,
        ]);

        return $this->usepsno(new \App\Http\Resources\UplataResurs($uplata), 'Uplata je uspešno kreirana.');
    }

    public function uplateZaKorisnika($userId): \Illuminate\Http\JsonResponse
    {
        $uplate = \App\Models\Uplate::where('user_id', $userId)->orderBy('datumUplate', 'desc')->get();
        return $this->usepsno(\App\Http\Resources\UplataResurs::collection($uplate), 'Uplate za korisnika su uspešno učitane.');
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $uplata = \App\Models\Uplate::find($id);

        if (!$uplata) {
            return $this->neuspesno('Uplata sa datim ID-jem ne postoji.');
        }

        $uplata->delete();

        return $this->usepsno(null, 'Uplata je uspešno obrisana.');
    }
}
