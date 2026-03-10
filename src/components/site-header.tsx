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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <span className="block font-serif text-3xl text-[var(--color-mocha-dark)] md:text-[2.1rem]">{shop.name}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/74">Naif Road, Deira | Dubai</span>
          </Link>

          <div className="space-y-4">
            <nav className="hidden items-center justify-center gap-3 xl:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold uppercase tracking-[0.12em] transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] ${
                    pathname === item.href
                      ? "border-[rgba(125,23,71,0.18)] bg-[linear-gradient(180deg,#ffffff,#ffe3ef)] text-[var(--color-mocha-deep)] shadow-[0_14px_32px_rgba(225,69,140,0.2)]"
                      : "border-[rgba(181,31,101,0.08)] bg-[rgba(255,255,255,0.72)] text-[var(--color-mocha-deep)] hover:-translate-y-0.5 hover:border-[rgba(181,31,101,0.18)] hover:bg-white hover:text-[var(--color-mocha-deep)] hover:shadow-[0_16px_34px_rgba(225,69,140,0.18)]"
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

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(181,31,101,0.14)] bg-white/96 text-[var(--color-mocha-deep)] shadow-[0_14px_32px_rgba(225,69,140,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(225,69,140,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] xl:hidden"
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
            <div className="hidden xl:block">
              <AccountMenu />
            </div>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(181,31,101,0.14)] bg-white/96 px-3 py-2.5 text-sm font-semibold text-[var(--color-mocha-deep)] shadow-[0_14px_32px_rgba(225,69,140,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(225,69,140,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] sm:px-4"
            >
              Cart
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-mocha)] px-2 text-xs text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/70 bg-white/68 transition-all duration-300 xl:hidden ${
          mobileMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-[1.1rem] border px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] ${
                  pathname === item.href
                    ? "border-[rgba(125,23,71,0.16)] bg-[linear-gradient(180deg,#fff5fa,#ffd8e8)] text-[var(--color-mocha-deep)] shadow-[0_12px_26px_rgba(225,69,140,0.18)]"
                    : "border-[rgba(181,31,101,0.08)] bg-white/92 text-[var(--color-mocha-deep)] hover:bg-white hover:text-[var(--color-mocha-deep)] hover:shadow-[0_14px_28px_rgba(225,69,140,0.16)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[rgba(181,31,101,0.1)] pt-4">
            <AccountMenu mobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
