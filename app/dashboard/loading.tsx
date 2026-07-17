import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-4 text-zinc-400">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm font-medium animate-pulse">Loading Wexlogic Dashboard...</p>
    </div>
  );
}
