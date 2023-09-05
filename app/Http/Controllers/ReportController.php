<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportRequest as Request;
use App\Http\Resources\Resource;
use App\Models\Account_payment;
use App\Models\Project;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Project $project)
    {
        $report = [
            "from_date" => $request->query("from_date"),
            "to_date" => $request->query("to_date"),
            "account_count" => 0,
            "sum_sales" => 0,
        ];
        $account_acounts = $project->accounts();
        if (!is_null($request->query("from_date"))) $account_acounts->whereDate("created_at", ">=", $request->query("from_date"));
        if (!is_null($request->query("to_date"))) $account_acounts->whereDate("created_at", "<=", $request->query("to_date"));
        $report["account_count"] = $account_acounts->count();
        $report["sum_sales"] = (int)Account_payment::whereIn("account_id", $account_acounts->select('id'))->sum("price");

        $sales = explode(",", $request->query("sales", ""));
        return Resource::success($report);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        //
    }
}
