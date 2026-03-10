"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [taxPercentage, setTaxPercentage] = useState(0);

  useEffect(() => {
    fetch("/api/store-settings")
      .then((response) => response.json())
      .then((data) => setTaxPercentage(Number(data.taxPercentage) || 0))
      .catch(() => setTaxPercentage(0));
  }, []);

  const taxAmount = Math.round(total * (taxPercentage / 100));
  const grandTotal = total + taxAmount;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Cart</p>
          <h1 className="mt-3 font-serif text-4xl">Review your selections</h1>
        </div>
        {items.length === 0 ? (
          <div className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-10 text-center">
            <p className="text-lg text-[var(--color-muted)]">Your cart is empty.</p>
            <Link href="/collection" className="mt-4 inline-flex font-semibold text-[var(--color-mocha)]">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={`${item.id}-${item.size}`}
                  className="glass-pink rounded-[1.5rem] border border-white/70 p-5 shadow-[0_18px_44px_rgba(214,76,139,0.08)]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-24 w-24 rounded-[1.25rem] bg-cover bg-center"
                        style={{ backgroundImage: `url("${getProductImageUrl(item.image ?? "", item.name)}")` }}
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">{item.category}</p>
                        <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">Size {item.size}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--color-mocha)]">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        className="h-10 w-10 rounded-full border border-[var(--color-sand)] bg-white"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="h-10 w-10 rounded-full border border-[var(--color-sand)] bg-white"
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id, item.size)} className="text-sm font-semibold text-red-600">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="glass-pink rounded-[1.75rem] border border-white/70 p-6 shadow-[0_20px_50px_rgba(214,76,139,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Summary</p>
              <div className="mt-6 space-y-4 text-sm">
                <Row label="Subtotal" value={formatCurrency(total)} />
                <Row label={`Tax (${taxPercentage}%)`} value={formatCurrency(taxAmount)} />
                <div className="border-t border-[var(--color-sand)] pt-4">
                  <Row label="Grand total" value={formatCurrency(grandTotal)} strong />
                </div>
              </div>
              <div className="mt-6 rounded-[1.25rem] bg-white/80 p-4 text-sm leading-7 text-[var(--color-muted)]">
                Premium modestwear orders are prepared after checkout confirmation. Tax shown here follows the admin store setting.
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white"
              >
                Continue to checkout
              </Link>
              <button type="button" onClick={clearCart} className="mt-4 w-full text-sm font-semibold text-[var(--color-muted)]">
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-lg font-semibold" : ""}`}>
      <span>{label}</span>
      <span className={strong ? "text-[var(--color-mocha)]" : ""}>{value}</span>
    </div>
  );
}
