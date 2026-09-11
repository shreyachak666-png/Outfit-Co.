"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-burgundy py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-burgundy-dark disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Log In"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl text-chocolate">OUTFIT&amp;CO.</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-chocolate/45">
            Admin
          </p>
        </div>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm text-chocolate outline-none focus:border-burgundy"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2.5 text-sm text-chocolate outline-none focus:border-burgundy"
            />
          </div>

          {state.error && (
            <p className="text-sm text-burgundy">{state.error}</p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-xs text-chocolate/35">
          This area is private to Outfit&amp;Co.
        </p>
      </div>
    </main>
  );
}
