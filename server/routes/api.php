<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::put('/user/profile', [\App\Http\Controllers\UserController::class, 'updateProfile'])->middleware('auth:sanctum');

Route::post('/login', [\App\Http\Controllers\LogovanjeController::class, 'logovanje']);
Route::post('/register', [\App\Http\Controllers\LogovanjeController::class, 'registracija']);
Route::post('/verify-email', [\App\Http\Controllers\LogovanjeController::class, 'verifyEmail']);
Route::post('/resend-verification', [\App\Http\Controllers\LogovanjeController::class, 'resendVerificationCode']);
Route::post('/password-reset', [\App\Http\Controllers\LogovanjeController::class, 'sendPasswordResetEmail']);
Route::post('/password-reset/verify', [\App\Http\Controllers\LogovanjeController::class, 'verifyResetCode']);
Route::post('/password-reset/confirm', [\App\Http\Controllers\LogovanjeController::class, 'resetPassword']);

Route::get('/putovanja', [\App\Http\Controllers\PutovanjeController::class,'index']);
Route::get('/aranzmani', [\App\Http\Controllers\AranzmaniController::class,'vratiAktivneAranzmane']);

Route::get('/aranzmani/{putovanjeId}', [\App\Http\Controllers\AranzmaniController::class,'vratiAranzmanePoPutovanju']);
Route::get('/plan-aranzmana/{aranzmanId}', [\App\Http\Controllers\PlanAranzmanaController::class,'vratiPlanoveZaAranzman']);

Route::get('/pretrazi-gradove', [\App\Http\Controllers\PutovanjeController::class,'pretraziPoDrzavi']);
Route::get('/pretrazi-oblasti', [\App\Http\Controllers\PutovanjeController::class,'pretraziOblasiPoDrzavi']);

Route::resource('putnici', \App\Http\Controllers\PutnikController::class)->only([
    'index', 'show'
]);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users/{userId}/putnici', [\App\Http\Controllers\PutnikController::class,'findByUser']);

    Route::post('/aranzmani', [\App\Http\Controllers\AranzmaniController::class,'noviAranzman']);
    Route::delete('/aranzmani/{id}', [\App\Http\Controllers\AranzmaniController::class,'obrisiAranzman']);
    Route::post('/putovanja', [\App\Http\Controllers\PutovanjeController::class,'unesiPutovanje']);
    Route::delete('/putovanja/{id}', [\App\Http\Controllers\PutovanjeController::class,'obrisiPutovanje']);

    Route::post('/putnici', [\App\Http\Controllers\PutnikController::class, 'store']);

    Route::resource('putnici', \App\Http\Controllers\PutnikController::class)->only([
        'update', 'destroy'
    ]);

    Route::get('/grupisano', [\App\Http\Controllers\PutnikController::class,'grupisanoBrojPutnikaPoAranzmanu']);

    Route::get('/aranzmani/{aranzmanId}/putnici', [\App\Http\Controllers\PutnikController::class,'putniciPoAranzmanu']);
    // Uplate
    Route::get('/uplate', [\App\Http\Controllers\UplateController::class, 'uplate']);
    Route::get('/paginacija', [\App\Http\Controllers\UplateController::class, 'paginacija']);

    Route::get('/aranzmani/{aranzmanId}/uplate', [\App\Http\Controllers\UplateController::class, 'uplatePoAranzmanu']);

    Route::post('/uplate', [\App\Http\Controllers\UplateController::class, 'novaUplata']);
    Route::get('/users/{userId}/uplate', [\App\Http\Controllers\UplateController::class, 'uplateZaKorisnika']);

    Route::delete('/uplate/{id}', [\App\Http\Controllers\UplateController::class, 'destroy']);
});
