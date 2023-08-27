<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Check>
 */
class CheckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "checkId" => \Illuminate\Support\Str::uuid(),
            "project_id" => Project::factory()->create()->id,
            "member_id" => Member::factory()->create()->id,
        ];
    }
}
