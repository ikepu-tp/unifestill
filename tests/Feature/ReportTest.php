<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Account_payment;
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
        $this->project = Project::factory()->create(["association_id" => $this->association->id]);
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
        $account = Account::factory()->create(["project_id" => $this->project->id]);
        Account_payment::factory(5)->create(["account_id" => $account->id, "price" => 1]);
        $this->response = $this->get(route("report.index", $this->getParameters([
            "from_date" => "2023-09-01",
            "to_date" => "2023-09-30",
            "sales" => "member"
        ])));
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
