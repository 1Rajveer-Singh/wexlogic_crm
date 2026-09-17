import Link from "next/link";
import { X } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import { LandingView } from "@/components/landing-view";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      {/* 1. Landing Page Background with reduced opacity/blur */}
      <div className="pointer-events-none select-none opacity-40 blur-[2px] transition-all">
        <LandingView signInHref="/login" />
      </div>

      {/* 2. Glassmorphism Backdrop Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-md my-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Close / Return to Landing Page Button */}
          <Link
            href="/"
            className="absolute -top-3 -right-3 z-20 h-10 w-10 bg-white border-2 border-[#1E293B] rounded-full flex items-center justify-center text-[#1E293B] shadow-pop hover:bg-rose-50 hover:text-rose-600 transition-all hover:scale-105 active:scale-95"
            title="Close and return to home page"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </Link>

          {/* Clerk SignIn Form */}
          <SignIn
            path="/login"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "bg-white border-2 border-[#1E293B] rounded-3xl shadow-pop-xl p-6 md:p-8",
                headerTitle: "text-2xl font-black text-[#1E293B] font-display",
                headerSubtitle: "text-xs text-slate-500 font-bold tracking-wide uppercase mt-1",
                socialButtonsBlockButton:
                  "bg-white hover:bg-slate-50 border-2 border-[#1E293B] rounded-xl py-3 px-4 shadow-pop-sm hover:shadow-pop transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-wider",
                socialButtonsBlockButtonText:
                  "text-[#1E293B] font-black text-xs uppercase tracking-wider",
                socialButtonsProviderIcon:
                  "w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 object-contain",
                dividerRow: "my-4",
                dividerText:
                  "text-slate-400 text-[10px] font-black uppercase tracking-widest",
                dividerLine: "bg-slate-200 h-[2px]",
                formButtonPrimary:
                  "btn-gold py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                formFieldLabel:
                  "text-[11px] font-black uppercase tracking-wider text-[#1E293B] mb-1.5",
                formFieldInput:
                  "bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl text-[#1E293B] font-bold text-sm p-3 focus:ring-0 focus:shadow-pop-sm transition-all",
                footerAction: "hidden",
                footer: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
