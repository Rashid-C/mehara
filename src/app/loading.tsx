export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-20 text-[var(--color-ink)] md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-full bg-[var(--color-blush)]" />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[var(--color-sand)] bg-white/80 p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
            <div className="h-6 w-32 animate-pulse rounded-full bg-[var(--color-blush)]" />
            <div className="mt-5 h-14 w-4/5 animate-pulse rounded-3xl bg-[var(--color-blush)]" />
            <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-[var(--color-blush)]" />
            <div className="mt-3 h-5 w-2/3 animate-pulse rounded-full bg-[var(--color-blush)]" />
          </div>
          <div className="rounded-[2rem] border border-[var(--color-sand)] bg-white/80 p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
            <div className="h-80 animate-pulse rounded-[1.5rem] bg-[var(--color-blush)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
