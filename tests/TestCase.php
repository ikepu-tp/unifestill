<?php

namespace Tests;

use App\Models\Association;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Str;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * @var bool
     */
    public $api = false;

    /**
     * @var string
     */
    public $nonce;

    /**
     * @var Association
     */
    public $association;
    /**
     * @var \Illuminate\Testing\TestResponse
     */
    public $response;

    /**
     * @var array
     */
    public $resource;

    function setUp(): void
    {
        parent::setUp();
        if ($this->api) $this->setApi();
    }

    public function setApi()
    {
        $this->nonce = Str::random();
        $this->withHeader("Accept", "application/json");
        $this->withHeader("X-Nonce", $this->nonce);
    }

    public function requestAsAssociation()
    {
        $this->association = Association::first();
        if (!$this->association) $this->association = Association::factory()->create();
        $this->actingAs($this->association, "associations");
    }

    public function getAssertResource(array|null $resource)
    {
        if (is_null($resource)) {
            $resource = $this->resource ?: [];
        }
        return $resource;
    }

    public function assertNonce()
    {
        if ($this->api) $this->assertEquals($this->nonce, $this->response["status"]["nonce"]);
    }

    public function assertError(int $status)
    {
        $this->response->assertStatus($status);
        $this->assertNonce();
        $this->response->assertJsonStructure([
            "status" => [
                "result",
                "code",
                "nonce",
            ],
            "error" => [
                "abstract",
                "title",
                "code",
                "messages"
            ]
        ]);
    }

    public function assertResponse(array $payloads, int $status)
    {
        $this->response->assertStatus($status);
        $this->assertNonce();
        $this->response->assertJsonStructure([
            "status" => [
                "result",
                "code",
                "nonce",
            ],
            "payloads" => $payloads,
        ]);
    }

    public function assertIndex(array $resource = null, int $status = 200)
    {
        $this->assertResponse(
            [
                "meta" => [
                    "currentPage",
                    "lastPage",
                    "length",
                    "getLength",
                ],
                "items" => [
                    "*" => $this->getAssertResource($resource),
                ]
            ],
            $status
        );
    }

    public function assertStore(array $resource = null, int $status = 201)
    {
        $this->assertResponse(
            $this->getAssertResource($resource),
            $status
        );
    }

    public function assertShow(array $resource = null, int $status = 200)
    {
        $this->assertResponse(
            $this->getAssertResource($resource),
            $status
        );
    }

    public function assertUpdate(array $resource = null, int $status = 200)
    {
        $this->assertResponse(
            $this->getAssertResource($resource),
            $status
        );
    }

    public function assertDestroy()
    {
        $this->response->assertNoContent();
    }

    public function assertPayloadId(string $expected, string $uuidKey)
    {
        $this->assertEquals($expected, $this->response["payloads"][$uuidKey]);
    }

    public function assertValidationError()
    {
        $this->assertError(406);
    }
}
