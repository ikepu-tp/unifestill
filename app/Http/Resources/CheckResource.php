<?php

namespace App\Http\Resources;

use App\Models\Check;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Check $resource
 */
class CheckResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array|null
    {
        return $this->createArray();
    }

    public function createArray(): array|null
    {
        if (is_null($this->resource)) return null;
        return [
            "checkId" => $this->resource->checkId,
            "member" => (new MemberResource($this->resource->member))->createArray(),
            "bill_10" => $this->resource->bill_10,
            "bill_5" => $this->resource->bill_5,
            "bill_2" => $this->resource->bill_2,
            "bill_1" => $this->resource->bill_1,
            "coin_500" => $this->resource->coin_500,
            "coin_100" => $this->resource->coin_100,
            "coin_50" => $this->resource->coin_50,
            "coin_10" => $this->resource->coin_10,
            "coin_5" => $this->resource->coin_5,
            "coin_1" => $this->resource->coin_1,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}