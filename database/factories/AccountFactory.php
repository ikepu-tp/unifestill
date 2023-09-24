<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "accountId" => \Illuminate\Support\Str::uuid(),
            "project_id" => Project::factory()->create()->id,
            "price" => fake()->randomDigit() * 100,
            "member_id" => Member::factory()->create()->id,
        ];
    }
}
