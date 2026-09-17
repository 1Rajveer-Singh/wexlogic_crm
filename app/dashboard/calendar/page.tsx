import {
  getTasks,
  getInvoices,
  getVendorBills,
  getProjects,
  getActivities,
} from "@/lib/crm-db";
import { CalendarClient } from "./calendar-client";
import { Calendar, CheckSquare, Clock } from "lucide-react";

export const metadata = {
  title: "Calendar & Deadlines | WexLogic CRM",
  description: "Schedule, milestone, and deadline management for WexLogic operations.",
};

export default async function CalendarPage() {
  const [tasks, invoices, vendorBills, projects, activities] = await Promise.all([
    getTasks(),
    getInvoices(),
    getVendorBills(),
    getProjects(),
    getActivities(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-indigo-100 border-2 border-[#1E293B]">
              <Calendar className="h-4 w-4 text-indigo-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#1E293B] font-display">
              Calendar & Deadlines
            </h2>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Unified chronological schedule for project milestones, task deliverables, and financial due dates.
          </p>
        </div>
      </div>

      {/* Interactive Calendar Component */}
      <CalendarClient
        tasks={tasks}
        invoices={invoices}
        vendorBills={vendorBills}
        projects={projects}
        activities={activities}
      />
    </div>
  );
}
