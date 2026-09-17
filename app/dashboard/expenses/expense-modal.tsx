"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt, X } from "lucide-react";
import { createExpenseAction } from "@/app/actions/crm-actions";
import type { Project, Vendor } from "@/types/crm";

export function ExpenseModal({ projects, vendors }: { projects: Project[]; vendors: Vendor[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await createExpenseAction({
      project_id: form.get("project_id") as string,
      vendor_id: (form.get("vendor_id") as string) || null,
      description: form.get("description") as string,
      amount: Number(form.get("amount")) || 0,
      expense_date: (form.get("expense_date") as string) || new Date().toISOString().split("T")[0],
      payment_method: (form.get("payment_method") as any) || "bank_transfer",
      payment_status: "paid",
      bill_number: form.get("bill_number") as string,
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
        <Receipt className="h-4 w-4" strokeWidth={2.5} />
        Add Expense
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white border-2 border-[#1E293B] p-6 text-left shadow-pop-lg">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B]/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 border-2 border-[#1E293B]" />
            <h3 className="text-lg font-black text-[#1E293B]">Record Operational Expense</h3>
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
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Description *</label>
            <input
              type="text"
              name="description"
              required
              placeholder="e.g. Venue sound engineering & mic setups"
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Project *</label>
            <select
              name="project_id"
              required
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                required
                placeholder="25000"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Vendor (Optional)</label>
              <select
                name="vendor_id"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              >
                <option value="">None / Direct</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Date</label>
              <input
                type="date"
                name="expense_date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Payment Method</label>
              <select
                name="payment_method"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>
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
              className="rounded-xl border-2 border-[#1E293B] bg-rose-600 px-5 py-2 text-xs font-black text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
            >
              {loading ? "Recording..." : "Record Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
