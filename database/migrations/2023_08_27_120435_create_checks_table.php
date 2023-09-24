<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('checks', function (Blueprint $table) {
            $table->id();
            $table->uuid('checkId')->unique()->index();
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('member_id')->constrained('members');
            $table->Integer('bill_10')->default(0);
            $table->Integer('bill_5')->default(0);
            $table->Integer('bill_2')->default(0);
            $table->Integer('bill_1')->default(0);
            $table->Integer('coin_500')->default(0);
            $table->Integer('coin_100')->default(0);
            $table->Integer('coin_50')->default(0);
            $table->Integer('coin_10')->default(0);
            $table->Integer('coin_5')->default(0);
            $table->Integer('coin_1')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checks');
    }
};