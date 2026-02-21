<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('activity_id')
                  ->constrained('activities')
                  ->cascadeOnDelete();

            $table->string('path');
            $table->string('alt_text')->nullable();

            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->boolean('is_display_image')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_images');
    }
};