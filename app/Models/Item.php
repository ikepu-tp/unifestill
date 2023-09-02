<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $itemId
 * @property int $category_id
 * @property string $name
 * @property string $note
 * @property int $price
 * @property int $parent_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Item extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'itemId' => 'string',
        'category_id' => 'integer',
        'name' => 'encrypted',
        'price' => 'integer',
        'parent_id' => 'integer',
        'note' => 'encrypted',
    ];

    public function getRouteKeyName()
    {
        return "itemId";
    }

    /**
     * @return Category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return self
     */
    public function parent()
    {
        return $this->belongsTo(self::class, "parent_id");
    }

    public function account_items()
    {
        return $this->hasMany(Account_item::class);
    }

    public function children()
    {
        return $this->hasMany(Item::class, "parent_id");
    }
}