<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ErrorResource extends JsonResource
{
    function __construct(
        public string $abstract,
        public string $title,
        public int $code,
        public array $messages
    ) {
    }

    public function toArray(Request $request): array
    {
        return $this->createArray();
    }

    /**
     * 配列リソース作成
     *
     * @return array
     */
    public function createArray(): array
    {
        return [
            "abstract" => __($this->abstract),
            "title" => __($this->title),
            "code" => $this->code,
            "messages" => $this->messages,
        ];
    }
}
