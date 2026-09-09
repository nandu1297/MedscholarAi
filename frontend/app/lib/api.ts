import type { UserRole } from "./role";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Feature = "chat" | "teaching" | "generate_questions" | "compare" | "gaps";

export type Citation = { source: string; page: string | number };

export type RagResponse = {
  answer: string;
  citations?: Citation[];
};

export async function askRag(
  query: string,
  role: UserRole,
  feature: Feature,
): Promise<RagResponse> {
  const response = await fetch(`${API_URL}/ask_rag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, user_role: role, feature }),
  });

  if (!response.ok) {
    throw new Error(`Question request failed (${response.status})`);
  }

  return (await response.json()) as RagResponse;
}
