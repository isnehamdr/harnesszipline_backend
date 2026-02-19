<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('homes')) {
            Schema::create('homes', function (Blueprint $table) {
                $table->id();
                $table->string('image')->nullable();
                $table->string('video')->nullable();
                $table->boolean('is_archived')->default(false);
                $table->json('metadata_json')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('homes');
    }
};