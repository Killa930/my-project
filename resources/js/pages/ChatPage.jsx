/*
 * ChatPage — страница чата
 *
 * Для админа: слева список всех чатов, справа — выбранный диалог
 * Для юзера: сразу открывается чат с админом
 * 
 * Обновление через polling каждые 3 секунды.
 */

import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function ChatPage() {
    const { user } = useAuth();
    const toast = useToast();
    const [conversations, setConversations] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const pollingRef = useRef(null);

    const isAdmin = user?.role === "admin";

    // Загрузка списка диалогов
    useEffect(() => {
        loadConversations();
    }, []);

    // Если не админ — сразу открываем диалог с админом
    useEffect(() => {
        if (!isAdmin && conversations.length > 0) {
            setActiveUser(conversations[0].user);
        }
    }, [conversations, isAdmin]);

    // Загрузка сообщений активного чата + polling
    useEffect(() => {
        if (activeUser) {
            loadMessages(activeUser.id);
            // Запускаем polling каждые 3 секунды
            pollingRef.current = setInterval(() => {
                loadMessages(activeUser.id, true);
                loadConversations();
            }, 3000);
        }
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [activeUser?.id]);

    // Автоскролл вниз при новых сообщениях
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadConversations = async () => {
        try {
            const res = await api.get("/conversations");
            setConversations(res.data);
        } catch {} finally { setLoading(false); }
    };

    const loadMessages = async (userId, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get(`/messages/${userId}`);
            setMessages(res.data.messages || []);
        } catch {} finally { if (!silent) setLoading(false); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUser) return;
        setSending(true);
        try {
            await api.post("/messages", {
                receiver_id: activeUser.id,
                body: newMessage.trim(),
            });
            setNewMessage("");
            loadMessages(activeUser.id);
            loadConversations();
        } catch (err) {
            toast.error(err.response?.data?.message || "Kļūda");
        } finally { setSending(false); }
    };

    const handleResolve = async () => {
    if (!confirm(`Vai tiešām dzēst saraksti ar ${activeUser.name}?`)) return;
    try {
        await api.delete(`/messages/${activeUser.id}`);
        toast.success("Saruna dzēsta");
        setActiveUser(null);
        setMessages([]);
        loadConversations();
    } catch {
        toast.error("Kļūda dzēšot");
    }
};

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <AnimateIn animation="fade">
                <h1 className="text-2xl font-bold text-content-primary mb-6">
                    {isAdmin ? "Ziņojumi" : "Atbalsts"}
                </h1>
            </AnimateIn>

            <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden h-[600px] flex">
                {/* Список диалогов — только для админа */}
                {isAdmin && (
                    <aside className="w-72 border-r border-border overflow-y-auto shrink-0">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-content-muted text-sm">
                                Nav sarakstes
                            </div>
                        ) : (
                            conversations.map((c) => (
                                <button
                                    key={c.user.id}
                                    onClick={() => setActiveUser(c.user)}
                                    className={`w-full text-left p-4 border-b border-border hover:bg-surface-tertiary transition-colors ${
                                        activeUser?.id === c.user.id ? "bg-surface-tertiary" : ""
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-accent-subtle rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-accent font-bold">{c.user.name?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-content-primary font-medium truncate">{c.user.name}</p>
                                                {c.unread_count > 0 && (
                                                    <span className="bg-accent text-content-inverted text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                                        {c.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                            {c.last_message && (
                                                <p className="text-content-muted text-xs truncate mt-1">
                                                    {c.last_message.body}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </aside>
                )}

                {/* Область чата */}
                <div className="flex-1 flex flex-col">
                    {!activeUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-content-muted">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4" />
                            <p>{isAdmin ? "Izvēlieties sarunu" : "Nav aktīva tērzēšana"}</p>
                        </div>
                    ) : (
                        <>
                            {/* Заголовок чата */}
<div className="p-4 border-b border-border flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-subtle rounded-full flex items-center justify-center">
            <span className="text-accent font-bold">{activeUser.name?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div>
            <p className="text-content-primary font-semibold">{activeUser.name}</p>
            <p className="text-content-muted text-xs">{activeUser.role === "admin" ? "Administrators" : "Lietotājs"}</p>
        </div>
    </div>
    {/* Кнопка "Atrisināts" — только для админа */}
    {isAdmin && (
        <button
            onClick={handleResolve}
            className="bg-status-success/10 hover:bg-status-success/20 text-status-success px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
            ✓ Atrisināts
        </button>
    )}
</div>

                            {/* Сообщения */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {loading && messages.length === 0 ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-content-muted py-12">
                                        <p>Nav ziņu. Uzrakstiet pirmo!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const mine = msg.sender_id === user.id;
                                        return (
                                            <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                                    mine
                                                        ? "bg-accent text-content-inverted rounded-br-md"
                                                        : "bg-surface-tertiary text-content-primary rounded-bl-md"
                                                }`}>
                                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                                                    <p className={`text-[10px] mt-1 ${mine ? "text-content-inverted/70" : "text-content-muted"}`}>
                                                        {new Date(msg.created_at).toLocaleString("lv-LV", {
                                                            hour: "2-digit", minute: "2-digit",
                                                            day: "2-digit", month: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Форма отправки */}
                            <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Uzrakstiet ziņu..."
                                    className="flex-1 bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                    maxLength={2000}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-content-inverted px-4 py-2.5 rounded-lg transition-colors"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
