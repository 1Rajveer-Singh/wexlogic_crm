"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole, hasRole, type CrmRole, getUserDisplayName } from "@/utils/auth";
import { logAuditAction } from "@/lib/crm-db";

export type UserRole = CrmRole | null;

export async function getUserRole(): Promise<UserRole> {
  return await getCurrentUserRole();
}

export async function fetchServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data || [];
}

export async function fetchClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      creator:user_roles(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }

  return data || [];
}

export async function fetchRevenue() {
  // Employee role cannot access revenue
  const canAccess = await hasRole(["admin", "manager", "sales"]);
  if (!canAccess) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("client_payments")
    .select(`
      id,
      amount,
      status,
      payment_date,
      payment_method,
      reference_number,
      created_at,
      client:clients(name, company_name),
      project:projects(name)
    `)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching revenue from client_payments:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    amount: p.amount,
    status: p.status === "completed" ? "paid" : p.status,
    created_at: p.payment_date || p.created_at,
    client: p.client,
    service: { name: p.project?.name || "Project Revenue" },
    creator: { full_name: "Admin" },
  }));
}

export async function insertClient(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const canAdd = await hasRole(["admin", "manager", "sales"]);
  if (!canAdd) {
    return { error: "Forbidden: You do not have permission to add clients" };
  }

  const name = formData.get("name") as string;
  const company_name = formData.get("company_name") as string;
  const email = formData.get("email") as string;

  if (!name || !company_name || !email) {
    return { error: "Missing required fields" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .insert([{ name, company_name, email }]);

  if (error) {
    console.error("Error inserting client:", error);
    return { error: error.message };
  }

  await logAuditAction(
    "create",
    "client",
    null,
    null,
    { name, company_name, email },
    {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: getUserDisplayName(user),
    }
  );

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/audit-logs");
  return { success: true };
}

export async function insertRevenue(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated" };

  const canAdd = await hasRole(["admin", "sales"]);
  if (!canAdd) {
    return { error: "Forbidden: You do not have permission to log revenue" };
  }

  const client_id = formData.get("client_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const status = (formData.get("status") as string) || "completed";

  if (!client_id || isNaN(amount)) {
    return { error: "Missing required fields" };
  }

  const supabase = await createClient();
  const { data: insertedPayment, error } = await supabase
    .from("client_payments")
    .insert([{
      client_id,
      amount,
      status: status === "paid" ? "completed" : status,
      payment_method: "bank_transfer",
      recorded_by: user.id
    }])
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting revenue to client_payments:", error);
    return { error: error.message };
  }

  await logAuditAction(
    "create",
    "client_payment",
    insertedPayment?.id || null,
    null,
    { client_id, amount, status: status === "paid" ? "completed" : status },
    {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: getUserDisplayName(user),
    }
  );

  revalidatePath("/dashboard/revenue");
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/audit-logs");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function fetchAdminUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("id, role, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  return data ?? [];
}

export type DashboardStats = {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  paidCount: number;
  pendingCount: number;
  totalClients: number;
  totalServices: number;
  serviceBreakdown: {
    serviceName: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    count: number;
  }[];
  clientBreakdown: {
    clientName: string;
    companyName: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    count: number;
  }[];
  userBreakdown: {
    userId: string | null;
    userName: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
  }[];
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [paymentsRes, clientsRes, servicesRes] = await Promise.all([
    supabase
      .from("client_payments")
      .select("amount, status, client:clients(name, company_name)"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
  ]);

  const payments = paymentsRes.data ?? [];
  const totalClients = clientsRes.count ?? 0;
  const totalServices = servicesRes.count ?? 0;

  let totalRevenue = 0;
  let paidRevenue = 0;
  let pendingRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;

  const clientMap: Record<
    string,
    { companyName: string; totalAmount: number; paidAmount: number; pendingAmount: number; count: number }
  > = {};

  for (const item of payments) {
    const amount = Number(item.amount) || 0;
    const clientData = (item.client as unknown) as { name: string; company_name: string } | null;
    const clientName = clientData?.name ?? "Client";
    const companyName = clientData?.company_name ?? "";
    const isPaid = item.status === "completed" || item.status === "paid";

    totalRevenue += amount;
    if (isPaid) {
      paidRevenue += amount;
      paidCount++;
    } else {
      pendingRevenue += amount;
      pendingCount++;
    }

    if (!clientMap[clientName]) {
      clientMap[clientName] = { companyName, totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 };
    }
    clientMap[clientName].totalAmount += amount;
    clientMap[clientName].count += 1;
    if (isPaid) clientMap[clientName].paidAmount += amount;
    else clientMap[clientName].pendingAmount += amount;
  }

  const clientBreakdown = Object.entries(clientMap)
    .map(([clientName, stats]) => ({ clientName, ...stats }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    paidCount,
    pendingCount,
    totalClients,
    totalServices,
    serviceBreakdown: [],
    clientBreakdown,
    userBreakdown: [],
  };
}
