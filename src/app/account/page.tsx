import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/auth";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrdersByCustomerEmail } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const orders = await getOrdersByCustomerEmail(session.user.email);
  const latestOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal className="rounded-[1.75rem] surface-glass p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Account</p>
            <h1 className="mt-3 font-serif text-4xl">{session.user.name}</h1>
            <p className="mt-3 text-[var(--color-muted)]">{session.user.email}</p>
            <div className="mt-8 space-y-3">
              <Link href="/account/orders" className="btn-secondary block px-4 py-3 text-center font-semibold">
                View full order history
              </Link>
              <Link href="/collection" className="btn-secondary block px-4 py-3 text-center font-semibold">
                Continue shopping
              </Link>
            </div>
          </Reveal>

          <Reveal className="rounded-[1.75rem] surface-solid p-8" delay={0.08}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Recent Orders</p>
                <h2 className="mt-2 font-serif text-3xl">{orders.length} total orders</h2>
              </div>
              <Link href="/account/orders" className="text-sm font-semibold text-[var(--color-mocha)]">
                Open orders page
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {latestOrders.length === 0 ? (
                <p className="text-[var(--color-muted)]">No orders yet. Start with the newest arrivals.</p>
              ) : (
                latestOrders.map((order) => (
                  <article key={order.id} className="rounded-[1.5rem] ring-soft bg-white/78 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {order.status} | {order.paymentStatus} | {order.items.length} items
                        </p>
                      </div>
                      <p className="font-semibold text-[var(--color-mocha)]">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
