import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedProducts, getProducts } from "@/lib/data";
import { shop } from "@/lib/shop";

export const dynamic = "force-dynamic";

const experienceCards = [
  {
    title: "Boutique styling",
    copy: "Curated modestwear edits for elegant daily dressing, occasions, and gifting across the UAE.",
  },
  {
    title: "Responsive shopping",
    copy: "Designed for mobile-first browsing, touch-friendly filtering, and smooth checkout on every screen.",
  },
  {
    title: "Premium service",
    copy: "Customer accounts, order history, payment-ready checkout, and a stronger admin workflow behind the scenes.",
  },
];

export default async function Home() {
  const [featuredProducts, products] = await Promise.all([getFeaturedProducts(), getProducts()]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--color-sand)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(225,69,140,0.3),_transparent_26%),radial-gradient(circle_at_82%_20%,_rgba(255,121,176,0.22),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,199,223,0.98),_transparent_34%),linear-gradient(135deg,_#ffffff_0%,_#fff4fa_40%,_#ffe5f0_100%)]" />
          <div className="animate-float-soft absolute left-[4%] top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.86),_transparent_72%)]" />
          <div className="animate-glow-pulse absolute bottom-10 right-[8%] h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(255,143,190,0.2),_transparent_70%)]" />
          <div className="absolute inset-y-0 left-1/2 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(225,69,140,0.14),transparent)] lg:block" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div className="space-y-7">
              <span className="inline-flex rounded-full border border-white/90 bg-white/94 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-mocha-dark)] shadow-[0_14px_30px_rgba(225,69,140,0.14)]">
                {shop.name} | UAE Boutique
              </span>
              <div className="space-y-5">
                <h1 className="max-w-3xl font-serif text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
                  Pink, graceful, and modern modest fashion for women, girls, and kids.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
                  {shop.name} brings together elegant abayas, hijab, shawl, pardha, dresses, and curated modestwear for
                  shoppers across the UAE with a soft, feminine boutique experience.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/collection" className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold">
                  Shop the Collection
                </Link>
                <Link href="/contact" className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[var(--color-mocha-dark)]">
                  Visit the Shop
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Styles Ready" value={`${products.length}+`} />
                <Stat label="Customer Features" value="Accounts + History" />
                <Stat label="Based In" value="Naif Road, Deira" />
              </div>
            </div>

            <HeroCarousel products={featuredProducts} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="relative overflow-hidden rounded-[2rem] surface-glass p-8 md:p-10">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(243,141,183,0.22),_transparent_72%)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Why {shop.name}</p>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl md:text-5xl">A soft pink boutique mood across the full shopping journey</h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--color-muted)] md:text-base">
                From discovery to checkout, every surface is shaped for graceful browsing, mobile comfort, and a polished
                boutique feel that suits women, girls, and family shoppers across the UAE.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {experienceCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={`rounded-[1.5rem] border border-white/80 p-5 shadow-[0_16px_40px_rgba(214,76,139,0.08)] ${
                      index === 0 ? "bg-white" : "bg-white/80"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-mocha)]">0{index + 1}</p>
                    <h3 className="mt-3 font-serif text-2xl">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{card.copy}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-6">
              <Reveal className="rounded-[2rem] surface-solid p-8" delay={0.08}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">Style Promise</p>
                <h3 className="mt-3 font-serif text-3xl">Elegant curation, soft visuals, and practical shopping flow.</h3>
                <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
                  Search, collection filtering, saved account access, and order history are wrapped in a lighter pink-white
                  interface that feels more premium than a basic catalog.
                </p>
                <Link href="/about" className="btn-primary mt-6 inline-flex px-5 py-3 text-sm font-semibold">
                  Read our story
                </Link>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2">
                <Reveal delay={0.12}>
                  <FeatureStat title="Mobile-first" copy="Touch-friendly navigation, search, and cards built to scale cleanly from phone to desktop." />
                </Reveal>
                <Reveal delay={0.18}>
                  <FeatureStat title="Customer-ready" copy="Login, signup, order history, and polished account access designed for repeat shoppers." />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-4 md:px-10">
          <Reveal className="rounded-[2rem] surface-glass p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Shop Details</p>
                <h2 className="mt-3 font-serif text-4xl">{shop.legalName}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {shop.addressLine1}, {shop.addressLine2}, {shop.cityCountry}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 font-semibold shadow-[0_12px_28px_rgba(214,76,139,0.08)]">{shop.phonePrimary}</div>
                <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 font-semibold shadow-[0_12px_28px_rgba(214,76,139,0.08)]">{shop.phoneSecondary}</div>
                <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 font-semibold shadow-[0_12px_28px_rgba(214,76,139,0.08)]">{shop.email}</div>
                <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 font-semibold shadow-[0_12px_28px_rgba(214,76,139,0.08)]">{shop.website}</div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Featured Styles</p>
              <h2 className="mt-3 font-serif text-4xl">Best sellers and elegant new arrivals</h2>
            </div>
            <Link href="/collection" className="text-sm font-semibold text-[var(--color-mocha-dark)]">
              View all collection
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/90 bg-white/94 px-5 py-4 shadow-[0_16px_38px_rgba(225,69,140,0.12)]">
      <p className="text-lg font-semibold text-[var(--color-mocha-dark)]">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
    </div>
  );
}

function FeatureStat({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-[linear-gradient(180deg,#ffffff_0%,#fff7fb_100%)] p-6 shadow-[0_16px_40px_rgba(214,76,139,0.08)]">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{copy}</p>
    </div>
  );
}
