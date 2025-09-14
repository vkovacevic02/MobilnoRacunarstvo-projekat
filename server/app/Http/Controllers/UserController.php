<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ime' => 'required|string|max:255',
                'prezime' => 'required|string|max:255', 
                'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
                'password' => 'nullable|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Podaci nisu validni.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            
            // Ažuriraj osnovne podatke
            $user->ime = $request->ime;
            $user->prezime = $request->prezime;
            $user->email = $request->email;
            
            // Ažuriraj šifru ako je prosleđena
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
            
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil je uspešno ažuriran.',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->ime . ' ' . $user->prezime,
                    'ime' => $user->ime,
                    'prezime' => $user->prezime,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom ažuriranja profila.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
