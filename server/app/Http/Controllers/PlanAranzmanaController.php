<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanAranzmanaResurs;
use Illuminate\Http\Request;

class PlanAranzmanaController extends ResponseController
{
    public function vratiPlanoveZaAranzman($idAranzmana)
    {
        $planovi = \App\Models\PlanAranzmana::where('aranzman_id', $idAranzmana)->get();

        if ($planovi->isEmpty()) {
            return $this->neuspesno('Nema planova za ovaj aranžman.');
        }

        return $this->usepsno(PlanAranzmanaResurs::collection($planovi), 'Planovi za aranžman');
    }
}
