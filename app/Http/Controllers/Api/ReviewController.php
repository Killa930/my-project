<?php

namespace App\Http\Controllers\Api;

/*
 * ReviewController — управление atsauksmes (отзывами)
 * 
 * - store() → создать отзыв после завершённого darījums
 * - index() → отзывы о конкретном продавце
 */

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /*
     * INDEX — отзывы о продавце (по user_id)
     * Показываются на странице объявления.
     */
    public function index(Request $request)
    {
        $request->validate([
            'seller_id' => 'required|exists:users,id',
        ]);

        $reviews = Review::whereHas('transaction.car', function ($q) use ($request) {
            $q->where('user_id', $request->seller_id);
        })
            ->with(['user:id,name', 'transaction:id,ad_id'])
            ->latest()
            ->get();

        // Средний рейтинг
        $avgRating = $reviews->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($avgRating, 1),
            'total' => $reviews->count(),
        ]);
    }

    /*
     * STORE — создать отзыв
     * Только покупатель может оставить отзыв, и только после completed darījums.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        // Проверки
        if ($transaction->buyer_id !== Auth::id()) {
            return response()->json(['message' => 'Tikai pircējs var rakstīt atsauksmi'], 403);
        }

        if ($transaction->status !== 'completed') {
            return response()->json(['message' => 'Darījums nav pabeigts'], 422);
        }

        // Проверяем: не писал ли уже отзыв
        if ($transaction->review) {
            return response()->json(['message' => 'Atsauksme jau uzrakstīta'], 422);
        }

        $review = Review::create([
            'transaction_id' => $validated['transaction_id'],
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }
}
