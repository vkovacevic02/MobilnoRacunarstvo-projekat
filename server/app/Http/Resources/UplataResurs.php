<?php

namespace App\Http\Resources;

use App\Models\Aranzman;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UplataResurs extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = User::find($this->user_id);
        $aranzman = Aranzman::find($this->aranzman_id);
        return [
            'id' => $this->id,
            'user' => new UserResurs($user),
            'aranzman' => new AranzmanResurs($aranzman),
            'iznos' => $this->iznos,
            'datumUplate' => $this->datumUplate,
        ];
    }
}
