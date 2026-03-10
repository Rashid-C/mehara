import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
        <div className="rounded-[2rem] border border-[var(--color-sand)] bg-white p-10 shadow-[0_20px_60px_rgba(84,58,46,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Order Confirmed</p>
          <h1 className="mt-4 font-serif text-4xl">Thank you for shopping with Mehara</h1>
          <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
            Your order has been saved to the database and will appear in the admin dashboard for processing.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/collection" className="rounded-full bg-[var(--color-mocha)] px-6 py-3 text-sm font-semibold text-white">
              Continue shopping
            </Link>
            <Link href="/admin" className="rounded-full border border-[var(--color-sand)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)]">
              View admin
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
