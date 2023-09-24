<?php

namespace Database\Factories;

use App\Models\Association;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "projectId" => \Illuminate\Support\Str::uuid(),
            "name" => fake("ja")->name(),
            "note" => fake("ja")->paragraph(),
            "association_id" => Association::factory()->create()->id,
        ];
    }
}
