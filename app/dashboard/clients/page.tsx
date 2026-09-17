import { getClients } from "@/lib/crm-db";
import { requireRole } from "@/utils/auth";
import { ClientForm, DeleteClientButton } from "./client-form";
import { Users, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const { role } = await requireRole(["admin", "manager", "sales", "employee", "viewer"]);
  const clients = await getClients();
  const canAdd = role === "admin" || role === "manager" || role === "sales";

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b-2 border-[#1E293B]/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-emerald-100 border-2 border-[#1E293B]">
              <Users className="h-4 w-4 text-[#059669]" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1E293B]">
              Clients Directory
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
            Client accounts, corporate contacts, and complete 360° operational history.
          </p>
        </div>
        {canAdd && <ClientForm />}
      </div>

      {/* Clients Table Card */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#1E293B]/10">
            <thead className="bg-[#FFFDF5] border-b-2 border-[#1E293B]">
              <tr>
                <th
                  scope="col"
                  className="py-4 pl-4 pr-3 text-left text-xs font-black uppercase tracking-wider text-[#1E293B] sm:pl-6"
                >
                  Client / Contact
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]"
                >
                  Email & Phone
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 text-left text-xs font-black uppercase tracking-wider text-[#1E293B]"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 text-right text-xs font-black uppercase tracking-wider text-[#1E293B] pr-6"
                >
                  360° View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1E293B]/10 bg-white">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-[#1E293B] sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-100 border-2 border-[#1E293B] flex items-center justify-center text-xs font-black text-[#8B5CF6]">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="hover:underline text-[#1E293B] font-bold"
                      >
                        {client.name}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-slate-700">
                    <span className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-xs">
                      {client.company_name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-slate-600">
                    <div>{client.email}</div>
                    {client.phone && <div className="text-slate-400 mt-0.5">{client.phone}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                    <span className="rounded-full bg-emerald-100 border border-[#34D399] px-2.5 py-0.5 font-black uppercase text-emerald-950 text-[10px]">
                      {client.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#1E293B] bg-[#FFFDF5] px-3 py-1 text-xs font-bold text-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <span>360° Hub</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {canAdd && (
                        <>
                          <ClientForm initialData={client} />
                          <DeleteClientButton id={client.id} name={client.name} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm font-medium text-slate-400">
                    No clients found. Click "Add Client" to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
