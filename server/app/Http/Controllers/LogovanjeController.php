<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResurs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LogovanjeController extends ResponseController
{
    public function logovanje(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make(request()->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return $this->neuspesno('Neispravni kredencijali.');
        }

        $user = auth()->user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->usepsno([
            'user' => new UserResurs($user),
            'token' => $token
        ], 'Uspešno ste se prijavili.');
    }

    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        auth()->logout();

        return $this->usepsno([], 'Uspešno ste se odjavili.');
    }

    public function registracija(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => User::ROLE_PUTNIK
        ]);

        return $this->usepsno(new UserResurs($user), 'Uspešno ste se registrovali. Molimo vas da se prijavite.');
    }

    public function sendPasswordResetEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->neuspesno('Korisnik sa ovom email adresom ne postoji.');
        }

        // Generiši reset token (u stvarnoj aplikaciji bi se poslao email)
        $resetToken = Str::random(60);
        
        // U stvarnoj aplikaciji bi se token sačuvao u bazi i poslao email
        // Za demo svrhe, samo vraćamo uspešan odgovor
        
        return $this->usepsno([
            'message' => 'Instrukcije za resetovanje lozinke su poslate na vaš email.',
            'token' => $resetToken // U stvarnoj aplikaciji se ne bi vratio token
        ], 'Email je poslat.');
    }

    public function resetPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->neuspesno('Korisnik sa ovom email adresom ne postoji.');
        }

        // U stvarnoj aplikaciji bi se proverio token iz baze
        // Za demo svrhe, samo resetujemo lozinku

        $user->password = Hash::make($request->password);
        $user->save();

        return $this->usepsno([], 'Lozinka je uspešno resetovana.');
    }
}
