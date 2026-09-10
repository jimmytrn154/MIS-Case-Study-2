"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ChatMessageBubble from "./ChatMessageBubble";
import MealPlanGroup from "./MealPlanGroup";
import { mealPlanResponseSchema, type Meal } from "@/types/meal-plan";
import type { ChatMessage } from "@/types/chat";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  mealPlan?: Meal[];
  estimatedTotal?: number;
  estimatedSavings?: number;
  budget?: number;
  addedToCart?: boolean;
}

const MAX_HISTORY_TURNS = 10;
const STORAGE_KEY = "freshwave-chat";

const GREETING: DisplayMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi, I'm the FreshWave Assistant! Tell me your household size, budget, and any dietary needs, and I'll help you plan meals from what's in stock at Riverside. For example, you can say: 'I have a family of 4, a budget of $100, and we need vegan meals.'",
};

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<DisplayMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage after mount so server and first client render
  // match — same pattern as CartProvider, so returning to /assistant (or a
  // full reload) restores the conversation instead of resetting to the
  // greeting.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
    } catch {
      // Ignore unavailable/corrupt storage — keep the default greeting.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable (private mode, quota) — chat still works in-memory.
    }
  }, [messages, hydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: DisplayMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };

    const history: ChatMessage[] = messages
      .filter((m) => m.id !== "greeting" && !m.isError)
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "FreshWave Assistant is temporarily unavailable. Please try again.";
        throw new Error(errorMessage);
      }

      // Never trust the shape of AI-derived JSON — validate before rendering.
      const parsed = mealPlanResponseSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          "FreshWave Assistant sent back something unexpected. Please try again.",
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: parsed.data.message,
          mealPlan: parsed.data.mealPlan,
          estimatedTotal: parsed.data.estimatedTotal,
          estimatedSavings: parsed.data.estimatedSavings,
          budget: parsed.data.budget,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function markAddedToCart(messageId: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, addedToCart: true } : m)),
    );
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[65dvh] flex-col rounded-2xl border border-zinc-100 bg-white sm:h-[70dvh]">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            <ChatMessageBubble message={message} isError={message.isError} />
            {message.mealPlan && message.mealPlan.length > 0 ? (
              <MealPlanGroup
                mealPlan={message.mealPlan}
                estimatedTotal={message.estimatedTotal ?? 0}
                estimatedSavings={message.estimatedSavings ?? 0}
                budget={message.budget}
                addedToCart={message.addedToCart ?? false}
                onAddedToCart={() => markAddedToCart(message.id)}
              />
            ) : null}
          </div>
        ))}
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100" />
            <span className="animate-pulse">FreshWave Assistant is typing…</span>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-zinc-100 p-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about meals or deals…"
          rows={1}
          disabled={isLoading}
          className="max-h-32 min-h-11 flex-1 resize-none overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || input.trim().length === 0}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
