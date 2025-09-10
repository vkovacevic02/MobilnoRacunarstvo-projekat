<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uplate extends Model
{
    protected $table = 'uplate';

    protected $fillable = ['aranzman_id', 'user_id', 'iznos', 'datumUplate'];

    public function aranzman()
    {
        return $this->belongsTo(Aranzman::class, 'aranzman_id');
    }

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
