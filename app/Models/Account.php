<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $accountId
 * @property int $project_id
 * @property int $price
 * @property int $member_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Account extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'accountId' => 'string',
        'project_id' => 'integer',
        'price' => 'integer',
        'member_id' => 'integer',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ["id", "created_at", "updated_at", "deleted_at"];

    public function getRouteKeyName()
    {
        return "accountId";
    }

    /**
     * @return Project
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return Member
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function account_items()
    {
        return $this->hasMany(Account_item::class);
    }

    public function account_payments()
    {
        return $this->hasMany(Account_payment::class);
    }
}
