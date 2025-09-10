<?php

namespace App\Http\Resources;

use App\Models\Putovanje;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AranzmanResurs extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //'nazivAranzmana', 'datumOd', 'datumDo', 'popust', 'cena', 'kapacitet', 'putovanje_id'

        $putovanje = Putovanje::where('id', $this->putovanje_id)->first();
        return [
            'id' => $this->id,
            'nazivAranzmana' => $this->nazivAranzmana,
            'datumOd' => $this->datumOd,
            'datumDo' => $this->datumDo,
            'popust' => $this->popust,
            'cena' => $this->cena,
            'kapacitet' => $this->kapacitet,
            'putovanje' => new PutovanjeResurs($putovanje),
        ];
    }
}
