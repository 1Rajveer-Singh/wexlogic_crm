import { getDeals, getClients, getServices } from "@/lib/crm-db";
import { getCurrentUserRole, canMutateSales } from "@/utils/auth";
import { formatINR } from "@/utils/finance-calc";
import { DealModal } from "./deal-modal";
import { DealsKanban } from "./deals-kanban";
import { GitPullRequest } from "lucide-react";

export default async function DealsPage() {
  const [deals, clients, services, role] = await Promise.all([
    getDeals(),
    getClients(),
    getServices(),
    getCurrentUserRole(),
  ]);

  const canMutate = canMutateSales(role);

  const totalPipeline = deals.reduce((sum, d) => sum + d.estimated_value, 0);
  const weightedPipeline = deals.reduce((sum, d) => sum + d.estimated_value * (d.probability / 100), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-amber-100 border-2 border-[#1E293B]">
              <GitPullRequest className="h-4 w-4 text-amber-700" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1E293B]">
              Deals Pipeline
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
            Track prospective opportunities, move stages on the Kanban board, and forecast revenue.
          </p>
        </div>
        {canMutate && <DealModal clients={clients} services={services} />}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase text-slate-500">Active Opportunities</p>
          <p className="text-2xl font-black text-[#1E293B] mt-0.5">{deals.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase text-slate-500">Total Pipeline Value</p>
          <p className="text-2xl font-black text-[#1E293B] mt-0.5">{formatINR(totalPipeline)}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase text-slate-500">Weighted Forecast</p>
          <p className="text-2xl font-black text-[#8B5CF6] mt-0.5">{formatINR(weightedPipeline)}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase text-slate-500">Won Opportunities</p>
          <p className="text-2xl font-black text-emerald-800 mt-0.5">
            {deals.filter((d) => d.stage === "won").length}
          </p>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Kanban Stages
          </span>
          {canMutate && (
            <span className="text-xs font-semibold text-slate-400">
              Select stage on any card to move it
            </span>
          )}
        </div>
        <DealsKanban deals={deals} readOnly={!canMutate} />
      </div>
    </div>
  );
}
