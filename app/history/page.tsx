"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
type MessageItem = {
  role: string;
  content: string;
};

export default function HistoryPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function clearHistory() {
    try {
      const response = await fetch(`${API_URL}/clearhistory`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to clear history");
      setMessages([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  }

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) throw new Error("Could not load chat history");

        const data = await response.json();
        const records = Array.isArray(data) ? data : data.history;

        setMessages(
          Array.isArray(records)
            ? records.map((item: Record<string, unknown>) => ({
                role: String(item.role ?? "assistant").toLowerCase(),
                content: String(item.message ?? item.text ?? item.content ?? ""),
              }))
            : [],
        );
      } catch (error) {
        console.error("Failed to load history:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, []);

  return (
    <AppShell>
      <div className="min-h-screen px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col justify-between gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Your record
              </p>
              <h1 className="serif-display mt-2 text-4xl text-[var(--ink)]">
                Conversation history
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Revisit your previous research conversations.
              </p>
            </div>
            <button
              onClick={() => void clearHistory()}
              disabled={!messages.length}
              className="rounded-xl border border-[#e3c9c5] px-4 py-3 text-sm font-semibold text-[#a34f48] transition hover:bg-[#fff6f4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear history
            </button>
          </header>

          {loading ? (
            <div className="py-16 text-center text-sm text-[var(--muted)]">
              Loading conversation history...
            </div>
          ) : !messages.length ? (
            <div className="grid-paper mt-8 rounded-2xl border border-dashed border-[var(--line)] px-6 py-20 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                ◷
              </div>
              <h2 className="serif-display text-3xl">No conversations yet.</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                Your future questions and research notes will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className="rounded-2xl border border-[var(--line)] bg-white p-5"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[10px]">
                      {message.role === "user" ? "U" : "M"}
                    </span>
                    {message.role === "user" ? "Your question" : "MedScholar AI"}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--ink)]">
                    {message.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
