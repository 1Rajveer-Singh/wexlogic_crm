import {
  fetchDashboardStats,
  fetchAdminUsers,
  getUserRole,
} from "@/app/actions/wexlogic-actions";
import { Coins, CheckCircle, Clock, Users, Briefcase, PieChart, TrendingUp } from "lucide-react";
import { PieChart as PieChartComponent } from "@/app/dashboard/components/PieChart";
import { StatsBar } from "@/app/dashboard/components/StatsBar";

const PARTNER_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default async function DashboardPage() {
  const [stats, admins, role] = await Promise.all([
    fetchDashboardStats(),
    fetchAdminUsers(),
    getUserRole(),
  ]);

  const isAdmin = role === "admin";

  // Build pie chart data for partners (equal share of collected revenue)
  const partnerPieData = admins.map((admin, i) => ({
    name: (admin as any).full_name ?? `Admin ${i + 1}`,
    value: admins.length > 0 ? stats.paidRevenue / admins.length : 0,
    color: PARTNER_COLORS[i] ?? "#94a3b8",
  }));

  // Build pie chart data for service breakdown
  const servicePieData = stats.serviceBreakdown.slice(0, 6).map((s, i) => ({
    name: s.serviceName,
    value: s.totalAmount,
    color: [
      "#6366f1",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#3b82f6",
      "#8b5cf6",
    ][i] ?? "#94a3b8",
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Welcome back. Here is the latest summary of your operations.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Total Pipeline
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {formatINR(stats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-blue-900/30 p-3 ring-1 ring-blue-500/20">
              <Coins className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Collected
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {formatINR(stats.paidRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-emerald-900/30 p-3 ring-1 ring-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Pending
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {formatINR(stats.pendingRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-amber-900/30 p-3 ring-1 ring-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Clients / Services
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {stats.totalClients}{" "}
                <span className="text-zinc-500 text-base font-normal">/</span>{" "}
                {stats.totalServices}
              </p>
            </div>
            <div className="rounded-full bg-violet-900/30 p-3 ring-1 ring-violet-500/20">
              <Users className="h-5 w-5 text-violet-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Partners Distribution (admin only) + Paid/Unpaid Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Partners Pie Chart — admin only */}
        {isAdmin && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Partners Distribution
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Equal share of collected revenue among core partners
            </p>

            {admins.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
                No admin users found. Set{" "}
                <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs">
                  full_name
                </code>{" "}
                in user_roles.
              </div>
            ) : (
              <>
                <PieChartComponent
                  data={partnerPieData}
                  formatValue={formatINR}
                />
                <div className="mt-5 divide-y divide-zinc-800">
                  {partnerPieData.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-sm text-slate-300">{p.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-100">
                        {formatINR(p.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Paid / Unpaid Stats */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Payment Status
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mb-6">
            Breakdown of paid vs unpaid invoices by amount
          </p>
          <StatsBar
            paidAmount={stats.paidRevenue}
            pendingAmount={stats.pendingRevenue}
            paidCount={stats.paidCount}
            pendingCount={stats.pendingCount}
            formatValue={formatINR}
          />

          {/* Quick info strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Clients
              </p>
              <p className="text-xl font-bold text-slate-100 mt-1">
                {stats.totalClients}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Services
              </p>
              <p className="text-xl font-bold text-slate-100 mt-1">
                {stats.totalServices}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Service-wise Breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Service-wise Revenue
            </h3>
          </div>
          <p className="text-xs text-zinc-500">All services performance</p>
        </div>

        {stats.serviceBreakdown.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500">
            No service data yet. Log payments to see breakdown.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {stats.serviceBreakdown.map((service, i) => {
              const paidPct =
                service.totalAmount > 0
                  ? (service.paidAmount / service.totalAmount) * 100
                  : 0;
              const totalShare =
                stats.totalRevenue > 0
                  ? (service.totalAmount / stats.totalRevenue) * 100
                  : 0;

              return (
                <div
                  key={service.serviceName}
                  className="p-5 hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 mt-1"
                        style={{
                          backgroundColor: [
                            "#6366f1",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#3b82f6",
                            "#8b5cf6",
                          ][i % 6],
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {service.serviceName}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {service.count} invoice{service.count !== 1 ? "s" : ""}{" "}
                          &middot; {totalShare.toFixed(1)}% of total pipeline
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-100">
                        {formatINR(service.totalAmount)}
                      </p>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <span className="text-xs text-emerald-400">
                          {formatINR(service.paidAmount)} paid
                        </span>
                        {service.pendingAmount > 0 && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className="text-xs text-amber-400">
                              {formatINR(service.pendingAmount)} due
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mini progress bar per service */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${paidPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-600">0%</span>
                    <span className="text-[10px] text-emerald-600">
                      {paidPct.toFixed(0)}% collected
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Service pie chart */}
        {stats.serviceBreakdown.length > 0 && (
          <div className="p-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-5">
              Revenue share by service
            </p>
            <PieChartComponent data={servicePieData} formatValue={formatINR} />
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
        <p className="text-sm text-zinc-400 leading-relaxed">
          You are logged in as a{" "}
          <strong className="text-slate-200 capitalize">
            {role ?? "Viewer"}
          </strong>
          . Navigate to{" "}
          <span className="text-blue-400">Clients</span> and{" "}
          <span className="text-blue-400">Revenue</span> to manage your data.
          {!isAdmin && (
            <span className="text-zinc-500 ml-1">
              Some actions are restricted to admins only.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
