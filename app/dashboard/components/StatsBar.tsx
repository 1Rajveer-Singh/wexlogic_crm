"use client";

import { useEffect, useRef, useState } from "react";

type StatsBarProps = {
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
};

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export function StatsBar({
  paidAmount,
  pendingAmount,
  paidCount,
  pendingCount,
}: StatsBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const total = paidAmount + pendingAmount;
  const paidPct = total > 0 ? (paidAmount / total) * 100 : 0;
  const pendingPct = total > 0 ? (pendingAmount / total) * 100 : 0;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={ref} className="space-y-6">
      {/* Stacked progress bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
          <span>Paid vs Pending Ratio</span>
          <span>{formatINR(total)} total</span>
        </div>
        <div className="h-4 w-full rounded-full border-2 border-[#1E293B] bg-slate-100 overflow-hidden flex shadow-pop-sm">
          <div
            className="h-full bg-[#34D399] border-r-2 border-[#1E293B] transition-all duration-700 ease-out"
            style={{ width: animated ? `${paidPct}%` : "0%" }}
          />
          <div
            className="h-full bg-[#FBBF24] transition-all duration-700 ease-out delay-100"
            style={{ width: animated ? `${pendingPct}%` : "0%" }}
          />
        </div>
      </div>

      {/* Two stat boxes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Paid */}
        <div className="rounded-2xl border-2 border-[#1E293B] bg-emerald-50/60 p-4 shadow-pop-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-3 w-3 rounded-full bg-[#34D399] border border-[#1E293B]" />
            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
              Paid Invoices
            </span>
          </div>
          <p className="text-2xl font-black text-[#1E293B]">
            {paidPct.toFixed(1)}%
          </p>
          <p className="text-sm font-bold text-emerald-800 mt-0.5">
            {formatINR(paidAmount)}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {paidCount} invoice{paidCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border-2 border-[#1E293B] bg-amber-50/60 p-4 shadow-pop-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-3 w-3 rounded-full bg-[#FBBF24] border border-[#1E293B]" />
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
              Pending Invoices
            </span>
          </div>
          <p className="text-2xl font-black text-[#1E293B]">
            {pendingPct.toFixed(1)}%
          </p>
          <p className="text-sm font-bold text-amber-800 mt-0.5">
            {formatINR(pendingAmount)}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {pendingCount} invoice{pendingCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
