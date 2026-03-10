import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProductBySlug, getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sizes = product.sizes.split(",").map((size) => size.trim());

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1fr_0.95fr]">
        <ProductGallery image={product.image} name={product.name} />
        <section className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">{product.category}</p>
            <h1 className="mt-3 font-serif text-4xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-semibold text-[var(--color-mocha)]">{formatCurrency(product.price)}</p>
          </div>
          <p className="text-base leading-8 text-[var(--color-muted)]">{product.description}</p>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Available sizes</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">Stock available</p>
                <p className="text-sm text-[var(--color-muted)]">{product.stock} pieces ready for order</p>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-[var(--color-blush)]/40 p-6">
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Need custom bulk orders or boutique supply? Use the admin panel to manage stock and order status, then extend
              this MVP with authentication and payment integration.
            </p>
            <Link href="/admin" className="mt-4 inline-flex text-sm font-semibold text-[var(--color-mocha)]">
              Manage catalog in admin
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
