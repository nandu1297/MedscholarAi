"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import AppShell from "../components/AppShell";
import { API_URL, askRag, type Citation } from "../lib/api";
import { getStoredRole } from "../lib/role";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

function getEmbeddedCitations(content: string) {
  const citations: Citation[] = [];
  const citationPattern = /Source:\s*"([^"]+)"\s*,\s*Pages?\s+([^\r\n]+)/g;
  let match: RegExpExecArray | null;

  while ((match = citationPattern.exec(content)) !== null) {
    const [, source, pages] = match;
    pages
      .split(/,\s*/)
      .map((page) => page.trim())
      .filter(Boolean)
      .forEach((page) => citations.push({ source, page }));
  }

  return citations;
}

function getAnswerContent(content: string) {
  return content.replace(/\n?\*\*References from\*\*[\s\S]*$/i, "").trim();
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function MarkdownAnswer({ content }: { content: string }) {
  return (
    <div className="space-y-2 whitespace-pre-wrap">
      {content.split("\n").map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={`space-${index}`} className="h-2" />;

        if (trimmedLine.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 text-base font-bold leading-6">
              {renderInlineMarkdown(trimmedLine.slice(4))}
            </h3>
          );
        }

        if (trimmedLine.startsWith("- ")) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span aria-hidden="true">•</span>
              <span>{renderInlineMarkdown(trimmedLine.slice(2))}</span>
            </div>
          );
        }

        return <p key={index}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

const suggestions = [
  "What are the main findings discussed in these papers?",
  "Summarize the evidence regarding this topic.",
  "What are the key conclusions from the available research?",
  "Compare findings across the relevant documents.",
];

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const citations = [
    ...(message.citations || []),
    ...getEmbeddedCitations(message.content),
  ];
  const answerContent = getAnswerContent(message.content);
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-2xl gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isUser ? "bg-[var(--ink)] text-white" : "bg-[var(--accent-soft)] text-[var(--accent)]"}`}
        >
          {isUser ? "You" : "M"}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-7 ${isUser ? "bg-[var(--ink)] text-white" : "border border-[var(--line)] bg-white text-[var(--ink)]"}`}
        >
          <MarkdownAnswer content={answerContent} />
          {!isUser && citations.length > 0 && (
            <div className="mt-4 border-t border-[var(--line)] pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                References
              </p>
              <div className="space-y-1">
                {citations.map((citation, index) => {
                  const filename = citation.source.split(/[\\/]/).pop() || citation.source;
                  return (
                    <div
                      key={`${citation.source}-${citation.page}-${index}`}
                      className="text-xs font-bold text-[var(--muted)]"
                    >
                      <strong>Source:</strong>{" "}
                      <a
                        href={`${API_URL}/documents/${encodeURIComponent(filename)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[var(--accent)] underline-offset-2 hover:underline"
                      >
                        {filename}
                      </a>{" "}
                      <strong>Page:</strong>{" "}
                      <strong>{citation.page}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = getStoredRole();
    fetch(`${API_URL}/history?user_role=${role}`)
      .then((response) => {
        if (!response.ok) throw new Error("History request failed");
        return response.json() as Promise<{ history: ChatMessage[] }>;
      })
      .then((data) => setMessages(data.history || []))
      .catch(() =>
        setError(
          "Connect the backend to load your saved research conversation.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function submitQuestion(event?: FormEvent) {
    event?.preventDefault();
    const text = query.trim();
    if (!text || sending) return;
    setQuery("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: text }]);
    setSending(true);
    try {
      const data = await askRag(text, getStoredRole(), "chat");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
        },
      ]);
    } catch {
      setError(
        "MedScholar AI could not reach the research service. Check that the backend is running.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-[var(--line)] bg-white/75 px-6 py-6 backdrop-blur sm:px-10">
          <div className="mx-auto flex max-w-5xl items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Research desk
              </p>
              <h1 className="serif-display mt-2 text-4xl text-[var(--ink)]">
                Ask MedScholar AI
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Explore medical literature through natural language.
              </p>
            </div>
            <span className="mt-1 hidden items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--muted)] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#42a979]" /> Research
              assistant ready
            </span>
          </div>
        </header>
        <section className="flex flex-1 flex-col px-6 py-8 sm:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
            {loading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-[var(--muted)]">
                Loading your research desk...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center py-8">
                <div className="mb-10 max-w-xl">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg font-bold text-[var(--accent)]">
                    M
                  </span>
                  <h2 className="serif-display text-5xl leading-tight text-[var(--ink)]">
                    What would you like
                    <br />
                    to explore?
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted)]">
                    Ask about information contained in your medical research
                    documents. Start broad, then follow the evidence.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setQuery(suggestion);
                      }}
                      className="group rounded-2xl border border-[var(--line)] bg-white p-4 text-left text-sm leading-6 text-[var(--muted)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--ink)]"
                    >
                      {suggestion}
                      <span className="mt-3 block text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                        Use question -&gt;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-5 pb-8">
                {messages.map((message, index) => (
                  <Message key={`${message.role}-${index}`} message={message} />
                ))}
                {sending && (
                  <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
                      M
                    </span>
                    <span>
                      MedScholar AI is thinking
                      <span className="animate-pulse">...</span>
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
            {error && (
              <p className="mb-3 text-sm text-[#b24c43]" role="alert">
                {error}
              </p>
            )}
            <form
              onSubmit={submitQuestion}
              className="mt-6 flex items-end gap-3 rounded-2xl border border-[var(--line)] bg-white p-3 shadow-[0_8px_30px_rgba(23,33,31,0.06)]"
            >
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submitQuestion();
                  }
                }}
                rows={1}
                className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                placeholder="Ask about the medical literature..."
                aria-label="Research question"
              />
              <button
                disabled={!query.trim() || sending}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--ink)] text-lg text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send question"
              >
                ↗
              </button>
            </form>
            <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
              Shift + Enter for a new line. Answers are educational and grounded
              in the indexed documents.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
