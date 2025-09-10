<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Putovanje extends Model
{
    protected $table = 'putovanja';

    protected $fillable = ['nazivPutovanja', 'opis', 'lokacija'];

    public function aranzmani()
    {
        return $this->hasMany(Aranzman::class, 'putovanje_id');
    }
}
