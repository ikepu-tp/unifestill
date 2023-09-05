<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Member;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\Resource;
use App\Models\Project;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(MemberRequest $request)
    {
        $project = $request->getProject();
        $member = $project->members();

        return Resource::pagination($member, MemberResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MemberRequest $request)
    {
        $member = new Member();
        $member->forceFill([
            "memberId" => Str::uuid(),
            "project_id" => $request->getProject()->id,
        ]);
        $member->fill($request->validated());
        if (!$member->save()) throw new SaveFailedException();
        return Resource::create(new MemberResource($member));
    }

    /**
     * Display the specified resource.
     */
    public function show(MemberRequest $request, Project $project, Member $member)
    {
        return Resource::success(new MemberResource($member));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MemberRequest $request, Project $project, Member $member)
    {
        $member->fill($request->validated());
        if (!$member->save()) throw new SaveFailedException();
        return Resource::success(new MemberResource($member));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MemberRequest $request, Project $project, Member $member)
    {
        if (!$member->delete()) throw new DeleteFailedException();
        return Resource::NoContent();
    }
}
