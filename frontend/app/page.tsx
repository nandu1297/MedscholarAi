"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_STORAGE_KEY, type UserRole } from "./lib/role";

const technologies = [
  "Next.js",
  "React",
  "FastAPI",
  "Python",
  "LangChain",
  "Hugging Face embeddings",
  "ChromaDB",
  "Gemini 3.5 Flash",
  "MongoDB",
  "RAG",
  "PubMed literature",
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password to continue.");
      return;
    }
    sessionStorage.setItem("medscholar_user", username.trim());
    sessionStorage.setItem(ROLE_STORAGE_KEY, role);
    router.push("/ask");
  }

  return (
    <div className="grid-paper min-h-screen overflow-hidden px-5 py-5 sm:px-8 sm:py-8">
      <main className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1320px] overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] shadow-[0_24px_80px_rgba(23,33,31,0.08)] lg:grid-cols-[1fr_420px]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#edf5f1] p-8 sm:p-12 lg:p-16">
          <div className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ink)] text-sm text-white">
              M
            </span>{" "}
            MedScholar{" "}
            <span className="font-normal text-[var(--muted)]">AI</span>
          </div>
          <div className="relative z-10 my-16 max-w-2xl lg:my-0">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Medical AI research assistant
            </p>
            <h1 className="serif-display max-w-xl text-5xl leading-[0.98] text-[var(--ink)] sm:text-7xl">
              Explore medical knowledge.
              <br />
              <em className="text-[var(--accent)]">Ask better questions.</em>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-[var(--muted)] sm:text-lg">
              A research-grounded assistant for students, researchers, and
              academics exploring medical journals and scientific literature.
            </p>
            <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2">
                Research-grounded
              </span>
              <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2">
                Natural language
              </span>
              <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-2">
                RAG-powered
              </span>
            </div>
            <div className="mt-10 max-w-lg">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Built with
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-[var(--muted)]">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="after:ml-3 after:text-[var(--accent)] after:content-['·'] last:after:content-none"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="relative z-10 text-xs text-[var(--muted)]">
            Built for the curious mind behind the next breakthrough.
          </p>
          <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-[var(--accent)]/15" />
        </section>
        <section className="flex items-center bg-white p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
            <div className="mb-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Your research desk
              </p>
              <h2 className="serif-display text-4xl text-[var(--ink)]">
                Welcome to
                <br />
                MedScholar AI.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Step into a focused space for asking, finding, and
                understanding.
              </p>
            </div>
            <label className="mb-5 block text-sm font-semibold text-[var(--ink)]">
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-[#fafcfa] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                placeholder="e.g. alex.researcher"
              />
            </label>
            <label className="block text-sm font-semibold text-[var(--ink)]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-[#fafcfa] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                placeholder="Enter your password"
              />
            </label>
            <label className="mt-5 block text-sm font-semibold text-[var(--ink)]">
              I am joining as
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-[#fafcfa] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
                <option value="researcher">Researcher</option>
              </select>
            </label>
            {error && (
              <p className="mt-3 text-sm text-[#b24c43]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[var(--ink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              Start exploring <span aria-hidden="true">-&gt;</span>
            </button>
            <p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">
              Frontend demo access. Your conversations stay within this research
              workspace.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
