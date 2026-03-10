"use client";

import { FormEvent, useState } from "react";

export function AdminTaxSettings({ initialTaxPercentage }: { initialTaxPercentage: number }) {
  const [taxPercentage, setTaxPercentage] = useState(String(initialTaxPercentage));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taxPercentage: Number(taxPercentage) }),
    });

    if (!response.ok) {
      setSaving(false);
      setMessage("Tax update failed.");
      return;
    }

    const result = await response.json();
    setTaxPercentage(String(result.taxPercentage));
    setSaving(false);
    setMessage("Tax percentage updated.");
  }

  return (
    <section className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-6 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Store Tax</p>
      <h2 className="mt-2 font-serif text-3xl">Tax percentage</h2>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-2 block text-sm font-medium">Tax rate (%)</span>
          <input
            value={taxPercentage}
            onChange={(event) => setTaxPercentage(event.target.value)}
            type="number"
            min="0"
            step="0.1"
            className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save tax"}
        </button>
      </form>
      <p className="mt-3 text-sm text-[var(--color-muted)]">This value is used in cart and checkout summaries.</p>
      {message ? <p className="mt-2 text-sm text-[var(--color-mocha)]">{message}</p> : null}
    </section>
  );
}
