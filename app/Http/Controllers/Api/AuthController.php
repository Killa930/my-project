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

        // Проверка блокировки
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
