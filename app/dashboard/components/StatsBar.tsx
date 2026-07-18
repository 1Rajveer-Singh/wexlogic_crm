"use client";

import { useEffect, useRef, useState } from "react";

type StatsBarProps = {
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
  formatValue: (v: number) => string;
};

export function StatsBar({
  paidAmount,
  pendingAmount,
  paidCount,
  pendingCount,
  formatValue,
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
    <div ref={ref} className="space-y-5">
      {/* Stacked progress bar */}
      <div>
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>Paid vs Pending</span>
          <span>{formatValue(total)} total</span>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-700 ease-out"
            style={{ width: animated ? `${paidPct}%` : "0%" }}
          />
          <div
            className="h-full bg-amber-500 rounded-r-full transition-all duration-700 ease-out delay-100"
            style={{ width: animated ? `${pendingPct}%` : "0%" }}
          />
        </div>
      </div>

      {/* Two stat boxes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Paid */}
        <div className="rounded-lg border border-emerald-800/60 bg-emerald-900/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Paid
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {paidPct.toFixed(1)}%
          </p>
          <p className="text-sm text-emerald-400 font-medium mt-0.5">
            {formatValue(paidAmount)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {paidCount} invoice{paidCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-lg border border-amber-800/60 bg-amber-900/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Unpaid
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {pendingPct.toFixed(1)}%
          </p>
          <p className="text-sm text-amber-400 font-medium mt-0.5">
            {formatValue(pendingAmount)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {pendingCount} invoice{pendingCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
