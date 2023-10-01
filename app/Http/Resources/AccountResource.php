<?php

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Account $resource
 */
class AccountResource extends JsonResource
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
            "accountId" => $this->resource->accountId,
            "member" => (new MemberResource($this->resource->member))->createArray(),
            "price" => $this->resource->price,
            "payments" => AccountPaymentResource::collection($this->resource->account_payments),
            "items" => AccountItemResource::collection($this->resource->account_items),
            "order_status" => $this->resource->order_status,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}
