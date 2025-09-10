<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;
    public const ROLE_ADMIN = 'admin';
    public const ROLE_PUTNIK = 'putnik';
    public const ROLE_AGENT = 'agent';
    public const ROLE_VODJA_PUTA = 'vodja_puta';
    public const ROLE_FINANSIJKI_ADMIN = 'finansijski_admin';
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function uplate()
    {
        return $this->hasMany(Uplate::class, 'user_id');
    }

    public function putnici()
    {
        return $this->hasMany(Putnici::class, 'user_id');
    }
}
