<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\NotExistRecordException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Item;
use App\Http\Requests\ItemRequest;
use App\Http\Resources\ItemResource;
use App\Http\Resources\Resource;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Support\Str;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ItemRequest $request, Project $project, Category $category)
    {
        $item = $category->items();

        return Resource::pagination($item, ItemResource::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ItemRequest $request, Project $project, Category $category)
    {
        $item = new Item();
        $item->fill([
            "itemId" => Str::uuid(),
        ]);
        $this->setFill($request, $item);
        if (!$item->save()) throw new SaveFailedException();
        return Resource::create(new ItemResource($item));
    }

    public function setFill(ItemRequest $request, Item $item)
    {
        $item->fill($request->safe(["name", "note", "price"]));
        if (!$category = Category::where('categoryId', $request->validated("category_id"))->first()) throw new NotExistRecordException("カテゴリーID");
        $parent = null;
        if (!is_null($request->validated("parent_id")))
            if (!$parent = Item::where('itemId', $request->validated("parent_id"))->first()) throw new NotExistRecordException();
        $item->fill([
            "category_id" => $category->id,
            "parent_id" => $parent ? $parent->id : null,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemRequest $request, Project $project, Category $category, Item $item)
    {
        return Resource::success(new ItemResource($item));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ItemRequest $request, Project $project, Category $category, Item $item)
    {
        $this->setFill($request, $item);
        if (!$item->save()) throw new SaveFailedException();
        return Resource::success(new ItemResource($item));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemRequest $request, Project $project, Category $category, Item $item)
    {
        if (!$item->delete()) throw new  DeleteFailedException();
        return Resource::NoContent();
    }
}