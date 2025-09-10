<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PutovanjeResurs extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'nazivPutovanja' => $this->nazivPutovanja,
            'opis' => $this->opis,
            'lokacija' => $this->lokacija,
        ];
    }
}
