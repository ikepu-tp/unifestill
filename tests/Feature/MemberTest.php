<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "memberId",
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

    public function getParameters(array $parameters = [])
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_members()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("member.index", $this->getParameters()));
        $this->assertIndex();
    }

    public function test_get_member()
    {
        $this->requestAsAssociation();
        $member = Member::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("member.show", $this->getParameters(["member" => $member->memberId])));
        $this->assertShow();
        $this->assertPayloadId($member->memberId, "memberId");
    }

    public function test_store_member()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("member.store", $this->getParameters()), $this->send_data);
        $this->assertStore();
    }

    public function test_store_member_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("member.store", $this->getParameters()), []);
        $this->assertValidationError();
    }

    public function test_update_member()
    {
        $this->requestAsAssociation();
        $member = Member::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("member.update", $this->getParameters(["member" => $member->memberId])), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($member->memberId, "memberId");
    }

    public function test_update_member_with_validationError()
    {
        $this->requestAsAssociation();
        $member = Member::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("member.update", $this->getParameters(["member" => $member->memberId])), []);
        $this->assertValidationError();
    }

    public function test_destroy_member()
    {
        $this->assertThrows(function () {
            route("member.destroy", $this->getParameters());
        }, RouteNotFoundException::class);
    }
}
