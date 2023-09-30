<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Vinkla\Hashids\Facades\Hashids;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Progress>
 */
class ProgressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "progressId" => Hashids::encode($this->faker->numberBetween()),
            "project_id" => Project::factory()->create()->id,
            "need_auth" => true,
        ];
    }
}
