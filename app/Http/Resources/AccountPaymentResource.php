<?php

namespace App\Http\Resources;

use App\Models\Account_payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Account_payment $resource
 */
class AccountPaymentResource extends JsonResource
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
            "accountPaymentId" => $this->resource->accountPaymentId,
            "payment" => (new PaymentResource($this->resource->payment))->createArray(),
            "price" => $this->resource->price,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}