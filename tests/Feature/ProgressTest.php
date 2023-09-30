<?php

namespace Tests\Feature;

use App\Models\Progress;
use App\Models\Project;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "progressId",
        "project",
        "need_auth",
        "logged",
    ];

    public $project;

    public $send_data = [
        "need_auth" => true,
        "logged" => false,
    ];

    function setUp(): void
    {
        parent::setUp();
        $this->project = Project::factory()->create(["association_id" => $this->association->id]);
    }

    public function getParameters(array $parameters = [])
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_progresss()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("progress.index", $this->getParameters()));
        $this->assertIndex();
    }

    public function test_get_progress()
    {
        $this->requestAsAssociation();
        $progress = Progress::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("progress.show", $this->getParameters(["progress" => $progress->progressId])));
        $this->assertShow();
        $this->assertPayloadId($progress->progressId, "progressId");
    }

    public function test_store_progress()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("progress.store", $this->getParameters()), $this->send_data);
        $this->assertStore();
    }

    public function test_update_progress()
    {
        $this->requestAsAssociation();
        $progress =  Progress::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("progress.update", $this->getParameters(["progress" => $progress->progressId])), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($progress->progressId, "progressId");
    }

    public function test_destroy_progress()
    {
        $this->requestAsAssociation();
        $progress =  Progress::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->delete(route("progress.destroy", $this->getParameters(["progress" => $progress->progressId])));
        $this->assertThrows(function () use ($progress) {
            $progress->refresh();
        }, ModelNotFoundException::class);
    }
}
