<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResurs;
use App\Models\User;
use App\Models\PasswordResetCode;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
        try {
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

            // Generiši i sačuvaj kod
            $resetCode = PasswordResetCode::createForEmail($request->email);
            
            // Pošalji email sa kodom
            try {
                Mail::to($request->email)->send(new PasswordResetMail($request->email, $resetCode->code));
                
                return $this->usepsno([
                    'message' => 'Kod za resetovanje lozinke je poslat na vaš email.',
                ], 'Email je poslat.');
            } catch (\Exception $e) {
                // Ako slanje email-a ne uspe, vrati grešku
                return $this->neuspesno('Došlo je do greške prilikom slanja email-a. Molimo pokušajte ponovo.');
            }
            
        } catch (\Exception $e) {
            return $this->neuspesno('Greška: ' . $e->getMessage());
        }
    }

    public function verifyResetCode(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'code' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return $this->neuspesno('Validacija nije uspela.', $validator->errors());
            }

            $resetCode = PasswordResetCode::where('email', $request->email)
                ->where('code', $request->code)
                ->where('used', false)
                ->first();

            if (!$resetCode) {
                return $this->neuspesno('Kod nije pronađen ili je već korišćen.');
            }

            if (!$resetCode->isValid()) {
                return $this->neuspesno('Kod je istekao.');
            }

            return $this->usepsno([], 'Kod je ispravan.');
        } catch (\Exception $e) {
            return $this->neuspesno('Greška: ' . $e->getMessage());
        }
    }

    public function resetPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->neuspesno('Korisnik sa ovom email adresom ne postoji.');
        }

        // Proveri kod
        $resetCode = PasswordResetCode::where('email', $request->email)
            ->where('code', $request->code)
            ->where('used', false)
            ->first();

        if (!$resetCode || !$resetCode->isValid()) {
            return $this->neuspesno('Neispravan ili istekao kod.');
        }

        // Resetuj lozinku
        $user->password = Hash::make($request->password);
        $user->save();

        // Označi kod kao korišćen
        $resetCode->used = true;
        $resetCode->save();

        return $this->usepsno([], 'Lozinka je uspešno resetovana.');
    }
}
