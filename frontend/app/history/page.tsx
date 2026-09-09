"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { API_URL } from "../lib/api";
import { getStoredRole } from "../lib/role";

type MessageItem = {
  role: string;
  content: string;
};

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkdownResponse({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-7 text-[var(--ink)]">
      {content.split("\n").map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={`space-${index}`} className="h-2" />;

        const headingMatch = trimmedLine.match(/^#{2,3}\s+(.+)$/);
        if (headingMatch) {
          const isSources = /^(sources|references|citations)$/i.test(headingMatch[1]);
          return (
            <h3
              key={index}
              className={`pt-3 text-base font-bold leading-6 ${isSources ? "border-t border-[var(--line)] text-[var(--accent)]" : "text-[var(--ink)]"}`}
            >
              {renderInlineMarkdown(headingMatch[1])}
            </h3>
          );
        }

        const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span aria-hidden="true">•</span>
              <span>{renderInlineMarkdown(bulletMatch[1])}</span>
            </div>
          );
        }

        const numberedMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span aria-hidden="true" className="font-semibold">{trimmedLine.match(/^\d+/)?.[0]}.</span>
              <span>{renderInlineMarkdown(numberedMatch[1])}</span>
            </div>
          );
        }

        return <p key={index}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

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
        const response = await fetch(`${API_URL}/history?user_role=${getStoredRole()}`);
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
                  {message.role === "assistant" ? (
                    <MarkdownResponse content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--ink)]">
                      {message.content}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
