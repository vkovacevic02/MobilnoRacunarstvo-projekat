<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanAranzmana extends Model
{
    protected $table = 'plan_aranzmana';

    protected $fillable = ['aranzman_id', 'dan', 'opis'];

    public function aranzman()
    {
        return $this->belongsTo(Aranzman::class, 'aranzman_id');
    }
}
