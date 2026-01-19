<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('message')->nullable();

            $table->enum('type', ['buy', 'price', 'question'])->default('buy');
            $table->enum('status', ['new', 'in_progress', 'closed'])->default('new');

            $table->timestamps();

            $table->index(['car_id', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('leads');
    }
};

