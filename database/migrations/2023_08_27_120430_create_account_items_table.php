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
        Schema::create('account_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('accountItemId')->unique()->index();
            $table->foreignId('account_id')->constrained('accounts');
            $table->foreignId('item_id')->constrained('items');
            $table->Integer('price');
            $table->tinyInteger('quantity');
            $table->foreignId('parent_id')->nullable()->constrained('account_items');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_items');
    }
};
