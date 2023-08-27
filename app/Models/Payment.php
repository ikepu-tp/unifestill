<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $paymentId
 * @property int $project_id
 * @property string $name
 * @property string $note
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Payment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'paymentId' => 'string',
        'project_id' => 'integer',
        'name' => 'encrypted',
        'note' => 'string',
    ];

    /**
     * @return Project
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function account_payments()
    {
        return $this->hasMany(Account_payment::class);
    }
}
