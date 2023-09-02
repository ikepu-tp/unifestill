<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "categoryId",
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

    public function test_get_categorys()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("category.index"));
        $this->assertIndex();
    }

    public function test_get_category()
    {
        $this->requestAsAssociation();
        $category = Category::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("category.show", $this->getParameters(["category" => $category->categoryId])));
        $this->assertShow();
        $this->assertPayloadId($category->categoryId, "categoryId");
    }

    public function test_store_category()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("category.store"), $this->send_data);
        $this->assertStore();
    }

    public function test_store_category_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("category.store"), []);
        $this->assertValidationError();
    }

    public function test_update_category()
    {
        $this->requestAsAssociation();
        $category = Category::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("category.update", $this->getParameters(["category" => $category->categoryId])), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($category->categoryId, "categoryId");
    }

    public function test_update_category_with_validationError()
    {
        $this->requestAsAssociation();
        $category = Category::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("category.update", $this->getParameters(["category" => $category->categoryId])), []);
        $this->assertValidationError();
    }

    public function test_destroy_category()
    {
        $this->assertThrows(function () {
            route("category.destroy");
        }, RouteNotFoundException::class);
    }
}