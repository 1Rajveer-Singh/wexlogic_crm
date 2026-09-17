import { getVendors } from "@/lib/crm-db";
import { getCurrentUserRole, canMutateVendors } from "@/utils/auth";
import { formatINR } from "@/utils/finance-calc";
import { VendorModal } from "./vendor-modal";
import { Truck } from "lucide-react";

export default async function VendorsPage() {
  const [vendors, role] = await Promise.all([getVendors(), getCurrentUserRole()]);
  const canAdd = canMutateVendors(role);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-amber-100 border-2 border-[#1E293B]">
              <Truck className="h-4 w-4 text-amber-700" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1E293B]">
              Vendors & Subcontractors
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
            Supplier directory, trade categories, total billed liabilities, and pending payment balances.
          </p>
        </div>
        {canAdd && <VendorModal />}
      </div>

      {/* Vendors Table */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#1E293B]/10">
            <thead className="bg-[#FFFDF5] border-b-2 border-[#1E293B]">
              <tr>
                <th className="py-4 pl-4 pr-3 text-left text-xs font-black uppercase tracking-wider text-[#1E293B] sm:pl-6">
                  Vendor Name
                </th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Category
                </th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Phone / Email
                </th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Total Billed
                </th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Paid
                </th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]">
                  Pending Balance
                </th>
                <th className="px-3 py-4 text-right text-xs font-black uppercase tracking-wider text-[#1E293B] pr-6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1E293B]/10 bg-white">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-[#1E293B] sm:pl-6">
                    <div>{v.name}</div>
                    {v.company_name && <span className="text-xs text-slate-400 font-normal">{v.company_name}</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-bold text-slate-700">
                    <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-900">
                      {v.category || "General"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-slate-600">
                    <div>{v.phone || "—"}</div>
                    {v.email && <div className="text-[10px] text-slate-400">{v.email}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-black text-[#1E293B]">
                    {formatINR(v.total_bills || 0)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-bold text-emerald-800">
                    {formatINR(v.total_paid || 0)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-bold text-rose-700">
                    {formatINR(v.total_pending || 0)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right pr-6">
                    <span className="rounded-full bg-emerald-100 border border-[#34D399] px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-950">
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-medium text-slate-400">
                    {canAdd ? 'No vendors registered. Click "Add Vendor" to record one.' : "No vendors registered."}
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
