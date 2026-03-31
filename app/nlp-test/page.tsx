"use client";

import { useState } from "react";
import { MessageSquare, Send, Bot, User, Zap, Package, Wrench } from "lucide-react";
import type { NLPResult } from "@/lib/types";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  nlpData?: NLPResult;
}

export default function NLPTestPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/nlp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, callerPhone: callerPhone || undefined }),
      });
      const data: NLPResult = await res.json();
      const aiMsg: ChatMessage = { role: "ai", text: data.responseText, nlpData: data };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Bağışlayın, sorğunuzu emal edərkən xəta baş verdi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    "Evim üçün təhlükəsizlik kamerası lazımdır",
    "İnternetim çox yavaşdır",
    "Ağıllı termostat neçəyədir?",
    "Quraşdırma ilə bağlı kömək lazımdır",
    "Monitorinq xidmətləriniz haqqında məlumat verin",
    "Ağıllı kilid işləmir",
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">NLP Test</h1>
        <p className="text-sm text-muted mt-1">
          Sİ səsli cavab sistemini sınayın — zəng edənlərin sorğularını simulyasiya edin və NLP nəticələrini görün
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">NLP mühərrikini sınamaq üçün söhbətə başlayın</p>
                <p className="text-xs mt-1">Məhsullar, xidmətlər və ya dəstək haqqında soruşun</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-background border border-border"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.nlpData && (
                    <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-warning" />
                        <span className="text-xs opacity-70">
                          Niyyət: {msg.nlpData.intent} ({Math.round(msg.nlpData.confidence * 100)}%)
                        </span>
                      </div>
                      {msg.nlpData.suggestedProducts.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 text-success" />
                          <span className="text-xs opacity-70">
                            Məhsullar: {msg.nlpData.suggestedProducts.join(", ")}
                          </span>
                        </div>
                      )}
                      {msg.nlpData.suggestedServices.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Wrench className="w-3 h-3 text-accent" />
                          <span className="text-xs opacity-70">
                            Xidmətlər: {msg.nlpData.suggestedServices.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background border border-border rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-border flex gap-3">
            <input
              type="text"
              placeholder="Zəng edən kimi mesaj yazın..."
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="w-72 space-y-4">
          {/* Caller Phone */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Zəng edənin nömrəsi (isteğə bağlı)</h3>
            <input
              type="text"
              placeholder="+1234567890"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              value={callerPhone}
              onChange={(e) => setCallerPhone(e.target.value)}
            />
            <p className="text-xs text-muted mt-2">
              Fərdiləşdirilmiş cavabları sınamaq üçün tanınan telefon nömrəsi daxil edin
            </p>
          </div>

          {/* Preset Queries */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Sürətli Test Sorğuları</h3>
            <div className="space-y-2">
              {presetQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => setInput(query)}
                  className="w-full text-left text-xs bg-background border border-border rounded-lg px-3 py-2 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
