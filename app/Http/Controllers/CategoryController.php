<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\Resource;
use App\Models\Project;
use App\Services\Service;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CategoryRequest $request, Project $project)
    {
        $category = $project->categories();

        Service::searchKeyword($category, "name", $request->query("keyword"));

        return Resource::pagination($category, CategoryResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request, Project $project)
    {
        $category = new Category();
        $category->fill([
            "categoryId" => Str::uuid(),
            "project_id" => $project->id,
        ]);
        $category->fill($request->validated());
        if (!$category->save()) throw new  SaveFailedException();
        return Resource::create(new CategoryResource($category));
    }

    /**
     * Display the specified resource.
     */
    public function show(CategoryRequest $request, Project $project, Category $category)
    {
        return Resource::success(new CategoryResource($category));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Project $project, Category $category)
    {
        $category->fill($request->validated());
        if (!$category->save()) throw new  SaveFailedException();
        return Resource::success(new CategoryResource($category));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryRequest $request, Project $project, Category $category)
    {
        if (!$category->delete()) throw new  DeleteFailedException();
        return Resource::NoContent();
    }
}
