import { getLeads } from "@/lib/crm-db";
import { getCurrentUserRole, canMutateSales } from "@/utils/auth";
import { formatINR } from "@/utils/finance-calc";
import { LeadModal } from "./lead-modal";
import { ConvertButton } from "./convert-button";
import { UserPlus, Filter, Download } from "lucide-react";

export default async function LeadsPage() {
  const [leads, role] = await Promise.all([getLeads(), getCurrentUserRole()]);
  const canMutate = canMutateSales(role);

  const totalValue = leads.reduce((sum, l) => sum + (Number(l.lead_value) || 0), 0);
  const wonCount = leads.filter((l) => l.status === "won").length;

  const STATUS_BADGES: Record<string, { bg: string; text: string; border: string }> = {
    new: { bg: "bg-blue-100", text: "text-blue-950", border: "border-blue-400" },
    contacted: { bg: "bg-indigo-100", text: "text-indigo-950", border: "border-indigo-400" },
    qualified: { bg: "bg-purple-100", text: "text-purple-950", border: "border-purple-400" },
    proposal: { bg: "bg-amber-100", text: "text-amber-950", border: "border-amber-400" },
    negotiation: { bg: "bg-orange-100", text: "text-orange-950", border: "border-orange-400" },
    won: { bg: "bg-emerald-100", text: "text-emerald-950", border: "border-[#34D399]" },
    lost: { bg: "bg-rose-100", text: "text-rose-950", border: "border-rose-400" },
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-sky-100 border-2 border-[#1E293B]">
              <UserPlus className="h-4 w-4 text-sky-700" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1E293B]">
              Leads Management
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
            Track inquiries, qualify prospects, and convert opportunities into active WexLogic clients.
          </p>
        </div>
        {canMutate && (
          <div className="flex items-center gap-3">
            <LeadModal />
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Leads</p>
          <p className="text-2xl font-black text-[#1E293B] mt-0.5">{leads.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Pipeline Potential</p>
          <p className="text-2xl font-black text-[#1E293B] mt-0.5">{formatINR(totalValue)}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Won / Converted</p>
          <p className="text-2xl font-black text-emerald-800 mt-0.5">{wonCount}</p>
        </div>
        <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Conversion Rate</p>
          <p className="text-2xl font-black text-[#8B5CF6] mt-0.5">
            {leads.length > 0 ? ((wonCount / leads.length) * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#1E293B]/10">
            <thead className="bg-[#FFFDF5] border-b-2 border-[#1E293B]">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-black uppercase tracking-wider text-[#1E293B] sm:pl-6">
                  Lead / Contact
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Company
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Source
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Potential Value
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Status
                </th>
                <th className="px-3 py-3.5 text-right text-xs font-black uppercase tracking-wider text-[#1E293B] pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1E293B]/10 bg-white">
              {leads.map((lead) => {
                const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.new;
                return (
                  <tr key={lead.id} className="hover:bg-violet-50/40 transition-colors">
                    <td className="whitespace-nowrap py-3.5 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-sky-100 border-2 border-[#1E293B] flex items-center justify-center text-xs font-black text-sky-800 shrink-0">
                          {lead.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1E293B]">{lead.full_name}</div>
                          <div className="text-xs text-slate-500 font-medium">
                            {lead.phone || lead.email || "No contact"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold text-slate-700">
                      {lead.company_name ? (
                        <span className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-0.5">
                          {lead.company_name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-xs font-bold text-slate-600">
                      {lead.source}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-xs font-black text-[#1E293B]">
                      {formatINR(lead.lead_value)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-xs">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black border uppercase tracking-wider shadow-pop-sm ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-right pr-6">
                      {lead.status === "won" ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-300">
                          ✓ Converted
                        </span>
                      ) : canMutate ? (
                        <ConvertButton leadId={lead.id} leadName={lead.full_name} />
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-400">
                    {canMutate
                      ? 'No leads registered yet. Click "Add Lead" to start tracking.'
                      : "No leads registered yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
