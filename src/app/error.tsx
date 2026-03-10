"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-20 text-[var(--color-ink)] md:px-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-sand)] bg-[linear-gradient(145deg,#fffefe_0%,#fff2f8_56%,#fde7f1_100%)] p-10 text-center shadow-[0_24px_70px_rgba(214,76,139,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Something went wrong</p>
        <h1 className="mt-4 font-serif text-5xl">The page could not finish loading.</h1>
        <p className="mt-5 text-sm leading-8 text-[var(--color-muted)]">
          Try reloading this screen or return to the storefront. If the problem continues, check the latest code or server logs.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[var(--color-mocha)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(214,76,139,0.18)]"
          >
            Try again
          </button>
          <Link href="/" className="rounded-full border border-[var(--color-sand)] bg-white px-6 py-3 text-sm font-semibold">
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
