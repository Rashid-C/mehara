import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { shop } from "@/lib/shop";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <section className="rounded-[2rem] border border-[var(--color-sand)] bg-[linear-gradient(145deg,#fffefe_0%,#fff1f7_58%,#fde6f0_100%)] p-8 shadow-[0_24px_70px_rgba(214,76,139,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Contact</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl">Reach {shop.name} in Deira, Dubai for boutique modestwear and tailoring support.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            Visit the store, call directly, or connect on social channels for curated orders, accessories, wholesale, and retail support.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass-pink rounded-[2rem] border border-white/80 p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
            <h2 className="font-serif text-3xl">Store details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ContactCard title="Address" lines={[shop.addressLine1, shop.addressLine2, shop.cityCountry]} />
              <ContactCard title="Phone" lines={[shop.phonePrimary, shop.phoneSecondary]} />
              <ContactCard title="Email" lines={[shop.email]} />
              <ContactCard title="Website" lines={[shop.website]} />
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
            <h2 className="font-serif text-3xl">Social and support</h2>
            <div className="mt-6 space-y-4 text-[var(--color-muted)]">
              <InfoRow label="Facebook" value={shop.facebook} />
              <InfoRow label="Instagram" value={shop.instagram} />
              <InfoRow label="Working days" value="Monday to Saturday" />
              <InfoRow label="Store hours" value="10:00 AM - 9:00 PM UAE time" />
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-[var(--color-blush)]/55 p-5 text-sm leading-7 text-[var(--color-muted)]">
              WhatsApp and direct call support are available for boutique orders, accessories, retail enquiries, and wholesale requests.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/collection" className="rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white">
                Shop collection
              </Link>
              <Link href={`https://${shop.website}`} className="rounded-full border border-[var(--color-sand)] bg-white px-5 py-3 text-sm font-semibold">
                Visit website
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/86 p-5 shadow-[0_12px_28px_rgba(214,76,139,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{title}</p>
      <div className="mt-3 space-y-1 text-sm leading-7 text-[var(--color-ink)]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-sand)] pb-3 text-sm">
      <span className="font-semibold text-[var(--color-ink)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
