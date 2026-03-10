import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { developer } from "@/lib/developer";
import { shop } from "@/lib/shop";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-6">
          <Reveal className="rounded-[2rem] surface-glass p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">About {shop.name}</p>
            <h1 className="mt-4 font-serif text-5xl">A Deira, Dubai modestwear shop built around real retail and tailoring service.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
              {shop.name} operates near Molina Shop No. 02, Naif Road, Deira, Dubai - U.A.E. Through {shop.legalName}, the
              store serves customers looking for abaya, hijab, shawl, ladies accessories, tailoring support, and both wholesale
              and retail service. The website now reflects the actual business identity rather than placeholder boutique copy.
            </p>
          </Reveal>

          <Reveal className="rounded-[2rem] surface-solid p-10" delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Developer Credit</p>
            <h2 className="mt-4 font-serif text-4xl">Professionally designed and developed by {developer.name}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
              This ecommerce experience, admin workflow, customer account system, and responsive storefront implementation were
              created with professional full-stack development support for the Mehar Pardha brand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={developer.website} className="btn-primary px-5 py-3 text-sm font-semibold">
                Website
              </Link>
              <Link href={developer.linkedin} className="btn-secondary px-5 py-3 text-sm font-semibold">
                LinkedIn
              </Link>
              <Link href={developer.github} className="btn-secondary px-5 py-3 text-sm font-semibold">
                GitHub
              </Link>
              <Link href={developer.instagram} className="btn-secondary px-5 py-3 text-sm font-semibold">
                Instagram
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
