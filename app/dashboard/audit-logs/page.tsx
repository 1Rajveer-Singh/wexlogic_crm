import { getAuditLogs } from "@/lib/crm-db";
import { requireRole } from "@/utils/auth";
import { AuditTableClient } from "./audit-table-client";
import { History, Shield } from "lucide-react";

export const metadata = {
  title: "Audit Logs | WexLogic CRM",
  description: "Internal security and compliance activity trace for WexLogic operations.",
};

export default async function AuditLogsPage() {
  await requireRole(["admin"]);
  const logs = await getAuditLogs(200);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-slate-100 border-2 border-[#1E293B]">
              <History className="h-4 w-4 text-slate-700" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#1E293B] font-display">
              System Audit Logs
            </h2>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Immutable trace of system mutations, deletions, financial transactions, and lead conversions.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border-2 border-[#1E293B] rounded-full px-4 py-1.5 shadow-pop-sm">
          <Shield className="h-4 w-4 text-pink-600" />
          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Admin Access Only
          </span>
        </div>
      </div>

      {/* Interactive Audit Table */}
      <AuditTableClient logs={logs} />
    </div>
  );
}
