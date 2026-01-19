<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('test_drives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();

            $table->dateTime('preferred_at')->nullable();
            $table->enum('status', ['new', 'confirmed', 'done', 'canceled'])->default('new');

            $table->timestamps();

            $table->index(['car_id', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('test_drives');
    }
};

