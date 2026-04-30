<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ProfanityFilter;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function conversations()
    {
        $userId = Auth::id();
        $isAdmin = Auth::user()->isAdmin();

        if ($isAdmin) {
            $userIds = Message::where('sender_id', $userId)
                ->orWhere('receiver_id', $userId)
                ->pluck('sender_id')
                ->merge(Message::where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId)
                    ->pluck('receiver_id'))
                ->unique()
                ->reject(fn($id) => $id === $userId)
                ->values();

            $conversations = User::whereIn('id', $userIds)->get()->map(function ($user) use ($userId) {
                $lastMessage = Message::where(function ($q) use ($userId, $user) {
                    $q->where('sender_id', $userId)->where('receiver_id', $user->id);
                })->orWhere(function ($q) use ($userId, $user) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $userId);
                })->latest()->first();

                // Цензура в превью последнего сообщения
                if ($lastMessage) {
                    $lastMessage->body = ProfanityFilter::clean($lastMessage->body);
                }

                $unread = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'user' => $user,
                    'last_message' => $lastMessage,
                    'unread_count' => $unread,
                ];
            })->sortByDesc(fn($c) => $c['last_message']?->created_at)->values();

            return response()->json($conversations);
        } else {
            $admin = User::where('role', 'admin')->first();
            if (!$admin) return response()->json([]);

            $lastMessage = Message::where(function ($q) use ($userId, $admin) {
                $q->where('sender_id', $userId)->where('receiver_id', $admin->id);
            })->orWhere(function ($q) use ($userId, $admin) {
                $q->where('sender_id', $admin->id)->where('receiver_id', $userId);
            })->latest()->first();

            if ($lastMessage) {
                $lastMessage->body = ProfanityFilter::clean($lastMessage->body);
            }

            $unread = Message::where('sender_id', $admin->id)
                ->where('receiver_id', $userId)
                ->where('is_read', false)
                ->count();

            return response()->json([[
                'user' => $admin,
                'last_message' => $lastMessage,
                'unread_count' => $unread,
            ]]);
        }
    }

    public function messages(User $user)
    {
        $myId = Auth::id();

        Message::where('sender_id', $user->id)
            ->where('receiver_id', $myId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where(function ($q) use ($myId, $user) {
            $q->where('sender_id', $myId)->where('receiver_id', $user->id);
        })->orWhere(function ($q) use ($myId, $user) {
            $q->where('sender_id', $user->id)->where('receiver_id', $myId);
        })->orderBy('created_at')->get();

        // Цензура в каждом сообщении
        $messages->each(function ($msg) {
            $msg->body = ProfanityFilter::clean($msg->body);
        });

        return response()->json([
            'messages' => $messages,
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string|max:2000',
        ]);

        $sender = Auth::user();
        $receiver = User::find($validated['receiver_id']);

        if (!$sender->isAdmin() && !$receiver->isAdmin()) {
            return response()->json(['message' => 'Var rakstīt tikai administratoram'], 403);
        }

        // Применяем фильтр перед сохранением
        $cleanBody = ProfanityFilter::clean($validated['body']);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $validated['receiver_id'],
            'body' => $cleanBody,
            'is_read' => false,
        ]);

        return response()->json($message, 201);
    }

    public function unreadCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /*
 * Удалить всю переписку с пользователем (только админ).
 * Используется когда админ решил проблему пользователя.
 */
public function destroy(User $user)
{
    if (!Auth::user()->isAdmin()) {
        return response()->json(['message' => 'Nav tiesību'], 403);
    }

    $myId = Auth::id();

    Message::where(function ($q) use ($myId, $user) {
        $q->where('sender_id', $myId)->where('receiver_id', $user->id);
    })->orWhere(function ($q) use ($myId, $user) {
        $q->where('sender_id', $user->id)->where('receiver_id', $myId);
    })->delete();

    return response()->json(['message' => 'Saruna dzēsta']);
}
}
