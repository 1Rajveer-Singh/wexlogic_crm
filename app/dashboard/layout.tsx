import Link from "next/link";
import Image from "next/image";
import { Users, DollarSign, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/wexlogic-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = await getUserRole();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 relative flex flex-col">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-800">
          <Image src="/logo-white.png" alt="Wexlogic Logo" width={140} height={35} className="object-contain" priority />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-4">Menu</p>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-slate-100 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-zinc-500" />
              Overview
            </Link>
            <Link
              href="/dashboard/clients"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-slate-100 transition-colors"
            >
              <Users className="h-5 w-5 text-zinc-500" />
              Clients
            </Link>
            <Link
              href="/dashboard/revenue"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-slate-100 transition-colors"
            >
              <DollarSign className="h-5 w-5 text-zinc-500" />
              Revenue
            </Link>
          </nav>
        </div>
        <div className="shrink-0 p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.email}</p>
            <p className="text-xs text-zinc-500 capitalize mt-1">Role: {role || 'Unknown'}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-red-950/50 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
