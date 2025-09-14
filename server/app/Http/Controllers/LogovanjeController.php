<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResurs;
use App\Models\User;
use App\Models\PasswordResetCode;
use App\Models\EmailVerificationCode;
use App\Mail\PasswordResetMail;
use App\Mail\EmailVerificationMail;
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
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'telefon' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->neuspesno('Validacija nije uspela.', $validator->errors());
        }

        $user = \App\Models\User::create([
            'name' => $request->ime . ' ' . $request->prezime,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? User::ROLE_PUTNIK
        ]);

        // Generiši i pošalji verifikacioni kod
        try {
            $verificationCode = EmailVerificationCode::createForEmail($request->email);
            Mail::to($request->email)->send(new EmailVerificationMail($request->email, $verificationCode->code));
        } catch (\Exception $e) {
            // Ako slanje email-a ne uspe, vrati grešku
            return $this->neuspesno('Došlo je do greške prilikom slanja verifikacionog koda. Molimo pokušajte ponovo.');
        }

        return $this->usepsno(new UserResurs($user), 'Uspešno ste se registrovali. Proverite vaš email za verifikacioni kod.');
    }

    public function sendPasswordResetEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            \Log::info('Password reset request received', ['email' => $request->email]);
            
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', ['errors' => $validator->errors()]);
                return $this->neuspesno('Validacija nije uspela.', $validator->errors());
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                \Log::error('User not found', ['email' => $request->email]);
                return $this->neuspesno('Korisnik sa ovom email adresom ne postoji.');
            }

            \Log::info('User found, creating reset code', ['user_id' => $user->id]);

            // Generiši i sačuvaj kod
            $resetCode = PasswordResetCode::createForEmail($request->email);
            
            \Log::info('Reset code created', ['code' => $resetCode->code]);
            
            // Pošalji email sa kodom
            try {
                \Log::info('Attempting to send email', ['email' => $request->email, 'code' => $resetCode->code]);
                
                Mail::to($request->email)->send(new PasswordResetMail($request->email, $resetCode->code));
                
                \Log::info('Email sent successfully');
                
                return $this->usepsno([
                    'message' => 'Kod za resetovanje lozinke je poslat na vaš email.',
                    'code' => $resetCode->code, // Vrati kod za testiranje
                ], 'Email je poslat.');
            } catch (\Exception $e) {
                \Log::error('Email sending failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                // Ako slanje email-a ne uspe, vrati grešku
                return $this->neuspesno('Došlo je do greške prilikom slanja email-a: ' . $e->getMessage());
            }
            
        } catch (\Exception $e) {
            \Log::error('Password reset error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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

    public function verifyEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'code' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return $this->neuspesno('Validacija nije uspela.', $validator->errors());
            }

            $verificationCode = EmailVerificationCode::where('email', $request->email)
                ->where('code', $request->code)
                ->where('used', false)
                ->first();

            if (!$verificationCode) {
                return $this->neuspesno('Kod nije pronađen ili je već korišćen.');
            }

            if (!$verificationCode->isValid()) {
                return $this->neuspesno('Kod je istekao.');
            }

            // Označi kod kao korišćen
            $verificationCode->used = true;
            $verificationCode->save();

            // Označi korisnika kao verifikovanog (dodaj email_verified_at polje ako ne postoji)
            $user = User::where('email', $request->email)->first();
            if ($user) {
                $user->email_verified_at = now();
                $user->save();
            }

            return $this->usepsno([], 'Email je uspešno verifikovan.');
        } catch (\Exception $e) {
            return $this->neuspesno('Greška: ' . $e->getMessage());
        }
    }

    public function resendVerificationCode(Request $request): \Illuminate\Http\JsonResponse
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

            // Generiši novi kod
            $verificationCode = EmailVerificationCode::createForEmail($request->email);
            
            // Pošalji email sa kodom
            try {
                Mail::to($request->email)->send(new EmailVerificationMail($request->email, $verificationCode->code));
                
                return $this->usepsno([
                    'message' => 'Novi verifikacioni kod je poslat na vaš email.',
                ], 'Kod je poslat.');
            } catch (\Exception $e) {
                // Ako slanje email-a ne uspe, vrati grešku
                return $this->neuspesno('Došlo je do greške prilikom slanja email-a. Molimo pokušajte ponovo.');
            }
            
        } catch (\Exception $e) {
            return $this->neuspesno('Greška: ' . $e->getMessage());
        }
    }
}
