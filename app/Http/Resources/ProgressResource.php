<?php

namespace App\Http\Resources;

use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Progress $resource
 */
class ProgressResource extends JsonResource
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
            "progressId" => $this->resource->progressId,
            "project" => (new ProjectResource($this->resource->project))->createArray(),
            "need_auth" => $this->resource->need_auth,
            "logged" => $this->resource->logged,
            "created_at" => $this->resource->created_at,
            "updated_at" => $this->resource->updated_at,
        ];
    }
}
