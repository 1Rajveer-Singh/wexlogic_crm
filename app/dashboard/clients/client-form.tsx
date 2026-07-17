"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { insertClient } from "@/app/actions/wexlogic-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
    >
      {pending ? "Saving..." : "Save Client"}
    </button>
  );
}

export function ClientForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(insertClient, null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="block rounded-md bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-zinc-950 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 transition-colors"
      >
        Add Client
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-0">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-left align-middle shadow-2xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-slate-100">Add New Client</h3>
        <form action={formAction} className="mt-4 space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-900/30 border border-red-800 p-3 text-sm text-red-400">
              {state.error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input type="text" name="name" id="name" required className="block w-full rounded-md border-zinc-700 bg-zinc-950/50 shadow-sm focus:border-slate-300 focus:ring-slate-300 sm:text-sm border p-2 text-slate-100 placeholder-zinc-500" />
          </div>
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
            <input type="text" name="company_name" id="company_name" required className="block w-full rounded-md border-zinc-700 bg-zinc-950/50 shadow-sm focus:border-slate-300 focus:ring-slate-300 sm:text-sm border p-2 text-slate-100 placeholder-zinc-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input type="email" name="email" id="email" required className="block w-full rounded-md border-zinc-700 bg-zinc-950/50 shadow-sm focus:border-slate-300 focus:ring-slate-300 sm:text-sm border p-2 text-slate-100 placeholder-zinc-500" />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
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
