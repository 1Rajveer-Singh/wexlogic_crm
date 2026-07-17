import { fetchRevenue, getUserRole } from "@/app/actions/wexlogic-actions";
import { Coins, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const revenue = await fetchRevenue();
  const role = await getUserRole();

  const totalRevenue = revenue.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const collectedRevenue = revenue
    .filter((r) => r.status === "paid")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue = revenue
    .filter((r) => r.status === "pending")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-zinc-400">Welcome back. Here is the latest summary of your operations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-shadow hover:shadow-md hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Pipeline</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {formatINR(totalRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-blue-900/30 p-3 ring-1 ring-blue-500/20">
              <Coins className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Collected */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-shadow hover:shadow-md hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Collected Revenue</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {formatINR(collectedRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-emerald-900/30 p-3 ring-1 ring-emerald-500/20">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm transition-shadow hover:shadow-md hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Pending Revenue</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {formatINR(pendingRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-amber-900/30 p-3 ring-1 ring-amber-500/20">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm mt-8">
          <h3 className="text-lg font-medium text-slate-100 mb-4">Quick Information</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            You are logged in as a <strong className="text-slate-200">{role || 'Viewer'}</strong>. You can navigate to Clients and Revenue on the sidebar to manage your data. 
            Note that certain actions (like creating clients or logging revenue) may be restricted based on your role.
          </p>
      </div>
    </div>
  );
}
