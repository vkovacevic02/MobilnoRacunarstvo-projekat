<?php

namespace App\Http\Controllers;

class ResponseController extends Controller
{

    public function usepsno($data = [], $poruka = '')
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $poruka
        ], 200);
    }

    public function neuspesno($poruka = '', $greske = [])
    {
        return response()->json([
            'success' => false,
            'message' => $poruka,
            'errors' => $greske
        ], 400);
    }
}
