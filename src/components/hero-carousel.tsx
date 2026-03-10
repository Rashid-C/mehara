"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductBackground } from "@/lib/product-image";
import { Product } from "@/lib/types";

export function HeroCarousel({ products }: { products: Product[] }) {
  const slides = products.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const active = slides[activeIndex];

  return (
    <div className="glass-pink rounded-[2rem] border border-white/90 p-4 shadow-[0_30px_85px_rgba(225,69,140,0.18)]">
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <div className="animate-float-soft absolute left-4 top-4 z-10 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5),transparent_72%)]" />
        {slides.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-all duration-700 ${index === activeIndex ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
          >
            <div
              className="h-[20rem] bg-cover bg-center md:h-[28rem]"
              style={{ backgroundImage: getProductBackground(product.image, product.name, "rgba(214,76,139,0.14)") }}
            />
          </div>
        ))}
        <div className="relative h-[20rem] md:h-[28rem]" />

        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(42,22,33,0.82))] p-6 text-white md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">{active.category}</p>
          <h2 className="mt-2 max-w-xl font-serif text-3xl md:text-5xl">{active.name}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 md:text-base">{active.shortDescription}</p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to ${slide.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-10 bg-white shadow-[0_8px_20px_rgba(255,255,255,0.3)]" : "w-2.5 bg-white/50"}`}
                />
              ))}
            </div>
            <Link
              href={`/product/${active.slug}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-mocha-dark)] shadow-[0_12px_28px_rgba(255,255,255,0.24)]"
            >
              View style
            </Link>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-10 hidden max-w-[16rem] rounded-[1.4rem] border border-white/40 bg-[rgba(255,255,255,0.18)] p-4 text-white shadow-[0_18px_36px_rgba(52,31,41,0.16)] backdrop-blur-xl md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Local Boutique Card</p>
          <h3 className="mt-2 font-serif text-2xl">{active.name}</h3>
          <p className="mt-2 text-sm leading-6 text-white/80">Premium modestwear selected for graceful UAE daily dressing and occasion styling.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {slides.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
              index === activeIndex
                ? "border-[var(--color-mocha)] bg-[var(--color-blush)]/70 shadow-[0_14px_30px_rgba(214,76,139,0.12)]"
                : "border-[var(--color-sand)] bg-white/85"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{product.category}</p>
            <h3 className="mt-2 font-serif text-xl text-[var(--color-ink)]">{product.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}
