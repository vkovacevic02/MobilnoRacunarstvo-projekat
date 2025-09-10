<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Putnici extends Model
{
    protected $table = 'putnici';

    protected $fillable = ['user_id', 'aranzman_id', 'datum', 'ukupnaCenaAranzmana'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function aranzman()
    {
        return $this->belongsTo(Aranzman::class, 'aranzman_id');
    }
}
