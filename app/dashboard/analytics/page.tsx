import {
  getProjects,
  getClients,
  getLeads,
  getDeals,
  getExpenses,
  getClientPayments,
} from "@/lib/crm-db";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Coins,
  Receipt,
  CheckCircle2,
  FolderKanban,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Reports & Analytics | WexLogic CRM",
  description: "Financial performance, category expense distribution, and pipeline analytics.",
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default async function AnalyticsPage() {
  const [projects, clients, leads, deals, expenses, payments] = await Promise.all([
    getProjects(),
    getClients(),
    getLeads(),
    getDeals(),
    getExpenses(),
    getClientPayments(),
  ]);

  // 1. Overall Financials
  const totalPipeline = projects.reduce((sum, p) => sum + p.project_value, 0);
  const totalCosts = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalCollected = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalGrossProfit = totalPipeline - totalCosts;
  const grossMarginPct = totalPipeline > 0 ? Math.round((totalGrossProfit / totalPipeline) * 100) : 0;

  // 2. Expenses grouped by Category
  const categoryMap: Record<string, number> = {};
  for (const exp of expenses) {
    const catName = exp.category?.name || "General & Operations";
    categoryMap[catName] = (categoryMap[catName] || 0) + Number(exp.amount);
  }
  const categoryExpenses = Object.entries(categoryMap)
    .map(([name, amount]) => ({
      name,
      amount,
      pct: totalCosts > 0 ? Math.round((amount / totalCosts) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 3. Lead Funnel
  const leadStatuses = ["new", "contacted", "qualified", "converted", "lost"] as const;
  const leadCounts = leadStatuses.map((st) => ({
    status: st,
    count: leads.filter((l) => l.status === st).length,
    pct: leads.length > 0 ? Math.round((leads.filter((l) => l.status === st).length / leads.length) * 100) : 0,
  }));

  // 4. Client Concentration (Top Clients by Value)
  const clientValues = clients.map((c) => {
    const clientProjects = projects.filter((p) => p.client_id === c.id);
    const contractValue = clientProjects.reduce((sum, p) => sum + p.project_value, 0);
    const clientPayments = payments.filter((p) => p.client_id === c.id && p.status === "completed");
    const collected = clientPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return {
      client: c,
      projectsCount: clientProjects.length,
      contractValue,
      collected,
    };
  }).sort((a, b) => b.contractValue - a.contractValue);

  // 5. Project Profitability Rankings
  const projectRankings = projects.map((p) => {
    const cost = p.totalActualCost || 0;
    const profit = p.project_value - cost;
    const margin = p.project_value > 0 ? Math.round((profit / p.project_value) * 100) : 0;
    return {
      ...p,
      profit,
      margin,
    };
  }).sort((a, b) => b.margin - a.margin);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-violet-100 border-2 border-[#1E293B]">
              <BarChart3 className="h-4 w-4 text-violet-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#1E293B] font-display">
              Reports & Business Analytics
            </h2>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Comprehensive financial breakdown, expense distribution, lead conversion, and project margin rankings.
          </p>
        </div>
      </div>

      {/* High-Level Financial Pulse Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Contract Value</p>
          <p className="mt-2 text-2xl font-black text-[#1E293B]">{formatINR(totalPipeline)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">{projects.length} Total Projects</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Collected Cash</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">{formatINR(totalCollected)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">
            {totalPipeline > 0 ? Math.round((totalCollected / totalPipeline) * 100) : 0}% Realized
          </p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Expenses</p>
          <p className="mt-2 text-2xl font-black text-rose-700">{formatINR(totalCosts)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">{expenses.length} Expense Entries</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Net Gross Profit</p>
            <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
              {grossMarginPct}%
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-[#1E293B]">{formatINR(totalGrossProfit)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">Revenue minus Direct Costs</p>
        </div>
      </div>

      {/* Row 2: Expense Category Breakdown + Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Cost Distribution */}
        <div className="p-6 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-rose-600" />
              <h3 className="text-lg font-black text-[#1E293B]">Cost by Category</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Across all projects</span>
          </div>

          {categoryExpenses.length === 0 ? (
            <p className="text-sm font-semibold text-slate-400 py-6 text-center">No project expenses logged yet.</p>
          ) : (
            <div className="space-y-3.5">
              {categoryExpenses.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black text-[#1E293B]">
                    <span>{cat.name}</span>
                    <span>{formatINR(cat.amount)} ({cat.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.max(4, cat.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Pipeline Conversion Funnel */}
        <div className="p-6 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              <h3 className="text-lg font-black text-[#1E293B]">Lead Pipeline Funnel</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">{leads.length} Total Leads</span>
          </div>

          <div className="space-y-3.5">
            {leadCounts.map((st) => (
              <div key={st.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="capitalize text-[#1E293B]">{st.status}</span>
                  <span className="text-slate-600">{st.count} leads ({st.pct}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      st.status === "converted"
                        ? "bg-emerald-500"
                        : st.status === "lost"
                        ? "bg-slate-400"
                        : "bg-sky-500"
                    }`}
                    style={{ width: `${Math.max(3, st.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Client Value Leaderboard + Project Margin Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Clients by Contract Value */}
        <div className="p-6 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-black text-[#1E293B]">Top Clients by Revenue</h3>
            </div>
            <Link href="/dashboard/clients" className="text-xs font-black text-amber-600 hover:text-amber-800">
              Clients Hub &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b-2 border-[#1E293B] text-[11px] font-black uppercase text-slate-500">
                  <th className="py-2">Client</th>
                  <th className="py-2 text-center">Projects</th>
                  <th className="py-2 text-right">Contract</th>
                  <th className="py-2 text-right">Collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientValues.slice(0, 5).map((cv) => (
                  <tr key={cv.client.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-black text-[#1E293B]">
                      <Link href={`/dashboard/clients/${cv.client.id}`} className="hover:underline">
                        {cv.client.name}
                      </Link>
                      {(cv.client.company_name || cv.client.company?.name) && (
                        <div className="text-[10px] text-slate-400">
                          {cv.client.company_name || cv.client.company?.name}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-bold text-slate-600">{cv.projectsCount}</td>
                    <td className="py-2.5 text-right font-black text-[#1E293B]">{formatINR(cv.contractValue)}</td>
                    <td className="py-2.5 text-right font-black text-emerald-700">{formatINR(cv.collected)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Margin Rankings */}
        <div className="p-6 rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E293B]/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-black text-[#1E293B]">Project Margin Rankings</h3>
            </div>
            <Link href="/dashboard/profitability" className="text-xs font-black text-emerald-600 hover:text-emerald-800">
              Full Report &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b-2 border-[#1E293B] text-[11px] font-black uppercase text-slate-500">
                  <th className="py-2">Project</th>
                  <th className="py-2 text-right">Contract</th>
                  <th className="py-2 text-right">Actual Cost</th>
                  <th className="py-2 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectRankings.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-black text-[#1E293B]">
                      <Link href={`/dashboard/projects/${p.id}`} className="hover:underline">
                        {p.name}
                      </Link>
                      <div className="text-[10px] text-slate-400">{p.client?.name}</div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-700">{formatINR(p.project_value)}</td>
                    <td className="py-2.5 text-right font-bold text-rose-600">{formatINR(p.totalActualCost || 0)}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded font-black text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {p.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
