import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedProducts } from "@/lib/data";
import { getProductBackground } from "@/lib/product-image";

export const dynamic = "force-dynamic";

export default async function LookbookPage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Lookbook</p>
          <h1 className="mt-3 font-serif text-5xl">Styled modestwear inspiration from Mehara Pardha</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={0.06 * index}>
              <article className={`rounded-[2rem] surface-solid p-5 ${index === 0 ? "md:col-span-2" : ""}`}>
              <div
                className={`rounded-[1.5rem] bg-cover bg-center ${index === 0 ? "h-[26rem]" : "h-[22rem]"}`}
                style={{ backgroundImage: getProductBackground(product.image, product.name, "rgba(57,43,37,0.12)") }}
              />
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{product.category}</p>
                <h2 className="mt-2 font-serif text-3xl">{product.name}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">{product.description}</p>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
