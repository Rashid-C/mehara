import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { getProductBackground } from "@/lib/product-image";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] surface-solid transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_74px_rgba(214,76,139,0.18)]">
      <div
        className="relative h-80 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
        style={{ backgroundImage: getProductBackground(product.image, product.name, "rgba(214,76,139,0.12)") }}
      >
        <div className="absolute left-4 top-4 rounded-full bg-white/94 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mocha-dark)] shadow-[0_10px_22px_rgba(214,76,139,0.14)]">
          {product.category}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(36,17,28,0.16))]" />
      </div>
      <div className="space-y-3 bg-[linear-gradient(180deg,#ffffff_0%,#fff9fc_100%)] p-6">
        <h3 className="font-serif text-2xl text-[var(--color-ink)]">{product.name}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{product.shortDescription}</p>
        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="text-lg font-bold text-[var(--color-mocha-dark)]">{formatCurrency(product.price)}</span>
          <Link
            href={`/product/${product.slug}`}
            className="btn-secondary inline-flex items-center px-4 py-2 text-sm font-semibold"
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}
