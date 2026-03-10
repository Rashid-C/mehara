"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      setSubmitting(false);
      setError("Invalid admin credentials.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_24px_60px_rgba(84,58,46,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Sign In</p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <input name="email" type="email" required className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <input name="password" type="password" required className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3" />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-full bg-[var(--color-mocha)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in to admin"}
        </button>
      </form>
    </section>
  );
}
