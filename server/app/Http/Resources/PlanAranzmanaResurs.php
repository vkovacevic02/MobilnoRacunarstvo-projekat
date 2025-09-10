<?php

namespace App\Http\Resources;

use App\Models\Aranzman;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanAranzmanaResurs extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $aranzman = Aranzman::find($this->aranzman_id);
        return [
            'id' => $this->id,
            'aranzman' => new AranzmanResurs($aranzman),
            'dan' => $this->dan,
            'opis' => $this->opis,
        ];
    }
}
