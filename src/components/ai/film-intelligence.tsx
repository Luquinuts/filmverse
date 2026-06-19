'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '@/lib/gemini';

const SUGGESTIONS = [
  'Recomendame una película de ciencia ficción',
  '¿Cuál es la mejor película de Nolan?',
  'Películas parecidas a Matrix',
  '¿Qué películas me recomendás para ver este finde?',
];

export function FilmIntelligence() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus del input al abrir
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
        }),
      });

      const data = (await res.json()) as { response?: string; error?: string };

      const botMsg: ChatMessage = {
        role: 'model',
        text: data.response ?? data.error ?? 'Error inesperado.',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Ups, no pude conectar con FilmIntelligence. Intentá de nuevo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bubble flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-cinema-gold to-cinema-amber shadow-lg shadow-cinema-gold/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cinema-gold/40"
        aria-label="Abrir FilmIntelligence"
      >
        <Sparkles className="size-6 text-black" />
      </button>

      {/* Modal del chat */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-end sm:p-6">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel del chat */}
          <div className="relative z-10 flex h-[80vh] w-full flex-col rounded-t-2xl border border-white/10 bg-background shadow-2xl sm:mb-4 sm:h-[600px] sm:w-[420px] sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-cinema-gold to-cinema-amber">
                  <Sparkles className="size-4 text-black" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    FilmIntelligence
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {loading ? 'Pensando…' : 'Tu asistente de cine'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MessageSquare className="mb-3 size-10 text-muted-foreground/30" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Preguntame lo que quieras sobre cine:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        disabled={loading}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-cinema-gold/40 hover:text-cinema-gold disabled:opacity-40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/20'
                        : 'bg-white/5 text-muted-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="mb-4 flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-cinema-gold/60" />
                      <span className="size-2 animate-bounce rounded-full bg-cinema-gold/60 [animation-delay:0.1s]" />
                      <span className="size-2 animate-bounce rounded-full bg-cinema-gold/60 [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-5 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Preguntale a FilmIntelligence..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-cinema-gold/50 focus:outline-none disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cinema-gold text-black transition-colors hover:bg-cinema-amber disabled:opacity-40"
                  aria-label="Enviar"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
