// ==============================================================================
// WEXLOGIC CRM — Financial Calculation Engine
// Safe decimal handling & standard financial formulas
// ==============================================================================

export type BudgetHealthStatus = "healthy" | "warning" | "at_limit" | "over_budget";

export const formatINR = (amount: number | string | null | undefined): string => {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

export const roundCurrency = (amount: number): number => {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};

export const calcGrossProfit = (revenue: number, actualCost: number): number => {
  return roundCurrency(revenue - actualCost);
};

export const calcGrossMarginPct = (revenue: number, actualCost: number): number => {
  if (revenue <= 0) return 0;
  const profit = revenue - actualCost;
  return roundCurrency((profit / revenue) * 100);
};

export const calcOutstandingBalance = (totalInvoiced: number, amountPaid: number): number => {
  return roundCurrency(Math.max(0, totalInvoiced - amountPaid));
};

export const calcUtilizationPct = (actualCost: number, budget: number): number => {
  if (budget <= 0) return actualCost > 0 ? 100 : 0;
  return roundCurrency((actualCost / budget) * 100);
};

export const getBudgetHealth = (actualCost: number, budget: number): BudgetHealthStatus => {
  if (budget <= 0) return actualCost > 0 ? "over_budget" : "healthy";
  if (actualCost > budget) return "over_budget";
  if (actualCost === budget) return "at_limit";
  if (actualCost >= budget * 0.8) return "warning";
  return "healthy";
};

export const getBudgetHealthBadge = (status: BudgetHealthStatus) => {
  switch (status) {
    case "healthy":
      return {
        label: "Healthy",
        bg: "bg-emerald-100",
        text: "text-emerald-900",
        border: "border-[#34D399]",
      };
    case "warning":
      return {
        label: "Warning",
        bg: "bg-amber-100",
        text: "text-amber-950",
        border: "border-[#FBBF24]",
      };
    case "at_limit":
      return {
        label: "At Limit",
        bg: "bg-orange-100",
        text: "text-orange-950",
        border: "border-orange-400",
      };
    case "over_budget":
      return {
        label: "OVER BUDGET",
        bg: "bg-rose-100",
        text: "text-rose-950",
        border: "border-rose-400",
      };
  }
};
