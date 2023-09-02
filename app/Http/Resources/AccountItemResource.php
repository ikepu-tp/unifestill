<?php

namespace App\Http\Resources;

use App\Models\Account_item;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Account_item $resource
 */
class AccountItemResource extends JsonResource
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
            "accountItemId" => $this->resource->accountItemId,
            "item" => (new ItemResource($this->resource->item))->createArray(),
            "price" => $this->resource->price,
            "quantity" => $this->resource->quantity,
            "children" => static::collection($this->resource->children),
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}