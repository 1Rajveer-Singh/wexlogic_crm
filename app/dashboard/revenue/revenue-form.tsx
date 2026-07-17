"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { insertRevenue } from "@/app/actions/wexlogic-actions";

type Props = {
  clients: any[];
  services: any[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200"
    >
      {pending ? "Saving..." : "Save Payment"}
    </button>
  );
}

export function RevenueForm({ clients, services }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(insertRevenue, null);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const isClientsEmpty = clients.length === 0;
  const isServicesEmpty = services.length === 0;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
      >
        Log Payment
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 sm:p-0">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-left align-middle shadow-2xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-slate-100">Log New Payment</h3>
        <form action={formAction} className="mt-4 space-y-5">
          {state?.error && (
            <div className="rounded-md bg-red-900/30 border border-red-800 p-3 text-sm text-red-400">
              {state.error}
            </div>
          )}
          
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-slate-300 mb-1">Client</label>
            <select 
              name="client_id" 
              id="client_id" 
              required 
              disabled={isClientsEmpty}
              className="block w-full rounded-md border-zinc-700 bg-zinc-800/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-slate-100 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClientsEmpty ? (
                <option value="" className="bg-zinc-900 text-slate-400">No clients found</option>
              ) : (
                <>
                  <option value="" className="bg-zinc-900 text-slate-100">Select a client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-slate-100">{c.name} ({c.company_name})</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-slate-300 mb-1">Service</label>
            <select 
              name="service_id" 
              id="service_id" 
              required 
              disabled={isServicesEmpty}
              className="block w-full rounded-md border-zinc-700 bg-zinc-800/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-slate-100 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isServicesEmpty ? (
                <option value="" className="bg-zinc-900 text-slate-400">No services found</option>
              ) : (
                <>
                  <option value="" className="bg-zinc-900 text-slate-100">Select a service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-slate-100">{s.name} - {formatINR(Number(s.base_price))}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">Amount (₹)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              name="amount" 
              id="amount" 
              required 
              className="block w-full rounded-md border-zinc-700 bg-zinc-800/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-slate-100 placeholder-zinc-500 transition-all duration-200 outline-none" 
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select 
              name="status" 
              id="status" 
              required 
              className="block w-full rounded-md border-zinc-700 bg-zinc-800/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-slate-100 transition-all duration-200 outline-none"
            >
              <option value="pending" className="bg-zinc-900 text-slate-100">Pending</option>
              <option value="paid" className="bg-zinc-900 text-slate-100">Paid</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200"
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
