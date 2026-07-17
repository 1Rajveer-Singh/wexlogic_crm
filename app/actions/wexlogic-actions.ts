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
    .select("*")
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
      service:services(name)
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

  const { error } = await supabase
    .from("clients")
    .insert([{ name, company_name, email }]);

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

  const { error } = await supabase
    .from("revenue")
    .insert([{ client_id, service_id, amount, status }]);

  if (error) {
    console.error("Error inserting revenue:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/revenue");
  revalidatePath("/dashboard");
  return { success: true };
}
