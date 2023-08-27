<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account_payment>
 */
class Account_paymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "accountPaymentId" => \Illuminate\Support\Str::uuid(),
            "account_id" => Account::factory()->create()->id,
            "payment_id" => Payment::factory()->create()->id,
            "price" => fake()->randomDigit() * 100,
        ];
    }
}
