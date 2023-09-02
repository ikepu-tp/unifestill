<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "projectId",
        "name",
        "note"
    ];

    public $send_data = [
        "name" => "name",
        "note" => "note"
    ];

    public function test_get_projects()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("project.index"));
        $this->assertIndex();
    }

    public function test_get_project()
    {
        $this->requestAsAssociation();
        $project = Project::factory()->create(["association_id" => $this->association->id]);
        $this->response = $this->get(route("project.show", ["project" => $project->projectId]));
        $this->assertShow();
        $this->assertPayloadId($project->projectId, "projectId");
    }

    public function test_store_project()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("project.store"), $this->send_data);
        $this->assertStore();
    }

    public function test_store_project_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("project.store"), []);
        $this->assertValidationError();
    }

    public function test_update_project()
    {
        $this->requestAsAssociation();
        $project = Project::factory()->create(["association_id" => $this->association->id]);
        $this->response = $this->put(route("project.update", ["project" => $project->projectId]), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($project->projectId, "projectId");
    }

    public function test_update_project_with_validationError()
    {
        $this->requestAsAssociation();
        $project = Project::factory()->create(["association_id" => $this->association->id]);
        $this->response = $this->put(route("project.update", ["project" => $project->projectId]), []);
        $this->assertValidationError();
    }

    public function test_destroy_project()
    {
        $this->requestAsAssociation();
        $project = Project::factory()->create(["association_id" => $this->association->id]);
        $this->response = $this->delete(route("project.destroy", ["project" => $project->projectId]));
        $this->assertDestroy();
    }
}