import AppShell from "../components/AppShell";

const steps = [
  "Medical journals / PDFs",
  "Document processing",
  "Text splitting",
  "Embeddings",
  "Vector database",
  "Relevant retrieval",
  "Language model",
  "Research-grounded answer",
];
const technologies = [
  "Next.js",
  "React",
  "FastAPI",
  "LangChain",
  "Google Gemini",
  "Hugging Face",
  "ChromaDB",
  "MongoDB",
  "RAG",
];
const features = [
  [
    "Research-grounded answers",
    "Answers are generated using information retrieved from available research documents.",
  ],
  [
    "Conversational research",
    "Continue asking follow-up questions naturally as your understanding develops.",
  ],
  [
    "Medical literature library",
    "Browse the research collections available to the assistant.",
  ],
  [
    "Conversation history",
    "Review the questions and answers that shaped your research.",
  ],
  [
    "RAG architecture",
    "Relevant information is retrieved before an answer is generated.",
  ],
  [
    "Focused workspace",
    "A calm interface for exploring knowledge efficiently.",
  ],
];

export default function AboutPage() {
  return (
    <AppShell>
      <div className="min-h-screen px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-2xl border-b border-[var(--line)] pb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              The idea
            </p>
            <h1 className="serif-display mt-3 text-5xl leading-tight text-[var(--ink)]">
              About MedScholar AI
            </h1>
            <p className="mt-6 text-base leading-7 text-[var(--muted)]">
              MedScholar AI is an AI-powered medical research and knowledge
              assistant designed to help students, researchers, professors, and
              academics explore information from medical journals and research
              documents.
            </p>
          </header>
          <section className="grid gap-12 py-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Why it exists
              </p>
              <h2 className="serif-display mt-3 text-3xl">
                Less searching.
                <br />
                More understanding.
              </h2>
            </div>
            <p className="text-sm leading-7 text-[var(--muted)]">
              Medical literature contains an enormous amount of information,
              making it difficult to quickly locate and understand what is
              relevant. MedScholar AI provides a conversational interface over
              that knowledge base using Retrieval-Augmented Generation, so every
              answer begins with the available evidence.
            </p>
          </section>
          <section className="border-t border-[var(--line)] py-14">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Under the hood
              </p>
              <h2 className="serif-display mt-3 text-3xl">
                How MedScholar AI works
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="relative rounded-2xl border border-[var(--line)] bg-white p-4"
                >
                  <span className="text-xs font-bold text-[var(--accent)]">
                    0{index + 1}
                  </span>
                  <p className="mt-8 text-sm font-semibold text-[var(--ink)]">
                    {step}
                  </p>
                  {index < steps.length - 1 && (
                    <span className="absolute -right-2 top-1/2 hidden text-[var(--accent)] lg:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              <strong className="text-[var(--ink)]">
                Retrieval-Augmented Generation
              </strong>{" "}
              means MedScholar AI first retrieves relevant information from the
              medical research documents, then gives that context to the
              language model to generate an answer grounded in the available
              knowledge base.
            </p>
          </section>
          <section className="grid gap-12 border-t border-[var(--line)] py-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Technology
              </p>
              <h2 className="serif-display mt-3 text-3xl">
                A thoughtful stack.
              </h2>
            </div>
            <div className="flex flex-wrap content-start gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>
          <section className="border-t border-[var(--line)] py-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              What you can do
            </p>
            <h2 className="serif-display mt-3 text-3xl">
              Built for real research questions.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([title, description]) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[var(--line)] bg-white p-5"
                >
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
