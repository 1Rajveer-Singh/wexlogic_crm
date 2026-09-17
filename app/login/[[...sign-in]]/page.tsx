import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import { WexLogicLogo } from "@/components/wexlogic-logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1E293B] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between pb-4">
        <WexLogicLogo href="/" size="md" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E293B] bg-white text-xs font-black text-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 transition-all"
          title="Back to Home"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </header>

      {/* Main Sign-In Card Area */}
      <main className="w-full max-w-md mx-auto my-auto py-4 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center">
          <SignIn
            path="/login"
            routing="path"
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "w-full bg-white border-2 border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-pop sm:shadow-pop-lg p-5 sm:p-7",
                headerTitle: "text-xl sm:text-2xl font-black text-[#1E293B] font-display",
                headerSubtitle: "text-xs text-slate-500 font-bold tracking-wide mt-1",
                formButtonPrimary:
                  "btn-gold py-2.5 sm:py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                formFieldLabel:
                  "text-[11px] font-black uppercase tracking-wider text-[#1E293B] mb-1",
                formFieldInput:
                  "bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl text-[#1E293B] font-bold text-sm p-2.5 sm:p-3 transition-all",
              },
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto pt-4 text-center text-xs font-bold text-slate-400">
        <p>(c) 2026 WexLogic CRM - Secured Enterprise Operations</p>
      </footer>
    </div>
  );
}
