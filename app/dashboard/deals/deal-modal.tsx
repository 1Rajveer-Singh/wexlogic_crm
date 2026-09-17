"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GitPullRequest, X } from "lucide-react";
import { createDealAction } from "@/app/actions/crm-actions";
import type { Client, Service } from "@/types/crm";

export function DealModal({ clients, services }: { clients: Client[]; services: Service[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await createDealAction({
      deal_name: form.get("deal_name") as string,
      client_id: form.get("client_id") as string,
      service_id: (form.get("service_id") as string) || null,
      estimated_value: Number(form.get("estimated_value")) || 0,
      stage: "new",
      probability: Number(form.get("probability")) || 30,
      expected_close_date: (form.get("expected_close_date") as string) || null,
      source: form.get("source") as string,
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
        <GitPullRequest className="h-4 w-4" strokeWidth={2.5} />
        Create Deal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white border-2 border-[#1E293B] p-6 text-left shadow-pop-lg transition-all">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B]/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#D97706] border-2 border-[#1E293B]" />
            <h3 className="text-lg font-black text-[#1E293B]">Create New Deal Opportunity</h3>
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
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Deal Name *</label>
            <input
              type="text"
              name="deal_name"
              required
              placeholder="e.g. Annual Digital Retainer"
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Client *</label>
              <select
                name="client_id"
                required
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Primary Service</label>
              <select
                name="service_id"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Est. Value (₹) *</label>
              <input
                type="number"
                name="estimated_value"
                required
                placeholder="400000"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Probability (%)</label>
              <input
                type="number"
                name="probability"
                min="0"
                max="100"
                defaultValue="30"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Target Close</label>
              <input
                type="date"
                name="expected_close_date"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Terms, discussions, next steps..."
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
              className="rounded-xl border-2 border-[#1E293B] btn-primary px-5 py-2 text-xs font-black shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
            >
              {loading ? "Creating..." : "Save Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
