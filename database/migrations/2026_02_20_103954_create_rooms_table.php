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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('order')->default(0);
            $table->integer('no_of_room')->default(0);
            $table->integer('no_of_children')->default(0);
            $table->integer('no_of_adult')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->text('short_description')->nullable();
            $table->longText('long_description')->nullable();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
            $table->string('refrence_id')->nullable();
            $table->json('meta_data')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
