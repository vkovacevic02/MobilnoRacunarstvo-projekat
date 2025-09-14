<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class EmailVerificationCode extends Model
{
    protected $fillable = [
        'email',
        'code',
        'used',
        'expires_at'
    ];

    protected $casts = [
        'used' => 'boolean',
        'expires_at' => 'datetime'
    ];

    public static function createForEmail(string $email): self
    {
        // Označi sve postojeće kodove za ovaj email kao korišćene
        self::where('email', $email)->update(['used' => true]);

        // Generiši novi 6-cifreni kod
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return self::create([
            'email' => $email,
            'code' => $code,
            'used' => false,
            'expires_at' => Carbon::now()->addMinutes(15) // Kod važi 15 minuta
        ]);
    }

    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }
}
