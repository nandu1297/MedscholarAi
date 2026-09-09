"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { getStoredRole, type UserRole } from "../lib/role";

const commonNavItems = [
  { href: "/home", label: "Home", symbol: "⌂" },
  { href: "/ask", label: "Ask", symbol: "↗" },
  { href: "/history", label: "History", symbol: "◷" },
  { href: "/documents", label: "Documents", symbol: "▤" },
  { href: "/about", label: "About", symbol: "ⓘ" },
];
const roleNavItems: Record<UserRole, { href: string; label: string; symbol: string }[]> = {
  student: [],
  professor: [
    { href: "/teaching", label: "Teaching", symbol: "✦" },
    { href: "/generate-questions", label: "Generate Questions", symbol: "?" },
  ],
  researcher: [
    { href: "/compare", label: "Compare Research", symbol: "⇄" },
    { href: "/gaps", label: "Research Gaps", symbol: "⌁" },
  ],
};
const allowedPaths: Record<UserRole, string[]> = {
  student: ["/home", "/ask", "/history", "/documents", "/about"],
  professor: ["/home", "/ask", "/history", "/documents", "/about", "/teaching", "/generate-questions"],
  researcher: ["/home", "/ask", "/history", "/documents", "/about", "/compare", "/gaps"],
};

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role] = useState<UserRole>(() => getStoredRole());

  useEffect(() => {
    const storedRole = getStoredRole();
    if (!allowedPaths[storedRole].includes(pathname)) window.location.replace("/ask");
  }, [pathname]);

  const navItems = [...commonNavItems, ...roleNavItems[role]];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <button
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-lg shadow-sm lg:hidden"
      >
        {menuOpen ? "×" : "☰"}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[var(--line)] bg-[#f8faf8] px-5 py-7 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link
          href="/ask"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 px-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ink)] text-sm text-white">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight">
            MedScholar{" "}
            <span className="font-normal text-[var(--muted)]">AI</span>
          </span>
        </Link>
        <div className="mt-16 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Research workspace
        </div>
        <nav className="mt-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"}`}
              >
                <span className="flex h-6 w-6 items-center justify-center text-base">
                  {item.symbol}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-[var(--line)] bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#42a979]" />
            <span className="text-xs font-bold text-[var(--ink)]">
              Research assistant ready
            </span>
          </div>
          <p className="text-xs leading-5 text-[var(--muted)]">
            Answers are grounded in your indexed medical literature.
          </p>
        </div>
      </aside>
      {menuOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-[var(--ink)]/20 lg:hidden"
        />
      )}
      <main className="min-h-screen lg:pl-[270px]">{children}</main>
    </div>
  );
}
