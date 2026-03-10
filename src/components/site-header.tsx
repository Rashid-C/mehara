"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/account-menu";
import { useCart } from "@/components/cart-provider";
import { SearchForm } from "@/components/search-form";
import { shop } from "@/lib/shop";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);
      setHidden(currentY > lastY && currentY > 140);
      lastY = currentY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-white/70 bg-[rgba(255,250,252,0.8)] backdrop-blur-2xl transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "shadow-[0_22px_48px_rgba(225,69,140,0.16)]" : ""}`}
    >
      <div className="border-b border-white/70 bg-[linear-gradient(90deg,rgba(225,69,140,0.18),rgba(255,255,255,0.52),rgba(255,199,223,0.82))]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]/78 md:px-10">
          <p>{shop.name} | UAE modest fashion studio</p>
          <p className="hidden md:block">{shop.highlights.join(" | ")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-3 md:px-10">
        <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
          <Link href="/" className="shrink-0">
            <span className="block font-serif text-3xl text-[var(--color-mocha-dark)] md:text-[2.1rem]">{shop.name}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/74">Naif Road, Deira | Dubai</span>
          </Link>

          <div className="space-y-4">
            <nav className="hidden items-center justify-center gap-3 xl:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold uppercase tracking-[0.12em] transition duration-300 ${
                    pathname === item.href
                      ? "border-white/90 bg-white text-[var(--color-mocha-dark)] shadow-[0_14px_32px_rgba(225,69,140,0.18)]"
                      : "border-transparent bg-white/44 text-[var(--color-ink)]/92 hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/92 hover:text-[var(--color-mocha-dark)] hover:shadow-[0_16px_34px_rgba(225,69,140,0.18)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="xl:px-12">
              <SearchForm className="w-full xl:ml-auto xl:max-w-[28rem]" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <AccountMenu />
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/96 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_14px_32px_rgba(225,69,140,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(225,69,140,0.2)]"
            >
              Cart
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-mocha)] px-2 text-xs text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/70 bg-white/64 px-4 py-3 xl:hidden">
        <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--color-ink)]/88 sm:grid-cols-3 md:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 transition duration-300 ${
                pathname === item.href
                  ? "bg-[var(--color-blush-strong)] text-[var(--color-mocha-dark)] shadow-[0_12px_26px_rgba(225,69,140,0.16)]"
                  : "bg-white/88 text-center hover:bg-white hover:text-[var(--color-mocha-dark)] hover:shadow-[0_14px_28px_rgba(225,69,140,0.16)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
