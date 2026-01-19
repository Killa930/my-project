<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();

            $table->string('model');
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedInteger('price')->nullable(); // в евро/центах можно, но для простоты integer
            $table->string('vin', 32)->nullable()->unique();

            $table->enum('status', ['available', 'reserved', 'sold'])->default('available');

            $table->unsignedInteger('mileage')->nullable(); // пробег
            $table->string('fuel')->nullable();            // petrol/diesel/hybrid/electric
            $table->string('transmission')->nullable();    // auto/manual
            $table->unsignedSmallInteger('power_hp')->nullable();

            $table->text('description')->nullable();
            $table->string('image_url')->nullable();

            $table->timestamps();

            $table->index(['brand_id', 'status']);
            $table->index(['price']);
            $table->index(['year']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('cars');
    }
};

