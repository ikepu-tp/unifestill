<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Payment;
use App\Http\Requests\PaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\Resource;
use App\Models\Project;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(PaymentRequest $request, Project $project)
    {
        $payment = $project->payments();

        return Resource::pagination($payment, PaymentResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PaymentRequest $request, Project $project)
    {
        $payment = new Payment();
        $payment->fill([
            "paymentId" => Str::uuid(),
            "project_id" => $project->id,
        ]);
        $payment->fill($request->validated());
        if (!$payment->save()) throw new SaveFailedException();
        return Resource::create(new PaymentResource($payment));
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentRequest $request, Project $project, Payment $payment)
    {
        return Resource::success(new PaymentResource($payment));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PaymentRequest $request, Project $project, Payment $payment)
    {
        $payment->fill($request->validated());
        if (!$payment->save()) throw new SaveFailedException();
        return Resource::success(new PaymentResource($payment));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentRequest $request, Project $project, Payment $payment)
    {
        if (!$payment->delete()) throw new DeleteFailedException();
        return Resource::NoContent();
    }
}