"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, X } from "lucide-react";
import { createProjectAction } from "@/app/actions/crm-actions";
import type { Client } from "@/types/crm";

export function ProjectModal({ clients }: { clients: Client[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const project = await createProjectAction({
      name: form.get("name") as string,
      client_id: form.get("client_id") as string,
      project_value: Number(form.get("project_value")) || 0,
      overall_budget: Number(form.get("overall_budget")) || 0,
      start_date: (form.get("start_date") as string) || new Date().toISOString().split("T")[0],
      end_date: (form.get("end_date") as string) || null,
      priority: (form.get("priority") as "low" | "medium" | "high" | "urgent") || "medium",
      description: form.get("description") as string,
      status: "active",
    });

    setLoading(false);
    setIsOpen(false);
    router.push(`/dashboard/projects/${project.id}`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1E293B] btn-primary px-4 py-2 text-xs font-black shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
      >
        <FolderPlus className="h-4 w-4" strokeWidth={2.5} />
        Create Project
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white border-2 border-[#1E293B] p-6 text-left shadow-pop-lg transition-all">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B]/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B]" />
            <h3 className="text-lg font-black text-[#1E293B]">Create New Project</h3>
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
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Project Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Garba Event 2026"
              className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">
                Contract Value (₹) *
              </label>
              <input
                type="number"
                name="project_value"
                required
                placeholder="500000"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
              <span className="text-[10px] font-semibold text-slate-500">Amount client agreed to pay</span>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">
                Overall Cost Budget (₹) *
              </label>
              <input
                type="number"
                name="overall_budget"
                required
                placeholder="400000"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
              <span className="text-[10px] font-semibold text-slate-500">Internal delivery cost cap</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Priority</label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2 text-xs font-medium text-[#1E293B]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1E293B] mb-1">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Scope, deliverables, key requirements..."
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
              {loading ? "Creating..." : "Save Project & Open Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
