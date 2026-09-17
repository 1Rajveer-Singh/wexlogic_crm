"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { convertLeadAction } from "@/app/actions/crm-actions";

export function ConvertButton({ leadId, leadName }: { leadId: string; leadName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConvert = async () => {
    if (!confirm(`Convert lead "${leadName}" into an active WexLogic Client? Full history will be preserved.`)) {
      return;
    }
    setLoading(true);
    const res = await convertLeadAction(leadId);
    setLoading(false);
    if (res) {
      router.push(`/dashboard/clients`);
    } else {
      alert("Failed to convert lead.");
    }
  };

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#1E293B] bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-950 shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer"
      title="Convert to Client"
    >
      <UserCheck className="h-3.5 w-3.5 text-emerald-700" strokeWidth={2.5} />
      {loading ? "Converting..." : "Convert to Client"}
    </button>
  );
}
