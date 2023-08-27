<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Account_item;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account_item>
 */
class Account_itemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "accountItemId" => \Illuminate\Support\Str::uuid(),
            "account_id" => Account::factory()->create()->id,
            "item_id" => Item::factory()->create()->id,
            "price" => fake()->randomDigit() * 100,
            "quantity" => fake()->randomDigit() + 1,
            "parent_id" => fake()->randomElement([
                null,
                Account_item::factory()->create(["parent_id" => null])->id,
            ]),
        ];
    }
}
