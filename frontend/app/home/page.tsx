"use client";

import Link from "next/link";
import AppShell from "../components/AppShell";
import { getStoredRole } from "../lib/role";

export default function HomePage() {
  const role = getStoredRole();
  const roleLabel = role[0].toUpperCase() + role.slice(1);

  return (
    <AppShell>
      <div className="grid-paper min-h-screen px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{roleLabel} research desk</p>
          <h1 className="serif-display mt-3 max-w-2xl text-5xl leading-tight text-[var(--ink)]">A clearer way into the literature.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">Ask questions, revisit your evidence, and work from the medical documents indexed in MedScholar AI.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/ask" className="rounded-xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]">Open Ask</Link>
            <Link href="/documents" className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]">Browse documents</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
