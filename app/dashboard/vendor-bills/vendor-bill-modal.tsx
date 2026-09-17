"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, X } from "lucide-react";
import { createVendorBillAction } from "@/app/actions/crm-actions";
import type { Vendor, Project } from "@/types/crm";

export function VendorBillModal({ vendors, projects }: { vendors: Vendor[]; projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await createVendorBillAction({
      vendor_id: form.get("vendor_id") as string,
      project_id: (form.get("project_id") as string) || null,
      bill_number: form.get("bill_number") as string,
      bill_date: (form.get("bill_date") as string) || new Date().toISOString().split("T")[0],
      due_date: (form.get("due_date") as string) || null,
      amount: Number(form.get("amount")) || 0,
      payment_status: "pending",
      notes: form.get("notes") as string,
    });

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1E293B] btn-primary px-4 py-2 text-xs font-black shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
      >
        <FileSpreadsheet className="h-4 w-4" strokeWidth={2.5} />
        Log Vendor Bill
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white border-2 border-[#1E293B] p-6 text-left shadow-pop-lg">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B]/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-orange-500 border-2 border-[#1E293B]" />
            <h3 className="text-lg font-black text-[#1E293B]">Log Vendor Payable Bill</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg border-2 border-[#1E293B] bg-slate-50 text-[#1E293B]"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Vendor *</label>
            <select
              name="vendor_id"
              required
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Project</label>
            <select
              name="project_id"
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            >
              <option value="">None / Overhead</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">
                Bill # *
              </label>
              <input
                type="text"
                name="bill_number"
                required
                placeholder="e.g. GS-BILL-104"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                required
                placeholder="60000"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Bill Date</label>
              <input
                type="date"
                name="bill_date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Terms, items covered..."
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border-2 border-[#1E293B] bg-slate-100 px-4 py-2 text-xs font-bold text-[#1E293B] hover:bg-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl border-2 border-[#1E293B] bg-orange-600 px-5 py-2 text-xs font-black text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
            >
              {loading ? "Saving..." : "Record Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
