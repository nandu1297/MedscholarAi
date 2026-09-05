"use client";

import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const documents = [
  ["Cardiology", "Cardiology.pdf"],
  ["Diabetology", "diabetology.pdf"],
  ["Gastrology", "gastrology.pdf"],
  ["Hematology", "hematology.pdf"],
  ["Infectious Diseases", "InfectiousDiseases.pdf"],
  ["Internal Medicine", "internalmed.pdf"],
  ["Mental Health", "MentalHealth.pdf"],
  ["Neoplasms & Oncology", "Neoplasn_oncology.pdf"],
  ["Nephrology", "Nephrology.pdf"],
  ["Nervous System Disease", "nervoussystem disease.pdf"],
  ["Pediatrics", "pediatrics.pdf"],
  ["Pulmonology", "pulmonology.pdf"],
] as const;

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      documents.filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  return (
    <AppShell>
      <div className="min-h-screen px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Knowledge base
              </p>
              <h1 className="serif-display mt-2 text-4xl text-[var(--ink)]">
                Medical research documents
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
                Explore the journals and research documents powering MedScholar
                AI.
              </p>
            </div>
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Search research documents</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents..."
                className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>
          </header>
          {filtered.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(([name, filename]) => (
                <article
                  key={filename}
                  className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3ed] text-xs font-bold text-[#bd6b4b]">
                      PDF
                    </span>
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                      Indexed
                    </span>
                  </div>
                  <h2 className="mt-8 text-sm font-bold text-[var(--ink)]">
                    {name}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Medical research collection
                  </p>
                  <div className="mt-5 flex gap-2 border-t border-[var(--line)] pt-4">
                    <a
                      href={`${API_URL}/documents/${encodeURIComponent(filename)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-[var(--ink)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent)]"
                    >
                      Open PDF
                    </a>
                    <a
                      href={`${API_URL}/document-download/${encodeURIComponent(filename)}`}
                      className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] px-6 py-20 text-center">
              <h2 className="serif-display text-3xl">
                No research documents found.
              </h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Try a different search term.
              </p>
            </div>
          )}
          <p className="mt-8 text-xs leading-5 text-[var(--muted)]">
            These PDFs are served from the local medical literature collection
            used by the RAG pipeline.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
