"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/utils/finance-calc";
import { updateDealStageAction } from "@/app/actions/crm-actions";
import { DealModal, DeleteDealButton } from "./deal-modal";
import type { Deal, DealStage, Client, Service } from "@/types/crm";

const STAGES: { id: DealStage; label: string; bg: string; border: string }[] = [
  { id: "new", label: "New", bg: "bg-blue-50", border: "border-blue-300" },
  { id: "qualified", label: "Qualified", bg: "bg-indigo-50", border: "border-indigo-300" },
  { id: "proposal", label: "Proposal", bg: "bg-purple-50", border: "border-purple-300" },
  { id: "negotiation", label: "Negotiation", bg: "bg-amber-50", border: "border-amber-300" },
  { id: "won", label: "Won", bg: "bg-emerald-50", border: "border-[#34D399]" },
  { id: "lost", label: "Lost", bg: "bg-rose-50", border: "border-rose-300" },
];

export function DealsKanban({
  deals: initialDeals,
  clients = [],
  services = [],
  readOnly = false,
}: {
  deals: Deal[];
  clients?: Client[];
  services?: Service[];
  readOnly?: boolean;
}) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const router = useRouter();

  const handleStageChange = async (dealId: string, newStage: DealStage) => {
    if (readOnly) return;
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
    await updateDealStageAction(dealId, newStage);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 overflow-x-auto">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage.id);
        const stageTotal = stageDeals.reduce((sum, d) => sum + d.estimated_value, 0);

        return (
          <div
            key={stage.id}
            className={`rounded-2xl border-2 border-[#1E293B] ${stage.bg} p-3 flex flex-col shadow-pop-sm min-w-[200px]`}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E293B]/10">
              <span className="font-black text-xs uppercase text-[#1E293B]">{stage.label}</span>
              <span className="rounded-full bg-white border border-[#1E293B] px-1.5 py-0.2 text-[10px] font-bold">
                {stageDeals.length}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-1 mb-3">
              {formatINR(stageTotal)}
            </p>

            {/* Deal Cards */}
            <div className="space-y-2.5 flex-1">
              {stageDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-xl border-2 border-[#1E293B] bg-white p-3 shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#1E293B] truncate flex-1">{deal.deal_name}</h4>
                    {!readOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        <DealModal clients={clients} services={services} initialData={deal} />
                        <DeleteDealButton id={deal.id} name={deal.deal_name} />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                    {deal.client?.name || "Client"}
                  </p>
                  <p className="text-xs font-black text-[#8B5CF6] mt-1.5">
                    {formatINR(deal.estimated_value)}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">
                      {deal.probability}% Prob.
                    </span>
                    {readOnly ? (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {STAGES.find((s) => s.id === deal.stage)?.label || deal.stage}
                      </span>
                    ) : (
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageChange(deal.id, e.target.value as DealStage)}
                        className="text-[10px] font-bold border border-[#1E293B] rounded-lg p-0.5 bg-slate-50 text-[#1E293B]"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}

              {stageDeals.length === 0 && (
                <div className="py-6 text-center text-[11px] font-medium text-slate-400">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
