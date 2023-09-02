<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "itemId" => \Illuminate\Support\Str::uuid(),
            "category_id" => Category::factory()->create()->id,
            "name" => fake("ja")->name(),
            "note" => fake("ja")->paragraph(),
            "price" => fake()->randomDigit() * 100,
            "parent_id" => fake()->randomElement([
                null,
                (Item::first()?->id) ?: null
            ])
        ];
    }
}