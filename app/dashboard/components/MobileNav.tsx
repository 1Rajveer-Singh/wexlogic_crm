"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, DollarSign, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";

export function MobileNav({ email, role }: { email?: string; role: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
        <Image src="/logo-horizontal.png" alt="Wexlogic Logo" width={120} height={42} className="object-contain" priority />
        <button onClick={() => setIsOpen(true)} className="p-2 text-zinc-400 hover:text-slate-100">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-full max-w-[280px] flex-col bg-zinc-900 border-r border-zinc-800 h-full transform transition-transform duration-300">
            <div className="flex h-16 items-center justify-between p-4 border-b border-zinc-800 shrink-0">
              <Image src="/logo-horizontal.png" alt="Wexlogic Logo" width={120} height={42} className="object-contain" />
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-4">Menu</p>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-zinc-800 text-slate-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-slate-100'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Overview
              </Link>
              <Link
                href="/dashboard/clients"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/dashboard/clients' ? 'bg-zinc-800 text-slate-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-slate-100'}`}
              >
                <Users className="h-5 w-5" />
                Clients
              </Link>
              <Link
                href="/dashboard/revenue"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/dashboard/revenue' ? 'bg-zinc-800 text-slate-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-slate-100'}`}
              >
                <DollarSign className="h-5 w-5" />
                Revenue
              </Link>
            </div>

            <div className="shrink-0 p-4 border-t border-zinc-800 bg-zinc-900">
              <div className="mb-4 px-2">
                <p className="text-sm font-medium text-slate-200 truncate">{email}</p>
                <p className="text-xs text-zinc-500 capitalize mt-1">Role: {role || 'Unknown'}</p>
              </div>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                }}
                className="flex w-full items-center gap-3 px-3 py-3 text-sm font-medium text-red-400 rounded-md hover:bg-red-950/50 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
