<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $accountPaymentId
 * @property int $account_id
 * @property int $payment_id
 * @property int $price
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Account_payment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'accountPaymentId' => 'string',
        'account_id' => 'integer',
        'payment_id' => 'integer',
        'price' => 'integer',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ["id", "created_at", "updated_at", "deleted_at"];

    public function getRouteKeyName()
    {
        return "accountPaymentId";
    }

    /**
     * @return Account
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * @return Payment
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
