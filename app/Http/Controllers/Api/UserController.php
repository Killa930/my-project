<?php

namespace App\Http\Controllers\Api;

/*
 * UserController — управление пользователями (только для админа)
 *
 * - index()   → список всех пользователей со статистикой
 * - block()   → заблокировать пользователя
 * - unblock() → разблокировать
 * - destroy() → удалить пользователя и все его данные
 */

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /*
     * INDEX — список всех пользователей
     * Показывает статистику: сколько объявлений, darījumi, отзывов
     */
    public function index(Request $request)
    {
        // Только админ может видеть список
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        $query = User::withCount(['cars', 'favorites', 'transactions']);

        // Поиск по имени или email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Фильтр по роли
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Фильтр по статусу блокировки
        if ($request->filled('status')) {
            $query->where('is_blocked', $request->status === 'blocked');
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($users);
    }

    /*
     * BLOCK — заблокировать пользователя
     * Все активные токены удаляются, пользователь будет выкинут из системы.
     */
    public function block(User $user)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Nevar bloķēt sevi'], 422);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Nevar bloķēt administratoru'], 422);
        }

        $user->update(['is_blocked' => true]);
        $user->tokens()->delete(); // выкидываем из системы

        return response()->json(['message' => 'Lietotājs bloķēts', 'user' => $user]);
    }

    /*
     * UNBLOCK — разблокировать
     */
    public function unblock(User $user)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        $user->update(['is_blocked' => false]);
        return response()->json(['message' => 'Lietotājs atbloķēts', 'user' => $user]);
    }

    /*
     * DESTROY — удалить пользователя
     * cascadeOnDelete удалит связанные данные автоматически.
     * Но сначала удаляем фото с диска.
     */
    public function destroy(User $user)
    {
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Nevar dzēst sevi'], 422);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Nevar dzēst administratoru'], 422);
        }

        // Удаляем фото объявлений
        foreach ($user->cars as $car) {
            foreach ($car->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        $user->delete();
        return response()->json(['message' => 'Lietotājs dzēsts']);
    }
}
