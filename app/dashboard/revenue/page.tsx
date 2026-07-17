import { fetchRevenue, fetchClients, fetchServices, getUserRole } from "@/app/actions/wexlogic-actions";
import { RevenueForm } from "./revenue-form";
import { Coins } from "lucide-react";

export default async function RevenuePage() {
  const revenue = await fetchRevenue();
  const clients = await fetchClients();
  const services = await fetchServices();
  
  const role = await getUserRole();
  const canAdd = role === "admin"; // Only admins can insert revenue per RLS/plan setup.

  const totalRevenue = revenue.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Revenue</h2>
          <p className="mt-1 text-sm text-zinc-400">Track all pending and paid services for your clients.</p>
        </div>
        {canAdd && <RevenueForm clients={clients} services={services} />}
      </div>

      {/* Total Revenue Summary Card */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm">
        <div className="rounded-full bg-blue-900/30 p-3 ring-1 ring-blue-500/20">
          <Coins className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Total Listed Revenue</p>
          <p className="text-2xl font-bold text-slate-100">{formatINR(totalRevenue)}</p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-white/10 sm:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Client</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Service</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                  {revenue.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-100 sm:pl-6">
                        {item.client?.name}
                        <span className="block text-xs text-zinc-500 font-normal">{item.client?.company_name}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                        {item.service?.name || "Unknown"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-100 font-medium">
                        {formatINR(Number(item.amount))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          item.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {revenue.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-sm text-zinc-500">No revenue records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
