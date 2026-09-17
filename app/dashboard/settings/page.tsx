import { requireRole } from "@/utils/auth";
import { SettingsClient } from "./settings-client";
import { Settings, Shield } from "lucide-react";

export const metadata = {
  title: "System Settings | WexLogic CRM",
  description: "Company profile, currency defaults, and system configuration.",
};

export default async function SettingsPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-pink-100 border-2 border-[#1E293B]">
              <Settings className="h-4 w-4 text-pink-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#1E293B] font-display">
              System Settings & Configuration
            </h2>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Configure company defaults, invoicing formats, payment terms, and project cost categories.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border-2 border-[#1E293B] rounded-full px-4 py-1.5 shadow-pop-sm">
          <Shield className="h-4 w-4 text-pink-600" />
          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Admin Only
          </span>
        </div>
      </div>

      {/* Settings Form Client */}
      <SettingsClient />
    </div>
  );
}
