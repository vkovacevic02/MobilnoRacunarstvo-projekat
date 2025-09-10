<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResurs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
}
