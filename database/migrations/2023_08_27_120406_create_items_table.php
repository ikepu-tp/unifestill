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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->uuid('itemId')->unique()->index();
            $table->foreignId('category_id')->constrained('categories');
            $table->longText('name');
            $table->longText('note')->nullable();
            $table->Integer('price')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained("items");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
