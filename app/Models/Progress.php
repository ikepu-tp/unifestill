<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $progressId
 * @property int $project_id
 * @property boolean $need_auth
 * @property boolean $logged
 */
class Progress extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'progressId' => 'string',
        'project_id' => 'integer',
        'need_auth' => 'boolean',
        'logged' => 'boolean',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ["id", "created_at", "updated_at",];

    public function getRouteKeyName()
    {
        return "progressId";
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
