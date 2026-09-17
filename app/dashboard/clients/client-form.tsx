"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { insertClient } from "@/app/actions/wexlogic-actions";
import { UserPlus, X } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center items-center rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] px-5 py-2 text-sm font-bold text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer"
    >
      {pending ? "Saving Client..." : "Save Client"}
    </button>
  );
}

export function ClientForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formAction = async (formData: FormData) => {
    setError(null);
    const res = await insertClient(null, formData);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] px-4 py-2 text-sm font-bold text-white shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
      >
        <UserPlus className="h-4 w-4" strokeWidth={2.5} />
        Add Client
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white border-2 border-[#1E293B] p-6 text-left align-middle shadow-pop-lg transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E293B]/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B]" />
            <h3 className="text-xl font-black text-[#1E293B]">Add New Client</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg border-2 border-[#1E293B] bg-slate-50 text-[#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <form action={formAction} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border-2 border-rose-400 p-3 text-sm font-bold text-rose-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="e.g. John Smith"
              className="block w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2.5 text-sm font-medium text-[#1E293B] placeholder-slate-400 focus:outline-none focus:shadow-pop-sm transition-all"
            />
          </div>
          <div>
            <label htmlFor="company_name" className="block text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              required
              placeholder="e.g. Acme Corp"
              className="block w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2.5 text-sm font-medium text-[#1E293B] placeholder-slate-400 focus:outline-none focus:shadow-pop-sm transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="e.g. john@acme.com"
              className="block w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] p-2.5 text-sm font-medium text-[#1E293B] placeholder-slate-400 focus:outline-none focus:shadow-pop-sm transition-all"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border-2 border-[#1E293B] bg-slate-100 px-4 py-2 text-sm font-bold text-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
