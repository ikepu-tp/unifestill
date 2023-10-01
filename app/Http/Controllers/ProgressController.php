<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Progress;
use App\Models\Project;
use App\Http\Requests\ProgressRequest as defaultRequest;
use App\Http\Resources\ProgressResource;
use App\Http\Resources\Resource;
use App\Services\Service;
use Illuminate\Http\Request;
use Vinkla\Hashids\Facades\Hashids;

class ProgressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(defaultRequest $request, Project $project)
    {
        $progress = $project->progress();

        Service::searchKeyword($progress, "progressId", $request->query("keyword"));

        return Resource::pagination($progress, ProgressResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(defaultRequest $request, Project $project)
    {
        $progress = new Progress();
        $progress->fill([
            "progressId" => Hashids::encode(Progress::count()),
            "project_id" => $project->id,
        ]);
        $progress->fill($request->validated());
        if (!$progress->save()) throw new SaveFailedException();
        return Resource::create(new ProgressResource($progress));
    }

    /**
     * Display the specified resource.
     */
    public function show(defaultRequest $request, Project $project, Progress $progress)
    {
        return Resource::success(new ProgressResource($progress));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(defaultRequest $request, Project $project,  Progress $progress)
    {
        $progress->fill($request->validated());
        if (!$progress->save()) throw new SaveFailedException();
        return Resource::success(new ProgressResource($progress));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(defaultRequest $request, Project $project,  Progress $progress)
    {
        if (!$progress->delete()) throw new DeleteFailedException();
        return Resource::NoContent();
    }

    public function progress(Request $request, Progress $progress)
    {
        return view("app.app", [
            "source" => 'resources/react/components/views/progress-ev.tsx',
            "contents" => [
                "project" => $progress->project->projectId,
                "progress" => $progress->progressId,
            ]
        ]);
    }
}
