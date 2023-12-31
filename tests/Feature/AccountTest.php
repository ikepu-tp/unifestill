<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Item;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "accountId",
        "member",
        "price",
        "payments",
        "items",
    ];

    public $project;

    public $send_data = [];

    function setUp(): void
    {
        parent::setUp();
        $this->project = Project::factory()->create(["association_id" => $this->association->id]);
    }

    public function setSendData()
    {
        $this->send_data = [
            "member_id" => Member::factory()->create(["project_id" => $this->project->id])->memberId,
            "price" => 100,
            "payments" => [
                [
                    "payment_id" => Payment::factory()->create(["project_id" => $this->project->id])->paymentId,
                    "price" => 100,
                ]
            ],
            "items" => [
                [
                    "item_id" => Item::factory()->create()->itemId,
                    "price" => 100,
                    "quantity" => 1,
                    "children" => [
                        [
                            "item_id" => Item::factory()->create()->itemId,
                            "price" => 100,
                            "quantity" => 1,
                            "children" => [],
                        ]
                    ],
                ]
            ],
            "order_status" => "ordered",
        ];
    }

    public function getParameters(array $parameters = [])
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_accounts()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("account.index", $this->getParameters()));
        $this->assertIndex();
    }
    public function test_get_trashed_accounts()
    {
        $this->requestAsAssociation();
        Account::factory()->create(["project_id" => $this->project->id])->delete();
        $this->response = $this->get(route("account.index", $this->getParameters(["trashed" => true])));
        $this->assertIndex();
        $this->assertCount(1, $this->response["payloads"]["items"]);
    }

    public function test_get_account()
    {
        $this->requestAsAssociation();
        $account = Account::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->get(route("account.show", $this->getParameters(["account" => $account->accountId])));
        $this->assertShow();
        $this->assertPayloadId($account->accountId, "accountId");
    }

    public function test_store_account()
    {
        $this->requestAsAssociation();
        $this->setSendData();
        $this->response = $this->post(route("account.store", $this->getParameters()), $this->send_data);
        $this->assertStore();
    }

    public function test_store_account_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("account.store", $this->getParameters()), []);
        $this->assertValidationError();
    }

    public function test_update_account()
    {
        $this->requestAsAssociation();
        $account = Account::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->put(route("account.update", $this->getParameters(["account" => $account->accountId])), ["order_status" => "progress"]);
        $this->assertUpdate();
        $this->assertPayloadId($account->accountId, "accountId");
        $this->assertEquals("progress", $account->refresh()->order_status);
    }

    public function test_destroy_account()
    {
        $this->requestAsAssociation();
        $account = Account::factory()->create(["project_id" => $this->project->id]);
        $this->response = $this->delete(route("account.destroy", $this->getParameters(["account" => $account->accountId])));
        $this->assertDestroy();
    }
}
