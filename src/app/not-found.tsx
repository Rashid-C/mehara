import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-20 text-[var(--color-ink)] md:px-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-sand)] bg-white/90 p-10 text-center shadow-[0_24px_70px_rgba(214,76,139,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">404</p>
        <h1 className="mt-4 font-serif text-5xl">This page could not be found.</h1>
        <p className="mt-5 text-sm leading-8 text-[var(--color-muted)]">
          The link may be outdated or the page may have moved. Continue browsing the collection or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="rounded-full bg-[var(--color-mocha)] px-6 py-3 text-sm font-semibold text-white">
            Back to home
          </Link>
          <Link href="/collection" className="rounded-full border border-[var(--color-sand)] bg-white px-6 py-3 text-sm font-semibold">
            Shop collection
          </Link>
        </div>
      </div>
    </div>
  );
}
