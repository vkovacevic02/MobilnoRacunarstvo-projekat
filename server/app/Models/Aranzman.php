<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aranzman extends Model
{
    protected $table = 'aranzmani';

    protected $fillable = ['nazivAranzmana', 'datumOd', 'datumDo', 'popust', 'cena', 'kapacitet', 'putovanje_id'];

    public function putovanje()
    {
        return $this->belongsTo(Putovanje::class, 'putovanje_id');
    }

    public function planAranzmana()
    {
        return $this->hasMany(PlanAranzmana::class, 'aranzman_id');
    }

    public function putnici()
    {
        return $this->hasMany(Putnici::class, 'aranzman_id');
    }

    public function uplate()
    {
        return $this->hasMany(Uplate::class, 'aranzman_id');
    }
}
