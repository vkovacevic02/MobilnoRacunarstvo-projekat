<?php

namespace App\Http\Controllers;

class ResponseController extends Controller
{

    public function usepsno($data = [], $poruka = '')
    {
        return response()->json([
            'uspesno' => true,
            'podaci' => $data,
            'poruka' => $poruka
        ], 200);
    }

    public function neuspesno($poruka = '', $greske = [])
    {
        return response()->json([
            'uspesno' => false,
            'poruka' => $poruka,
            'greske' => $greske
        ], 400);
    }
}
