<?php

namespace App\Http\Resources;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Item $resource
 */
class ItemResource extends JsonResource
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
            "itemId" => $this->resource->itemId,
            "category" => (new CategoryResource($this->resource->category))->createArray(),
            "parent_id" => $this->resource->parent_id,
            "name" => $this->resource->name,
            "note" => $this->resource->note,
            "price" => $this->resource->price,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}