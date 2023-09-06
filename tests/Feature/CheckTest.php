<?php

namespace Tests\Feature;

use App\Models\Check;
use App\Models\Member;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Tests\TestCase;

class CheckTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "checkId",
        "member",
        "bill_10",
        "bill_5",
        "bill_2",
        "bill_1",
        "coin_500",
        "coin_100",
        "coin_50",
        "coin_10",
        "coin_5",
        "coin_1",
    ];

    public $project;

    public $send_data = [
        "bill_10" => 0,
        "bill_5" => 0,
        "bill_2" => 0,
        "bill_1" => 0,
        "coin_500" => 0,
        "coin_100" => 0,
        "coin_50" => 0,
        "con_10" => 0,
        "coin_5" => 0,
        "coin_1" => 0,
    ];

    function setUp(): void
    {
        parent::setUp();
        $this->project = Project::factory()->create(["association_id" => $this->association->id]);
        $member = Member::factory()->create(["project_id" => $this->project->id]);
        $this->send_data["member_id"] = $member->memberId;
    }

    public function getParameters(array $parameters = [])
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_checks()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("check.index", $this->getParameters()));
        $this->assertIndex();
    }

    public function test_get_check()
    {
        $this->requestAsAssociation();
        $check = Check::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("check.show", $this->getParameters(["check" => $check->checkId])));
        $this->assertShow();
        $this->assertPayloadId($check->checkId, "checkId");
    }

    public function test_store_check()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("check.store", $this->getParameters()), $this->send_data);
        $this->assertStore();
    }

    public function test_store_check_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("check.store", $this->getParameters()), []);
        $this->assertValidationError();
    }

    public function test_update_check()
    {
        $this->assertThrows(function () {
            route("check.update");
        }, RouteNotFoundException::class);
    }

    public function test_destroy_check()
    {
        $this->assertThrows(function () {
            route("check.destroy");
        }, RouteNotFoundException::class);
    }
}