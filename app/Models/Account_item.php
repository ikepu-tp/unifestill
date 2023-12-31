<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $accountItemId
 * @property int $account_id
 * @property int $item_id
 * @property int $price
 * @property int $quantity
 * @property int $parent_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Account_item extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'accountItemId' => 'string',
        'account_id' => 'integer',
        'item_id' => 'integer',
        'price' => 'integer',
        'quantity' => 'integer',
        'parent_id' => 'integer',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ["id", "created_at", "updated_at", "deleted_at"];

    public function getRouteKeyName()
    {
        return "accountItemId";
    }

    /**
     * @return Account
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * @return Item
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * @return self
     */
    public function parent()
    {
        return $this->belongsTo(self::class, "parent_id");
    }

    public function children()
    {
        return $this->hasMany(self::class, "parent_id");
    }
}
