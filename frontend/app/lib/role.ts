export type UserRole = "student" | "professor" | "researcher";

export const ROLE_STORAGE_KEY = "medscholar_role";

export function isUserRole(value: string | null): value is UserRole {
  return value === "student" || value === "professor" || value === "researcher";
}

export function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "student";
  const storedRole = window.sessionStorage.getItem(ROLE_STORAGE_KEY);
  return isUserRole(storedRole) ? storedRole : "student";
}
