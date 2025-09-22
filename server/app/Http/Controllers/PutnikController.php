<?php

namespace App\Http\Controllers;
use App\Http\Services\KalkulatorCene;
use App\Http\Resources\PunikResurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        $brojPutnika = max(1, (int)($request->input('broj_putnika', $request->input('brojPutnika', 1))));
        $putnik = \App\Models\Putnici::create([
            'user_id' => $request->user_id,
            'aranzman_id' => $request->aranzman_id,
            'datum' => now(),
            'ukupnaCenaAranzmana' => $cena * $brojPutnika,
            'broj_putnika' => $brojPutnika,
        ]);

        // Ažuriraj kapacitet nakon kreiranja rezervacije
        $this->azurirajKapacitet($request->aranzman_id);

        return $this->usepsno(new PunikResurs($putnik), 'Putnik je uspešno kreiran.');
    }

    public function update(Request $request, $id)
    {
        $putnik = \App\Models\Putnici::find($id);

        if (!$putnik) {
            return $this->neuspesno('Putnik nije pronađen.');
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'broj_putnika' => 'sometimes|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        // Ako se menja broj putnika, treba proveriti kapacitet i ažurirati cenu
        if ($request->has('broj_putnika')) {
            $noviBrojPutnika = (int) $request->broj_putnika;
            $stariBrojPutnika = $putnik->broj_putnika;
            $razlika = $noviBrojPutnika - $stariBrojPutnika;

            // Ako se povećava broj putnika, proveri da li ima dovoljno mesta
            if ($razlika > 0) {
                $kapacitetInfo = $this->dohvatiKapacitetInfo($putnik->aranzman_id);
                if ($razlika > $kapacitetInfo['dostupno']) {
                    return $this->neuspesno('Nema dovoljno slobodnih mesta.', [
                        'dostupno' => $kapacitetInfo['dostupno'],
                        'potrebno' => $razlika
                    ]);
                }
            }

            // Dohvati aranžman za kalkulaciju cene
            $aranzman = \App\Models\Aranzman::find($putnik->aranzman_id);
            if (!$aranzman) {
                return $this->neuspesno('Aranžman nije pronađen.');
            }

            // Izračunaj novu cenu
            $cenaPoOsobi = $this->kalkulatorCene->izracunajCenu($aranzman->cena, $aranzman->popust);
            $novaCena = $cenaPoOsobi * $noviBrojPutnika;

            // Ažuriraj putnika
            $putnik->update([
                'broj_putnika' => $noviBrojPutnika,
                'ukupnaCenaAranzmana' => $novaCena,
            ]);

            // Ažuriraj kapacitet
            $this->azurirajKapacitet($putnik->aranzman_id);

            // Dohvati novo stanje kapaciteta
            $novoStanje = $this->dohvatiKapacitetInfo($putnik->aranzman_id);

            return $this->usepsno([
                'putnik' => new PunikResurs($putnik),
                'kapacitet' => $novoStanje,
                'razlika_putnika' => $razlika,
                'nova_cena' => $novaCena
            ], 'Rezervacija je uspešno ažurirana.');
        }

        // Standardno ažuriranje ostalih polja
        $putnik->update($request->only(['user_id', 'aranzman_id', 'ukupnaCenaAranzmana']));

        return $this->usepsno(new PunikResurs($putnik), 'Putnik je uspešno ažuriran.');
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $putnik = \App\Models\Putnici::find($id);

        if (!$putnik) {
            return $this->neuspesno('Putnik nije pronađen.');
        }

        // Zapamti podatke pre brisanja
        $aranzmanId = $putnik->aranzman_id;
        $brojPutnika = $putnik->broj_putnika;

        // Obriši rezervaciju
        $putnik->delete();

        // Ažuriraj dostupni kapacitet aranžmana
        $this->azurirajKapacitet($aranzmanId);

        return $this->usepsno([
            'oslobodjena_mesta' => $brojPutnika,
            'aranzman_id' => $aranzmanId
        ], 'Rezervacija je uspešno otkazana i kapacitet je ažuriran.');
    }

    /**
     * Ažurira dostupni kapacitet aranžmana na osnovu trenutnih rezervacija
     */
    private function azurirajKapacitet($aranzmanId): void
    {
        $aranzman = \App\Models\Aranzman::find($aranzmanId);
        
        if (!$aranzman) {
            return;
        }

        // Izračunaj ukupan broj rezervisanih putnika
        $ukupnoRezervisan = (int) \App\Models\Putnici::where('aranzman_id', $aranzmanId)
            ->sum('broj_putnika');

        // Izračunaj dostupan kapacitet
        $dostupanKapacitet = max(0, (int)$aranzman->kapacitet - $ukupnoRezervisan);

        // Log za debugging
        \Log::info("Kapacitet ažuriran za aranžman {$aranzmanId}: {$dostupanKapacitet}/{$aranzman->kapacitet} dostupno");
    }

    /**
     * Dohvata detaljne informacije o kapacitetu aranžmana
     */
    private function dohvatiKapacitetInfo($aranzmanId): array
    {
        $aranzman = \App\Models\Aranzman::find($aranzmanId);
        
        if (!$aranzman) {
            return ['ukupno' => 0, 'zauzeto' => 0, 'dostupno' => 0];
        }

        $zauzeto = (int) \App\Models\Putnici::where('aranzman_id', $aranzmanId)
            ->sum('broj_putnika');
        
        $ukupno = (int) $aranzman->kapacitet;
        $dostupno = max(0, $ukupno - $zauzeto);

        return [
            'ukupno' => $ukupno,
            'zauzeto' => $zauzeto, 
            'dostupno' => $dostupno
        ];
    }

    public function putniciPoAranzmanu(Request $request, $aranzmanId): \Illuminate\Http\JsonResponse
    {

        $putnici = \App\Models\Putnici::where('aranzman_id', $aranzmanId)->get();

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

    public function rezervisi(Request $request, int $aranzmanId): \Illuminate\Http\JsonResponse
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'count' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $aranzman = \App\Models\Aranzman::find($aranzmanId);
        if (!$aranzman) {
            return $this->neuspesno('Aranžman nije pronađen.');
        }

        $alreadyBooked = (int) \App\Models\Putnici::where('aranzman_id', $aranzmanId)->sum('broj_putnika');
        $available = max(0, (int)$aranzman->kapacitet - $alreadyBooked);

        $count = (int)$request->input('count');
        if ($count > $available) {
            return $this->neuspesno('Nema dovoljno mesta.', ['preostalo' => $available]);
        }

        $cena = app(\App\Http\Services\KalkulatorCene::class)->izracunajCenu($aranzman->cena, $aranzman->popust);

        $user = $request->user();
        if (!$user) {
            return $this->neuspesno('Morate biti prijavljeni.');
        }

        $now = now();
        \App\Models\Putnici::create([
            'user_id' => $user->id,
            'aranzman_id' => $aranzmanId,
            'datum' => $now,
            'ukupnaCenaAranzmana' => $cena * $count,
            'broj_putnika' => $count,
        ]);

        // Ažuriraj kapacitet nakon rezervacije
        $this->azurirajKapacitet($aranzmanId);

        // Izračunaj novo stanje kapaciteta
        $novoStanje = $this->dohvatiKapacitetInfo($aranzmanId);

        return $this->usepsno([
            'rezervisano' => $count, 
            'preostalo' => $novoStanje['dostupno'],
            'ukupno' => $novoStanje['ukupno'],
            'zauzeto' => $novoStanje['zauzeto']
        ], 'Rezervacija uspešna.');
    }

    /**
     * Dohvata trenutno stanje kapaciteta za aranžman
     */
    public function kapacitet($aranzmanId): \Illuminate\Http\JsonResponse
    {
        $info = $this->dohvatiKapacitetInfo($aranzmanId);
        
        if ($info['ukupno'] === 0) {
            return $this->neuspesno('Aranžman nije pronađen.');
        }

        return $this->usepsno($info, 'Informacije o kapacitetu aranžmana.');
    }
}
