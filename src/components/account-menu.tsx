"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AccountMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-11 w-24 rounded-full bg-white/70" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-ink)] shadow-[0_10px_24px_rgba(214,76,139,0.08)]"
      >
        Account
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-bold text-[var(--color-ink)] shadow-[0_10px_24px_rgba(214,76,139,0.08)]"
      >
        {session.user.name?.split(" ")[0] ?? "Account"}
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="hidden rounded-full border border-[var(--color-sand)] bg-white/75 px-4 py-2 text-sm font-bold text-[var(--color-ink)]/70 md:inline-flex"
      >
        Logout
      </button>
    </div>
  );
}
