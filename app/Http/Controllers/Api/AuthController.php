<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'phone'    => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone'    => $validated['phone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Nepareizs e-pasts vai parole'], 401);
        }

        $user = Auth::user();

        if ($user->is_blocked) {
            Auth::logout();
            return response()->json(['message' => 'Jūsu konts ir bloķēts. Sazinieties ar administratoru.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Atslēgšanās veiksmīga']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /*
     * UPDATE PROFILE — изменение данных профиля
     * 
     * Позволяет пользователю изменить имя, телефон и пароль.
     * Email не меняется (он ключ для авторизации).
     * Для смены пароля требуется указать текущий пароль.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'phone'        => 'sometimes|nullable|string|max:20',
            'current_password' => 'sometimes|required_with:new_password',
            'new_password' => ['sometimes', 'nullable', 'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        // Обновляем имя если передано
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        // Обновляем телефон (даже если null — разрешаем очистить)
        if ($request->has('phone')) {
            $user->phone = $validated['phone'] ?? null;
        }

        // Смена пароля — проверяем текущий
        if (!empty($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'errors' => ['current_password' => ['Nepareiza pašreizējā parole']]
                ], 422);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profils atjaunināts',
            'user' => $user,
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate(['password' => 'required']);
        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Nepareiza parole'], 403);
        }

        foreach ($user->cars as $car) {
            foreach ($car->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Konts veiksmīgi dzēsts']);
    }
}
