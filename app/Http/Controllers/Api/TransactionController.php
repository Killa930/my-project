<?php

namespace App\Http\Controllers\Api;

/*
 * TransactionController — управление darījumi (заявками на покупку)
 * 
 * - index()  → мои darījumi (как покупатель и как продавец)
 * - store()  → создать заявку на покупку
 * - update() → изменить статус (продавец подтверждает/отклоняет)
 */

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /*
     * INDEX — все darījumi текущего пользователя
     * Показывает и те где он покупатель, и те где он продавец.
     */
    public function index()
    {
        $userId = Auth::id();

        // Darījumi где я покупатель
        $buying = Transaction::where('buyer_id', $userId)
            ->with(['car.carModel.manufacturer', 'car.user:id,name,phone', 'review'])
            ->latest()
            ->get()
            ->map(fn($t) => array_merge($t->toArray(), ['role' => 'buyer']));

        // Darījumi где я продавец (через car.user_id)
        $selling = Transaction::whereHas('car', fn($q) => $q->where('user_id', $userId))
            ->with(['car.carModel.manufacturer', 'buyer:id,name,phone,email', 'review'])
            ->latest()
            ->get()
            ->map(fn($t) => array_merge($t->toArray(), ['role' => 'seller']));

        return response()->json($buying->merge($selling)->sortByDesc('created_at')->values());
    }

    /*
     * STORE — создать заявку на покупку
     * Покупатель нажимает "Pirkt" на объявлении.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ad_id' => 'required|exists:cars,id',
        ]);

        $car = Car::findOrFail($validated['ad_id']);

        // Нельзя купить своё объявление
        if ($car->user_id === Auth::id()) {
            return response()->json(['message' => 'Nevar pirkt savu sludinājumu'], 422);
        }

        // Нельзя купить проданное
        if ($car->status !== 'active') {
            return response()->json(['message' => 'Sludinājums nav aktīvs'], 422);
        }

        // Проверяем: нет ли уже активной заявки от этого пользователя
        $existing = Transaction::where('ad_id', $car->id)
            ->where('buyer_id', Auth::id())
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Pieteikums jau nosūtīts'], 422);
        }

        $transaction = Transaction::create([
            'ad_id' => $car->id,
            'buyer_id' => Auth::id(),
            'amount' => $car->price,
            'status' => 'pending',
        ]);

        $transaction->load(['car.carModel.manufacturer', 'buyer:id,name']);

        return response()->json($transaction, 201);
    }

    /*
     * UPDATE — продавец меняет статус darījums
     * completed = подтверждён (авто помечается как sold)
     * failed = отклонён
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Только продавец может менять статус
        $car = $transaction->car;
        if ($car->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Nav tiesību'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:completed,failed',
        ]);

        $transaction->update(['status' => $validated['status']]);

        // Если darījums завершён — помечаем авто как проданное
        if ($validated['status'] === 'completed') {
            $car->update(['status' => 'sold']);

            // Отклоняем все остальные заявки на это авто
            Transaction::where('ad_id', $car->id)
                ->where('id', '!=', $transaction->id)
                ->where('status', 'pending')
                ->update(['status' => 'failed']);
        }

        return response()->json($transaction->fresh()->load(['car.carModel.manufacturer', 'buyer:id,name']));
    }
}
