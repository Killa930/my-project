<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ProfanityFilter;
use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['seller_id' => 'required|exists:users,id']);

        $reviews = Review::whereHas('transaction.car', function ($q) use ($request) {
            $q->where('user_id', $request->seller_id);
        })
            ->with(['user:id,name', 'transaction:id,ad_id'])
            ->latest()
            ->get();

        // Цензура в комментариях при выводе
        $reviews->each(function ($review) {
            $review->comment = ProfanityFilter::clean($review->comment);
        });

        $avgRating = $reviews->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($avgRating, 1),
            'total' => $reviews->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        if ($transaction->buyer_id !== Auth::id()) {
            return response()->json(['message' => 'Tikai pircējs var rakstīt atsauksmi'], 403);
        }

        if ($transaction->status !== 'completed') {
            return response()->json(['message' => 'Darījums nav pabeigts'], 422);
        }

        if ($transaction->review) {
            return response()->json(['message' => 'Atsauksme jau uzrakstīta'], 422);
        }

        // Применяем фильтр к комментарию перед сохранением
        $comment = ProfanityFilter::clean($validated['comment']);

        $review = Review::create([
            'transaction_id' => $validated['transaction_id'],
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $comment,
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }
}
