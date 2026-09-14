"use client";

import { FormEvent, useState } from "react";
import AppShell from "./AppShell";
import { askRag, type Feature } from "../lib/api";
import { getStoredRole, type UserRole } from "../lib/role";

const featureCopy: Record<Exclude<Feature, "chat">, { title: string; eyebrow: string; description: string; action: string }> = {
  teaching: {
    title: "Teaching",
    eyebrow: "Professor workspace",
    description: "Turn the indexed medical literature into structured teaching material.",
    action: "Generate teaching material",
  },
  generate_questions: {
    title: "Generate Questions",
    eyebrow: "Professor workspace",
    description: "Create evidence-grounded assessment questions from the research collection.",
    action: "Generate questions",
  },
  compare: {
    title: "Compare Research",
    eyebrow: "Researcher workspace",
    description: "Compare methods, findings, and limitations across relevant studies.",
    action: "Compare research",
  },
  gaps: {
    title: "Research Gaps",
    eyebrow: "Researcher workspace",
    description: "Identify cautious, evidence-supported opportunities for further investigation.",
    action: "Analyze research gaps",
  },
};

function sanitizeMarkdownForDisplay(value: string) {
  return value.replace(/\\(?=(?:#{1,6}\s|[-*+]\s|\*\*|__|\*|_))/g, "");
}

function renderMarkdown(content: string) {
  return content.split("\n").map((line, index) => {
    const safeLine = sanitizeMarkdownForDisplay(line);
    const trimmedLine = safeLine.trim();
    if (!trimmedLine) return <div key={`space-${index}`} className="h-2" />;

    const headingMatch = safeLine.match(/^\s*(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      return <h3 key={index} className="pt-3 text-lg font-bold">{renderInline(headingMatch[2].trim())}</h3>;
    }
    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      return <li key={index} className="ml-5 list-disc">{renderInline(trimmedLine.slice(2))}</li>;
    }
    return <p key={index}>{renderInline(safeLine)}</p>;
  });
}

function renderInline(text: string) {
  const safeText = sanitizeMarkdownForDisplay(text);
  return safeText.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export default function FeatureWorkspace({
  feature,
  requiredRole,
}: {
  feature: Exclude<Feature, "chat">;
  requiredRole: UserRole;
}) {
  const copy = featureCopy[feature];
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = query.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await askRag(text, requiredRole, feature);
      setAnswer(response.answer);
      setQuery("");
    } catch {
      setError("MedScholar AI could not reach the research service. Check that the backend is running.");
    } finally {
      setSending(false);
    }
  }

  const currentRole = getStoredRole();
  if (currentRole !== requiredRole) return null;

  return (
    <AppShell>
      <div className="min-h-screen px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="border-b border-[var(--line)] pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{copy.eyebrow}</p>
            <h1 className="serif-display mt-2 text-4xl text-[var(--ink)]">{copy.title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">{copy.description}</p>
          </header>
          <form onSubmit={submit} className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7">
            <label className="block text-sm font-semibold text-[var(--ink)]">
              Your question or instruction
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about the indexed medical literature..."
                rows={5}
                className="mt-3 w-full resize-y rounded-xl border border-[var(--line)] bg-[#fafcfa] p-4 text-sm leading-6 outline-none focus:border-[var(--accent)]"
              />
            </label>
            {error && <p className="mt-3 text-sm text-[#b24c43]" role="alert">{error}</p>}
            <button type="submit" disabled={!query.trim() || sending} className="mt-5 rounded-xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50">
              {sending ? "Working..." : copy.action}
            </button>
          </form>
          {answer && (
            <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5 text-sm leading-7 sm:p-7" aria-live="polite">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Evidence-grounded response</p>
              <div className="space-y-2">{renderMarkdown(answer)}</div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}
