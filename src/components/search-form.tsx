"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/collection?q=${encodeURIComponent(value)}` : "/collection");
    setOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass-pink flex items-center justify-end gap-2 rounded-full border border-white/80 px-2 py-2 shadow-[0_14px_34px_rgba(214,76,139,0.14)] ${className}`}
    >
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${open ? "w-[11rem] opacity-100 sm:w-[16rem] lg:w-[20rem]" : "w-0 opacity-0"}`}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Abaya, pardha, chiffon..."
          className="w-full bg-transparent px-2 text-sm font-semibold text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]/90"
        />
      </div>
      {open ? (
        <button
          type="submit"
          className="btn-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.08em]"
        >
          Find
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-mocha-dark)] transition duration-300 ${
          open
            ? "bg-[var(--color-blush-strong)] shadow-[0_10px_24px_rgba(214,76,139,0.14)]"
            : "bg-white/92 hover:bg-white hover:shadow-[0_10px_24px_rgba(214,76,139,0.12)]"
        }`}
      >
        Search
      </button>
    </form>
  );
}
