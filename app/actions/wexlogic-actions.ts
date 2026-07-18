"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type UserRole = "admin" | "manager" | "viewer" | null;

export async function getUserRole(): Promise<UserRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error("Error fetching user role:", error);
    }
    return null;
  }

  return data?.role as UserRole;
}

export async function fetchServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }

  return data;
}

export async function fetchClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      creator:user_roles!created_by(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients");
  }

  return data;
}

export async function fetchRevenue() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revenue")
    .select(`
      *,
      client:clients(name, company_name),
      service:services(name),
      creator:user_roles!created_by(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching revenue:", error);
    throw new Error("Failed to fetch revenue");
  }

  return data;
}

export async function insertClient(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const company_name = formData.get("company_name") as string;
  const email = formData.get("email") as string;

  if (!name || !company_name || !email) {
    return { error: "Missing required fields" };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("clients")
    .insert([{ name, company_name, email, created_by: user.id }]);

  if (error) {
    console.error("Error inserting client:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function insertRevenue(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const client_id = formData.get("client_id") as string;
  const service_id = formData.get("service_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const status = formData.get("status") as "pending" | "paid";

  if (!client_id || !service_id || isNaN(amount) || !status) {
    return { error: "Missing required fields" };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("revenue")
    .insert([{ client_id, service_id, amount, status, created_by: user.id }]);

  if (error) {
    console.error("Error inserting revenue:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/revenue");
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

  const [revenueRes, clientsRes, servicesRes] = await Promise.all([
    supabase
      .from("revenue")
      .select("amount, status, created_by, service:services(name), client:clients(name, company_name), creator:user_roles!created_by(full_name)"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
  ]);

  const revenue = revenueRes.data ?? [];
  const totalClients = clientsRes.count ?? 0;
  const totalServices = servicesRes.count ?? 0;

  let totalRevenue = 0;
  let paidRevenue = 0;
  let pendingRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;

  const serviceMap: Record<
    string,
    { totalAmount: number; paidAmount: number; pendingAmount: number; count: number }
  > = {};
  
  const clientMap: Record<
    string,
    { companyName: string; totalAmount: number; paidAmount: number; pendingAmount: number; count: number }
  > = {};

  const userMap: Record<
    string,
    { userName: string; totalAmount: number; paidAmount: number; pendingAmount: number }
  > = {};

  for (const item of revenue) {
    const amount = Number(item.amount);
    const serviceName =
      ((item.service as unknown) as { name: string } | null)?.name ?? "Unknown";
      
    const clientData = (item.client as unknown) as { name: string; company_name: string } | null;
    const clientName = clientData?.name ?? "Unknown";
    const companyName = clientData?.company_name ?? "";
    
    const createdBy = item.created_by as string | null;
    const creatorData = (item.creator as unknown) as { full_name: string } | null;
    const userName = creatorData?.full_name ?? "Unknown";

    totalRevenue += amount;
    if (item.status === "paid") {
      paidRevenue += amount;
      paidCount++;
    } else {
      pendingRevenue += amount;
      pendingCount++;
    }

    // Service aggregation
    if (!serviceMap[serviceName]) {
      serviceMap[serviceName] = { totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 };
    }
    serviceMap[serviceName].totalAmount += amount;
    serviceMap[serviceName].count += 1;
    if (item.status === "paid") serviceMap[serviceName].paidAmount += amount;
    else serviceMap[serviceName].pendingAmount += amount;
    
    // Client aggregation
    if (!clientMap[clientName]) {
      clientMap[clientName] = { companyName, totalAmount: 0, paidAmount: 0, pendingAmount: 0, count: 0 };
    }
    clientMap[clientName].totalAmount += amount;
    clientMap[clientName].count += 1;
    if (item.status === "paid") clientMap[clientName].paidAmount += amount;
    else clientMap[clientName].pendingAmount += amount;
    
    // User aggregation
    const userKey = createdBy ?? "unknown";
    if (!userMap[userKey]) {
      userMap[userKey] = { userName, totalAmount: 0, paidAmount: 0, pendingAmount: 0 };
    }
    userMap[userKey].totalAmount += amount;
    if (item.status === "paid") userMap[userKey].paidAmount += amount;
    else userMap[userKey].pendingAmount += amount;
  }

  const serviceBreakdown = Object.entries(serviceMap)
    .map(([serviceName, stats]) => ({ serviceName, ...stats }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
    
  const clientBreakdown = Object.entries(clientMap)
    .map(([clientName, stats]) => ({ clientName, ...stats }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
    
  const userBreakdown = Object.entries(userMap)
    .map(([userId, stats]) => ({ userId: userId === "unknown" ? null : userId, ...stats }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    paidCount,
    pendingCount,
    totalClients,
    totalServices,
    serviceBreakdown,
    clientBreakdown,
    userBreakdown,
  };
}
