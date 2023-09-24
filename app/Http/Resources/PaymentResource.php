<?php

namespace App\Http\Resources;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Payment $resource
 */
class PaymentResource extends JsonResource
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
            "paymentId" => $this->resource->paymentId,
            "name" => $this->resource->name,
            "note" => $this->resource->note,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}