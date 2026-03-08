<?php

/*
 * Таблица USERS — пользователи системы
 * 
 * Зачем: хранит всех пользователей сайта (гости не хранятся — они просто
 * не залогинены). У каждого пользователя есть роль: 'user' или 'admin'.
 * 
 * Связи: users → cars (один пользователь может иметь много объявлений)
 *        users → favorites (один пользователь может добавить много авто в избранное)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            // id — уникальный номер пользователя, создаётся автоматически
            $table->id();

            // name — имя пользователя, обязательное поле
            $table->string('name');

            // email — почта, обязательна и уникальна (нельзя два аккаунта на одну почту)
            $table->string('email')->unique();

            // email_verified_at — дата подтверждения почты (nullable = может быть пустым)
            // Laravel использует это для функции подтверждения email
            $table->timestamp('email_verified_at')->nullable();

            // password — хеш пароля (Laravel автоматически хеширует через bcrypt)
            $table->string('password');

            // phone — телефон, необязательное поле
            $table->string('phone', 20)->nullable();

            // role — роль пользователя: 'user' (обычный) или 'admin' (администратор)
            // default('user') означает что при регистрации роль автоматически = 'user'
            $table->enum('role', ['user', 'admin'])->default('user');

            // avatar — путь к фото профиля, необязательное
            $table->string('avatar')->nullable();

            // remember_token — токен для функции "Запомнить меня" при входе
            $table->rememberToken();

            // created_at и updated_at — Laravel автоматически заполняет эти поля
            // created_at = когда создан аккаунт, updated_at = когда последний раз изменён
            $table->timestamps();
        });

        // Таблица для сброса пароля — стандартная для Laravel
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Таблица сессий — Laravel хранит здесь данные о залогиненных пользователях
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
