<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "paymentId" => \Illuminate\Support\Str::uuid(),
            "project_id" => Project::factory()->create()->id,
            "name" => fake("ja")->name(),
            "note" => fake("ja")->paragraph(),
        ];
    }
}
