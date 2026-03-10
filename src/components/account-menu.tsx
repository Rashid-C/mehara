"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AccountMenu({ mobileMenu = false }: { mobileMenu?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-11 w-24 rounded-full bg-white/70" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={`inline-flex items-center rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-ink)] shadow-[0_10px_24px_rgba(214,76,139,0.08)] ${
          mobileMenu ? "w-full justify-center" : ""
        }`}
      >
        Account
      </Link>
    );
  }

  return (
    <div className={`flex gap-3 ${mobileMenu ? "flex-col" : "items-center"}`}>
      <Link
        href="/account"
        className={`inline-flex items-center rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-bold text-[var(--color-ink)] shadow-[0_10px_24px_rgba(214,76,139,0.08)] ${
          mobileMenu ? "w-full justify-center" : ""
        }`}
      >
        {session.user.name?.split(" ")[0] ?? "Account"}
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className={`btn-nav-logout group items-center justify-center gap-2 px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] ${
          mobileMenu ? "inline-flex w-full" : "hidden md:inline-flex"
        }`}
      >
        <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">Logout</span>
      </button>
    </div>
  );
}
