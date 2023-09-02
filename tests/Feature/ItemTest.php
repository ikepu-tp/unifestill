<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Item;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Tests\TestCase;

class ItemTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "itemId",
        "category",
        "parent_id",
        "name",
        "note",
        "price",
    ];

    public $project;

    public $send_data = [
        "name" => "name",
        "note" => "note",
        "price" => 100,
    ];

    function setUp(): void
    {
        parent::setUp();
        $this->project = Project::factory()->create(["association_id" => $this->association->id]);
        $category = Category::factory()->create(["project_id" => $this->project->id]);
        $this->send_data["category_id"] = $category->categoryId;
    }

    public function getParameters(array $parameters)
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_items()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("item.index"));
        $this->assertIndex();
    }

    public function test_get_item()
    {
        $this->requestAsAssociation();
        $item =  Item::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("item.show", $this->getParameters(["item" => $item->itemId])));
        $this->assertShow();
        $this->assertPayloadId($item->itemId, "itemId");
    }

    public function test_store_item()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("item.store"), $this->send_data);
        $this->assertStore();
    }

    public function test_store_item_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("item.store"), []);
        $this->assertValidationError();
    }

    public function test_update_item()
    {
        $this->requestAsAssociation();
        $item =  Item::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("item.update", $this->getParameters(["item" => $item->itemId])), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($item->itemId, "itemId");
    }

    public function test_update_item_with_validationError()
    {
        $this->requestAsAssociation();
        $item =  Item::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("item.update", $this->getParameters(["item" => $item->itemId])), []);
        $this->assertValidationError();
    }

    public function test_destroy_item()
    {
        $this->assertThrows(function () {
            route("item.destroy");
        }, RouteNotFoundException::class);
    }
}