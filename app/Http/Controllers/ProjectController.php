<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Project;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\Resource;
use App\Models\Association;
use App\Services\Service;
use Illuminate\Support\Str;

class ProjectController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(ProjectRequest $request)
    {
        /**
         * @var Association
         */
        $association = $request->user("associations");
        $project = $association->projects();

        Service::searchKeyword($project, "name", $request->query("keyword"));

        return Resource::pagination($project, ProjectResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        $project = new Project();
        $project->fill($request->validated());
        $project->fill([
            "projectId" => Str::uuid(),
            "association_id" => $request->user("associations")->id
        ]);
        if (!$project->save()) throw new SaveFailedException();
        return Resource::create(new ProjectResource($project));
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectRequest $request, Project $project)
    {
        return Resource::success(new ProjectResource($project));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, Project $project)
    {
        $project->fill($request->validated());
        if (!$project->save()) throw new SaveFailedException();
        return Resource::success(new ProjectResource($project));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectRequest $request, Project $project)
    {
        if (!$project->delete()) throw new  DeleteFailedException();
        return Resource::NoContent();
    }
}
