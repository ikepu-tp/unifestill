<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public $api = true;
    public $resource = [
        "paymentId",
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
        $this->project = Project::first() ?: Project::factory()->create();
    }

    public function getParameters(array $parameters)
    {
        return array_merge([
            "project" => $this->project->projectId,
        ], $parameters);
    }

    public function test_get_payments()
    {
        $this->requestAsAssociation();
        $this->response = $this->get(route("payment.index"));
        $this->assertIndex();
    }

    public function test_get_payment()
    {
        $this->requestAsAssociation();
        $payment = Payment::first() ?: Payment::factory()->create();
        $this->response = $this->get(route("payment.show", $this->getParameters(["payment" => $payment->paymentId])));
        $this->assertShow();
        $this->assertPayloadId($payment->paymentId, "paymentId");
    }

    public function test_store_payment()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("payment.store"), $this->send_data);
        $this->assertStore();
    }

    public function test_store_payment_with_validationError()
    {
        $this->requestAsAssociation();
        $this->response = $this->post(route("payment.store"), []);
        $this->assertValidationError();
    }

    public function test_update_payment()
    {
        $this->requestAsAssociation();
        $payment = Payment::first() ?: Payment::factory()->create();
        $this->response = $this->put(route("payment.update", $this->getParameters(["payment" => $payment->paymentId])), $this->send_data);
        $this->assertUpdate();
        $this->assertPayloadId($payment->paymentId, "paymentId");
    }

    public function test_update_payment_with_validationError()
    {
        $this->requestAsAssociation();
        $payment = Payment::first() ?: Payment::factory()->create();
        $this->response = $this->put(route("payment.update", $this->getParameters(["payment" => $payment->paymentId])), []);
        $this->assertValidationError();
    }

    public function test_destroy_payment()
    {
        $this->assertThrows(function () {
            route("payment.destroy");
        }, RouteNotFoundException::class);
    }
}