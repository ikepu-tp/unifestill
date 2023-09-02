<?php

namespace Tests\Feature;

use App\Models\Check;
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
        "name",
        "note"
    ];

    public $project;

    public $send_data = [
        "name" => "name",
        "note" => "note"
    ];

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

    public function test_get_checks()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("check.index"));
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
        $this->response = $this->post(route("check.store"), $this->send_data);
        $this->assertStore();
    }

    public function test_store_check_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("check.store"), []);
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