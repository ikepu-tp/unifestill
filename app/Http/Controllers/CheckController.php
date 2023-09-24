<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\NotExistRecordException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Check;
use App\Http\Requests\CheckRequest;
use App\Http\Resources\CheckResource;
use App\Http\Resources\Resource;
use App\Models\Member;
use App\Models\Project;
use Illuminate\Support\Str;

class CheckController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CheckRequest $request, Project $project)
    {
        $check = $project->checks();

        return Resource::pagination($check, CheckResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CheckRequest $request, Project $project)
    {
        if (!$member = Member::where("memberId", $request->validated("member_id"))->first()) throw new NotExistRecordException();
        $check = new Check();
        $check->fill([
            "checkId" => Str::uuid(),
            "project_id" => $project->id,
            "member_id" => $member->id,
        ]);
        $check->fill($request->safe()->except(["member_id"]));
        if (!$check->save()) throw new SaveFailedException();
        return Resource::create(new CheckResource($check));
    }

    /**
     * Display the specified resource.
     */
    public function show(CheckRequest $request, Project $project, Check $check)
    {
        return Resource::success(new CheckResource($check));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CheckRequest $request, Check $check)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CheckRequest $request, Check $check)
    {
        //
    }
}