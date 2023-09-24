<?php

namespace App\Http\Resources;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Request as FacadesRequest;

class Resource extends JsonResource
{
    function __construct(
        public int $code = 200,
        public array|null|Resource|JsonResource $payloads = null,
        public array|null $error = null
    ) {
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->createArray();
    }

    /**
     * レスポンス作成
     *
     * @return JsonResponse
     */
    public function createResponse(): JsonResponse
    {
        return response()->json($this->createArray(), $this->code);
    }

    /**
     * 配列レスポンス作成
     *
     * @return array
     */
    public function createArray(): array
    {
        $return = [
            "status" => $this->createStatus(),
        ];
        if ($this->code < 300 && !is_null($this->payloads)) $return["payloads"] = $this->payloads;
        if ($this->code >= 400) $return["error"] = $this->error;
        return $return;
    }

    /**
     * ステータスリソース作成
     *
     * @return array
     */
    public function createStatus(): array
    {
        $status = [
            "result" => $this->code < 400,
            "code" => $this->code,
        ];
        if (config("template.nonce_key")) $status["nonce"] = FacadesRequest::header(config("template.nonce_key"));
        return $status;
    }

    /**
     * 成功レスポンス作成
     *
     * @param array|null|Resource|JsonResource $payloads
     * @param integer $code
     * @return JsonResponse
     */
    static public function success(array|Resource|JsonResource $payloads = null, int $code = 200): JsonResponse
    {
        $resource = new static(
            $code,
            $payloads
        );
        return $resource->createResponse();
    }

    /**
     * 作成レスポンス
     *
     * @param array|Resource|JsonResource|null $payloads
     * @param integer $code
     * @return JsonResponse
     */
    static public function create(array|Resource|JsonResource $payloads = null, int $code = 201): JsonResponse
    {
        return static::success($payloads, $code);
    }

    /**
     * 返却値なし
     */
    static public function NoContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * 失敗レスポンス作成
     *
     * @param string $abstract
     * @param string $title
     * @param integer $code
     * @param array $messages
     * @return JsonResponse
     */
    static public function fail(string $abstract, string $title, int $code, array $messages): JsonResponse
    {
        $resource = new static(
            $code > 1000 ? (int)substr((string)$code, 0, 3) : $code,
            null,
            (new ErrorResource($abstract, $title, $code, $messages))->createArray(),
        );
        return $resource->createResponse();
    }

    /**
     * ページネーションリソース
     * `per`, `page`, `order(created_at)`は処理
     *
     * @param mixed $item
     * @param string $resource
     * @return JsonResponse
     */
    static public function pagination(mixed $item, string $resource): JsonResponse
    {
        $per = FacadesRequest::query("per", 100);
        $static = new static;
        $cnt = $item->count();
        $item = $item->orderBy('created_at', FacadesRequest::query("order", "asc"));

        if ($per === 'all') {
            $items = $item->get();
            $meta = $static->createMeta($cnt, null, true);
        } else {
            $items = $item->paginate($per);
            $meta = $static->createMeta($cnt, $items, false, (int)$per);
        }

        $payloads = [
            "meta" => $meta,
            "items" => $resource::collection($items),
        ];
        return static::success($payloads);
    }

    public function createMeta(int $length, mixed $resource = null, bool $all = false, int $per = null): array
    {
        $meta = [
            "currentPage" => 1,
            "lastPage" => 1,
            "length" => $length,
            "getLength" => 0,
            "per" => $per,
        ];
        if ($all) {
            $meta["getLength"] = $meta["length"];
        } else {
            $meta["currentPage"] = $resource->currentPage();
            $meta["lastPage"] = $resource->lastPage();
            $meta["getLength"] = $resource->count();
        }
        return $meta;
    }
}
