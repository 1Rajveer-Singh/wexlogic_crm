import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type CrmRole = "admin" | "manager" | "sales" | "employee" | "viewer";

export const VALID_ROLES: readonly CrmRole[] = [
  "admin",
  "manager",
  "sales",
  "employee",
  "viewer",
] as const;

export function isValidRole(role: unknown): role is CrmRole {
  return typeof role === "string" && VALID_ROLES.includes(role as CrmRole);
}
export async function getCurrentUser() {
  return await currentUser();
}
export async function getCurrentUserRole(): Promise<CrmRole | null> {
  const user = await currentUser();
  if (!user) return null;

  const rawRole = user.publicMetadata?.role;
  if (isValidRole(rawRole)) {
    return rawRole;
  }

  // Primary administrator email fallback (only exact primary account)
  const userEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (userEmail === "1.rajveersinghcse@gmail.com") {
    return "admin";
  }

  // If role is uninitialized or unassigned, default safely to "employee" (not admin)
  return "employee";
}

export async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: CrmRole | CrmRole[]) {
  const user = await requireAuth();
  const role = (await getCurrentUserRole()) || "employee";

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!allowed.includes(role)) {
    redirect("/dashboard");
  }

  return { user, role };
}

export async function hasRole(allowedRoles: CrmRole | CrmRole[]): Promise<boolean> {
  const role = await getCurrentUserRole();
  if (!role) return false;
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return allowed.includes(role);
}

// Granular permission helpers
export function canViewUsers(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager";
}

export function canManageUsers(role: CrmRole | null): boolean {
  return role === "admin";
}

export function canMutateSales(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager" || role === "sales";
}

export function canMutateProjects(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager";
}

export function canMutateTasks(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager" || role === "sales" || role === "employee";
}

export function canMutateVendors(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager";
}

export function canMutateInvoices(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager" || role === "sales";
}

export function canLogExpenses(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager" || role === "sales" || role === "employee";
}

export function canManageFinances(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager" || role === "sales";
}

export function canEditProjects(role: CrmRole | null): boolean {
  return role === "admin" || role === "manager";
}

export function canViewAuditLogs(role: CrmRole | null): boolean {
  return role === "admin";
}

export function isReadOnly(role: CrmRole | null): boolean {
  return role === "viewer";
}

export const getUserRole = getCurrentUserRole;

export function getUserDisplayName(user: any): string {
  if (!user) return "Rajveer Singh";

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;

  if (user.username && !user.username.includes("@")) {
    return user.username;
  }

  const rawEmail = user.emailAddresses?.[0]?.emailAddress || (typeof user === "string" ? user : "");
  if (rawEmail) {
    const localPart = rawEmail.split("@")[0].replace(/^[0-9]+[._-]?/, "");
    if (localPart.toLowerCase().includes("rajveer")) {
      return "Rajveer Singh";
    }

    const words = localPart
      .replace(/cse$/i, "")
      .split(/[._-]/)
      .filter(Boolean)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

    if (words.length > 0) {
      return words.join(" ");
    }
  }

  return "Rajveer Singh";
}

