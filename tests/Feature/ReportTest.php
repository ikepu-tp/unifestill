<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "from_date" => "from_date",
        "to_date" => "to_date",
        "account_count" => "account_count",
        "sum_sales" => "sum_sales",
    ];

    public $project;

    function setUp(): void
    {
        parent::setUp();
        $this->project = Project::first() ?: Project::factory()->create();
    }

    public function getParameters(array $parameters)
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_report()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("report.index", [
            "from_date" => "2023-08-01",
            "to_date" => "2023-08-31",
            "sales" => "member"
        ]));
        $this->assertResponse(array_merge($this->resource, [
            "member_sales" => [
                [
                    "member",
                    "count",
                    "price"
                ]
            ]
        ]), 200);
    }
}