import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/data";
import { shop } from "@/lib/shop";

export const metadata = {
  title: "Collection | Mehar Pardha",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    size?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function CollectionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").toLowerCase().trim();
  const category = params.category ?? "all";
  const size = params.size ?? "all";
  const sort = params.sort ?? "featured";
  const currentPage = Math.max(1, Number(params.page ?? "1"));
  const { products: paginated, total, totalPages, page } = await getCatalogProducts({
    q: query || undefined,
    category,
    size,
    sort,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });
  const categories = ["Abaya", "Pardha", "Women Dress"];
  const sizes = ["S", "M", "L", "XL", "XXL", "Free Size"];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <section className="rounded-[2rem] border border-[var(--color-sand)] bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(253,235,243,0.92))] p-8 shadow-[0_28px_70px_rgba(214,76,139,0.1)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">{shop.name} Collection</p>
          <h1 className="mt-3 font-serif text-5xl">Shop abayas, pardha, and modest dresses in premium pink boutique style</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
            Search, sort, filter by category and size, then browse polished paginated listings designed for women, girls,
            and family shoppers.
          </p>
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.36fr_1fr]">
          <aside className="glass-pink rounded-[2rem] border border-white/80 p-6 shadow-[0_20px_50px_rgba(214,76,139,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Refine</p>
                <h2 className="mt-2 font-serif text-3xl">Premium filters</h2>
              </div>
              {(query || category !== "all" || size !== "all") ? (
                <Link href="/collection" className="text-sm font-semibold text-[var(--color-mocha)]">
                  Reset
                </Link>
              ) : null}
            </div>
            <form className="mt-6 space-y-5" action="/collection">
              <Field label="Search">
                <input
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Search styles..."
                  className="w-full rounded-2xl border border-white/80 bg-white/90 px-4 py-3"
                />
              </Field>
              <FilterChips name="category" label="Category" active={category} options={["all", ...categories]} />
              <FilterChips name="size" label="Size" active={size} options={["all", ...sizes]} />
              <Field label="Sort by">
                <select name="sort" defaultValue={sort} className="w-full rounded-2xl border border-white/80 bg-white/90 px-4 py-3">
                  <option value="featured">Featured first</option>
                  <option value="price-asc">Price low to high</option>
                  <option value="price-desc">Price high to low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </Field>
              <button className="w-full rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(214,76,139,0.18)]">
                Apply filters
              </button>
            </form>
          </aside>

          <section>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Results</p>
                <h2 className="mt-2 font-serif text-3xl">{total} styles found</h2>
              </div>
              <div className="rounded-full border border-[var(--color-sand)] bg-white/85 px-4 py-2 text-sm text-[var(--color-muted)]">
                Page {page} of {totalPages}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between rounded-[1.5rem] border border-[var(--color-sand)] bg-[linear-gradient(180deg,#ffffff_0%,#fff7fb_100%)] px-5 py-4 shadow-[0_14px_28px_rgba(214,76,139,0.08)]">
              <Link
                href={buildPageHref(params, Math.max(1, page - 1))}
                className={`text-sm font-semibold ${page === 1 ? "pointer-events-none text-[var(--color-muted)]/50" : "text-[var(--color-mocha)]"}`}
              >
                Previous
              </Link>
              <p className="text-sm text-[var(--color-muted)]">
                Page {page} of {totalPages}
              </p>
              <Link
                href={buildPageHref(params, Math.min(totalPages, page + 1))}
                className={`text-sm font-semibold ${page === totalPages ? "pointer-events-none text-[var(--color-muted)]/50" : "text-[var(--color-mocha)]"}`}
              >
                Next
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function FilterChips({
  name,
  label,
  options,
  active,
}: {
  name: string;
  label: string;
  options: string[];
  active: string;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === option ? "border-[var(--color-mocha)] bg-white text-[var(--color-mocha)]" : "border-white/80 bg-white/70 text-[var(--color-muted)]"
            }`}
          >
            <input type="radio" name={name} value={option} defaultChecked={active === option} className="sr-only" />
            {option === "all" ? `All ${label}` : option}
          </label>
        ))}
      </div>
    </div>
  );
}

function buildPageHref(
  params: { q?: string; category?: string; size?: string; sort?: string; page?: string },
  page: number,
) {
  const next = new URLSearchParams();
  if (params.q) next.set("q", params.q);
  if (params.category) next.set("category", params.category);
  if (params.size) next.set("size", params.size);
  if (params.sort) next.set("sort", params.sort);
  next.set("page", String(page));
  return `/collection?${next.toString()}`;
}
