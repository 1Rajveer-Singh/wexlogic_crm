import { fetchClients, getUserRole } from "@/app/actions/wexlogic-actions";
import { ClientForm } from "./client-form";

export default async function ClientsPage() {
  const clients = await fetchClients();
  const role = await getUserRole();
  const canAdd = role === "admin"; // Based on our RLS, only admins can insert!

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Clients</h2>
          <p className="mt-1 text-sm text-zinc-400">A list of all Wexlogic clients including their name, company, and email.</p>
        </div>
        {canAdd && <ClientForm />}
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-white/10 sm:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-200 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Company</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-200">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-100 sm:pl-6">{client.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">{client.company_name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">{client.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-sm text-zinc-500">No clients found.</td>
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
