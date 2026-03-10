"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  mode: "login" | "signup";
  googleEnabled: boolean;
};

export function AuthCard({ mode, googleEnabled }: Props) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    if (mode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        setSubmitting(false);
        setError("Registration failed. Use a different email or stronger password.");
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/account",
    });

    if (result?.error) {
      setSubmitting(false);
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/account";
  }

  return (
    <section className="glass-pink rounded-[2rem] border border-white/80 p-8 shadow-[0_24px_60px_rgba(214,76,139,0.1)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {mode === "login" ? "Customer Sign In" : "Create Account"}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
        Secure customer access uses JWT-backed sessions. You can continue with email/password or Google OAuth when Google
        keys are configured.
      </p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Full name</span>
            <input
              name="name"
              required
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white/90 px-4 py-3 outline-none transition focus:border-[var(--color-mocha)]"
            />
          </label>
        ) : null}
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-[var(--color-sand)] bg-white/90 px-4 py-3 outline-none transition focus:border-[var(--color-mocha)]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-2xl border border-[var(--color-sand)] bg-white/90 px-4 py-3 outline-none transition focus:border-[var(--color-mocha)]"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-mocha)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(214,76,139,0.18)] disabled:opacity-60"
        >
          {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      {googleEnabled ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--color-sand)] bg-white/90 px-6 py-3 text-sm font-semibold"
        >
          Continue with Google
        </button>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Google sign-in appears automatically after `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured.
        </p>
      )}
      <p className="mt-5 text-sm text-[var(--color-muted)]">
        {mode === "login" ? "New to Mehar Pardha?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-[var(--color-mocha)]">
          {mode === "login" ? "Create account" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}
