<?php

namespace App\Http\Controllers;
use App\Http\Services\KalkulatorCene;
use App\Http\Resources\PunikResurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PutnikController extends ResponseController
{
    public function __construct(private readonly KalkulatorCene $kalkulatorCene){

    }
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $putnici = \App\Models\Putnici::all();

        return $this->usepsno(PunikResurs::collection($putnici), 'Putnici su uspešno učitani.');
    }

    public function show(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $putnik = \App\Models\Putnici::find($id);

        if (!$putnik) {
            return $this->neuspesno('Putnik nije pronađen.');
        }

        return $this->usepsno(new PunikResurs($putnik), 'Putnik je uspešno pronađen.');
    }

    public function store(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id|numeric',
            'aranzman_id' => 'required|exists:aranzmani,id|numeric',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $aranzman = \App\Models\Aranzman::find($request->aranzman_id);

        if (!$aranzman) {
            return $this->neuspesno('Aranžman nije pronađen.');
        }

        $cena = $this->kalkulatorCene->izracunajCenu($aranzman->cena, $aranzman->popust);

        $putnik = \App\Models\Putnici::create([
            'user_id' => $request->user_id,
            'aranzman_id' => $request->aranzman_id,
            'datum' => now(),
            'ukupnaCenaAranzmana' => $cena,
        ]);

        return $this->usepsno(new PunikResurs($putnik), 'Putnik je uspešno kreiran.');
    }

    public function update(Request $request, $id)
    {

        $putnik = \App\Models\Putnici::find($id);

        if (!$putnik) {
            return $this->neuspesno('Putnik nije pronađen.');
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'user_id' => 'sometimes|exists:users,id|numeric',
            'aranzman_id' => 'sometimes|exists:aranzmani,id|numeric',
            'ukupnaCenaAranzmana' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $putnik->update($request->only(['user_id', 'aranzman_id', 'ukupnaCenaAranzmana']));

        return $this->usepsno(new PunikResurs($putnik), 'Putnik je uspešno ažuriran.');
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $putnik = \App\Models\Putnici::find($id);

        if (!$putnik) {
            return $this->neuspesno('Putnik nije pronađen.');
        }

        $putnik->delete();

        return $this->usepsno([], 'Putnik je uspešno obrisan.');
    }

    public function putniciPoAranzmanu(Request $request, $aranzmanId): \Illuminate\Http\JsonResponse
    {

        $putnici = \App\Models\Putnici::where('aranzman_id', $aranzmanId)->get();

        if ($putnici->isEmpty()) {
            return $this->neuspesno('Nema putnika za ovaj aranžman.');
        }

        return $this->usepsno(PunikResurs::collection($putnici), 'Putnici za aranžman su uspešno učitani.');
    }

    public function grupisanoBrojPutnikaPoAranzmanu(Request $request): \Illuminate\Http\JsonResponse
    {
        $grupisaniPodaci = DB::table('putnici')
            ->join('aranzmani', 'putnici.aranzman_id', '=', 'aranzmani.id')
            ->select('nazivAranzmana', 'aranzmani.id', DB::raw('count(*) as broj_putnika'))
            ->groupBy('aranzmani.id', 'aranzmani.nazivAranzmana')
            ->get();

        return $this->usepsno($grupisaniPodaci, 'Broj putnika po aranžmanu je uspešno grupisan.');
    }
    public function findByUser($userId): \Illuminate\Http\JsonResponse
    {
        $putnik = \App\Models\Putnici::where('user_id', $userId)->get();

        if ($putnik->isEmpty()) {
            return $this->neuspesno('Nema putnika za ovog korisnika.');
        }

        return $this->usepsno(PunikResurs::collection($putnik), 'Putnici za korisnika su uspešno učitani.');
    }
}
