"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 transition-colors"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 border border-zinc-800 p-10 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-100">
            Wexlogic CRM
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign in to access the dashboard
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="rounded-md bg-red-900/30 border border-red-800 p-4 text-sm text-red-400">
              {state.error}
            </div>
          )}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-slate-100 placeholder-zinc-500 focus:z-10 focus:border-slate-300 focus:outline-none focus:ring-slate-300 sm:text-sm transition-colors"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-slate-100 placeholder-zinc-500 focus:z-10 focus:border-slate-300 focus:outline-none focus:ring-slate-300 sm:text-sm transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
