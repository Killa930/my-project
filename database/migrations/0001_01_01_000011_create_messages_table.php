<?php

/*
 * Таблица MESSAGES — чат между пользователем и админом
 *
 * sender_id — кто отправил (user_id)
 * receiver_id — кому (user_id)
 * body — текст сообщения
 * is_read — прочитано ли получателем
 *
 * Для получения чата между двумя людьми:
 * WHERE (sender_id = A AND receiver_id = B) OR (sender_id = B AND receiver_id = A)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            // Индекс для быстрого поиска чатов между двумя людьми
            $table->index(['sender_id', 'receiver_id']);
            $table->index(['receiver_id', 'is_read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
