import Link from "next/link";
import { developer } from "@/lib/developer";
import { shop } from "@/lib/shop";

const quickLinks = [
  { href: "/collection", label: "All Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/contact", label: "Visit the Shop" },
];

const supportLinks = [
  { href: "/about", label: `About ${shop.name}` },
  { href: "/policies/shipping", label: "Shipping & Returns" },
  { href: "/login", label: "Customer Login" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-sand)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,241,247,0.98))]">
      <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-6 rounded-[1.75rem] border border-white/90 bg-white/78 p-6 shadow-[0_20px_54px_rgba(214,76,139,0.1)] lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr]">
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-muted)]">{shop.name}</p>
            <h2 className="max-w-lg font-serif text-3xl text-[var(--color-mocha-dark)]">Dubai boutique modestwear in a brighter premium pink-white experience.</h2>
            <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
              {shop.legalName} serves women, girls, and family shoppers with abaya, pardha, hijab, shawl, tailoring,
              wholesale, and retail support from Deira.
            </p>
          </section>

          <FooterColumn title="Shop" items={quickLinks} />
          <FooterColumn title="Support" items={supportLinks} />

          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">Developer</p>
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">{developer.name}</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={developer.website}
                className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_10px_20px_rgba(214,76,139,0.08)] transition hover:-translate-y-0.5 hover:text-[var(--color-mocha-dark)]"
              >
                Website
              </Link>
              <Link
                href={developer.linkedin}
                className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_10px_20px_rgba(214,76,139,0.08)] transition hover:-translate-y-0.5 hover:text-[var(--color-mocha-dark)]"
              >
                LinkedIn
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 {shop.name}. Boutique modest fashion ecommerce for the UAE.</p>
          <p>{shop.phonePrimary}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<{ href: string; label: string }> }) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block text-sm font-medium text-[var(--color-ink)] transition hover:text-[var(--color-mocha)]">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
