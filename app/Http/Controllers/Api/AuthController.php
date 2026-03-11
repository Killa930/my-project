<?php

namespace App\Http\Controllers\Api;

/*
 * AuthController — регистрация, вход, выход
 * 
 * Для API-авторизации используем Laravel Sanctum (встроен в Laravel 12).
 * Sanctum выдаёт токен при входе. React сохраняет токен и отправляет
 * его с каждым запросом в заголовке Authorization.
 * 
 * Процесс:
 * 1) Пользователь заполняет форму входа на React
 * 2) React отправляет POST /api/login { email, password }
 * 3) Laravel проверяет данные, возвращает токен
 * 4) React сохраняет токен и подставляет в будущие запросы
 * 5) Laravel видит токен → знает кто отправил запрос
 */

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /*
     * REGISTER — регистрация нового пользователя
     * 
     * POST /api/register
     * Body: { name, email, password, password_confirmation, phone? }
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed', // требует поле password_confirmation с тем же значением
                Password::min(8)           // минимум 8 символов
                    ->mixedCase()          // минимум 1 заглавная + 1 строчная
                    ->numbers()            // минимум 1 цифра
                    ->symbols(),           // минимум 1 спецсимвол (!@#$ и т.д.)
            ],
            'phone'    => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone'    => $validated['phone'] ?? null,
        ]);

        /*
         * createToken('auth_token') — Sanctum создаёт токен для этого пользователя.
         * plainTextToken — сам токен в виде строки (видим только один раз!).
         * React сохранит его в localStorage или в state.
         */
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /*
     * LOGIN — вход в систему
     * 
     * POST /api/login
     * Body: { email, password }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        /*
         * Auth::attempt — проверяет email + password.
         * Берёт пользователя из БД по email, хеширует введённый пароль
         * и сравнивает с хешем в базе.
         * Возвращает true/false.
         */
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Nepareizs e-pasts vai parole'
            ], 401); // 401 = Unauthorized
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /*
     * LOGOUT — выход из системы
     * 
     * POST /api/logout
     * 
     * Удаляет текущий токен — после этого запросы с этим токеном
     * будут возвращать 401 (неавторизован).
     */
    public function logout(Request $request)
    {
        // Удаляет только текущий токен (не все токены пользователя)
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Atslēgšanās veiksmīga']);
    }

    /*
     * ME — информация о текущем пользователе
     * 
     * GET /api/me
     * 
     * React вызывает этот маршрут при загрузке приложения,
     * чтобы проверить: "я ещё залогинен или токен истёк?"
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
