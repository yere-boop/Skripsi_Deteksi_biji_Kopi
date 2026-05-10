"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Coffee,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronDown,
  Trash2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { label: "☕ Arabika vs Robusta", value: "arabika" },
  { label: "🔥 Tingkat Sangrai", value: "sangrai" },
  { label: "📊 Sistem Grading", value: "grade" },
  { label: "🛡️ Cacat Fisik", value: "cacat" },
  { label: "📦 Penyimpanan", value: "simpan" },
  { label: "☕ Metode Seduh", value: "seduh" },
];

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Detect if scrolled up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 60;
    setShowScrollBtn(!isNearBottom);
  };

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content:
            "👋 Halo! Saya **CoffeeBot**, asisten AI Anda untuk segala hal tentang kopi.\n\nSaya bisa membantu Anda tentang:\n• Spesies kopi (Arabika/Robusta)\n• Tingkat sangrai\n• Grading & skor mutu\n• Cacat fisik biji kopi\n• Penyimpanan & penyeduhan\n• Cara menggunakan sistem\n\nSilakan tanyakan apa saja! 😊",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: data.reply || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Pulse notification if chat is closed
      if (!isOpen) setHasNewMessage(true);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "bot",
        content:
          "⚠️ Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan backend API berjalan di `localhost:8000`.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split("\n").map((line, i) => {
      // Bold
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-amber-400 font-semibold">$1</strong>'
      );
      // Bullet points
      if (line.startsWith("•")) {
        return (
          <div
            key={i}
            className="flex items-start gap-2 ml-1"
            dangerouslySetInnerHTML={{
              __html: formatted,
            }}
          />
        );
      }
      if (line === "---") {
        return <hr key={i} className="border-white/10 my-2" />;
      }
      return (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: formatted }}
          className={line === "" ? "h-2" : ""}
        />
      );
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => {
              setIsOpen(true);
              setHasNewMessage(false);
            }}
            className="fixed bottom-6 right-6 z-50 group"
            id="chatbot-toggle"
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 animate-ping opacity-20" />

            {/* Button */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_40px_-8px_rgba(245,158,11,0.6)] transition-all group-hover:scale-110 group-hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.8)]">
              <MessageCircle className="h-7 w-7 text-white" />

              {/* New message badge */}
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-[#0d0a08] flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-white">!</span>
                </motion.div>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="rounded-xl bg-[#1a1510] border border-white/10 px-4 py-2 text-sm font-medium text-white whitespace-nowrap shadow-xl">
                Tanya CoffeeBot ☕
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col w-[400px] h-[600px] max-h-[85vh] max-w-[calc(100vw-48px)] rounded-[2rem] border border-white/10 bg-[#0d0a08]/95 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_-20px_rgba(245,158,11,0.15)] overflow-hidden"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-orange-900/20" />

              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/40">
                    <Coffee className="h-5 w-5 text-white" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[#0d0a08] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    CoffeeBot
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </h3>
                  <p className="text-xs text-white/40">AI Assistant • Online</p>
                </div>
              </div>

              <div className="relative flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/5 hover:text-white/60"
                  title="Hapus percakapan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/5 hover:text-white/60"
                  title="Tutup"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(245,158,11,0.2) transparent",
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: idx === messages.length - 1 ? 0.1 : 0,
                  }}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 text-white"
                        : "bg-white/[0.04] border border-white/5 text-white/80"
                    }`}
                  >
                    <div className="space-y-0.5">{formatContent(msg.content)}</div>
                    <p
                      className={`mt-2 text-[10px] ${
                        msg.role === "user" ? "text-amber-400/40 text-right" : "text-white/20"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-all hover:bg-amber-500/30"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2 px-1">
                  Pertanyaan Populer
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => sendMessage(q.value)}
                      className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/5 p-4">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-1 transition-all focus-within:border-amber-500/30 focus-within:bg-white/[0.05]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanyakan tentang kopi..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/25 outline-none disabled:opacity-50"
                  id="chatbot-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none"
                  id="chatbot-send"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-white/15">
                Powered by Coffee Inspect AI Engine
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
