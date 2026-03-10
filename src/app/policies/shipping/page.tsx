import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] border border-[var(--color-sand)] bg-white p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Shipping & Returns</p>
          <h1 className="mt-4 font-serif text-5xl">Clear delivery and return expectations for UAE customers.</h1>
          <div className="mt-8 space-y-5 text-base leading-8 text-[var(--color-muted)]">
            <p>Standard UAE dispatch within 1 to 3 business days after order confirmation.</p>
            <p>Payment-link and bank-transfer orders are prepared after payment confirmation.</p>
            <p>Returns for unworn items can be reviewed within 7 days, subject to hygiene and garment conditions.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
