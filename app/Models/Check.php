<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $checkId
 * @property int $project_id
 * @property int $member_id
 * @property int $bill_10
 * @property int $bill_5
 * @property int $bill_2
 * @property int $bill_1
 * @property int $coin_500
 * @property int $coin_100
 * @property int $coin_50
 * @property int $con_10
 * @property int $coin_5
 * @property int $coin_1
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Check extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'checkId' => 'string',
        'project_id' => 'integer',
        'member_id' => 'integer',
        'bill_10' => 'integer',
        'bill_5' => 'integer',
        'bill_2' => 'integer',
        'bill_1' => 'integer',
        'coin_500' => 'integer',
        'coin_100' => 'integer',
        'coin_50' => 'integer',
        'con_10' => 'integer',
        'coin_5' => 'integer',
        'coin_1' => 'integer',
    ];

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
}
