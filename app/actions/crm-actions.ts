"use server";

import {
  createLead,
  updateLead,
  deleteLead,
  convertLeadToClient,
  createCompany,
  createDeal,
  updateDealStage,
  createProject,
  createProjectCategory,
  createExpense,
  createVendorBill,
  createInvoice,
  createClientPayment,
  createTask,
  createVendor,
  createActivity,
} from "@/lib/crm-db";
import { revalidatePath } from "next/cache";

export async function createLeadAction(data: any) {
  const result = await createLead(data);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function convertLeadAction(leadId: string) {
  const result = await convertLeadToClient(leadId);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createCompanyAction(data: any) {
  const result = await createCompany(data);
  revalidatePath("/dashboard/companies");
  return result;
}

export async function createDealAction(data: any) {
  const result = await createDeal(data);
  revalidatePath("/dashboard/deals");
  return result;
}

export async function updateDealStageAction(dealId: string, stage: any) {
  const result = await updateDealStage(dealId, stage);
  revalidatePath("/dashboard/deals");
  return result;
}

export async function createProjectAction(data: any) {
  const result = await createProject(data);
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createProjectCategoryAction(data: any) {
  const result = await createProjectCategory(data);
  if (data.project_id) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createExpenseAction(data: any) {
  const result = await createExpense(data);
  if (data.project_id) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }
  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard/profitability");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createVendorBillAction(data: any) {
  const result = await createVendorBill(data);
  revalidatePath("/dashboard/vendor-bills");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createInvoiceAction(data: any, items?: any[]) {
  const result = await createInvoice(data, items);
  if (data.project_id) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createClientPaymentAction(data: any) {
  const result = await createClientPayment(data);
  if (data.project_id) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/profitability");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createTaskAction(data: any) {
  const result = await createTask(data);
  if (data.project_id) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard/audit-logs");
  return result;
}

export async function createVendorAction(data: any) {
  const result = await createVendor(data);
  revalidatePath("/dashboard/vendors");
  return result;
}

export async function createActivityAction(data: any) {
  const result = await createActivity(data);
  revalidatePath("/dashboard/activities");
  revalidatePath("/dashboard/calendar");
  return result;
}
