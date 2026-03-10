import { redirect } from "next/navigation";
import { getCustomerSession } from "@/auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrdersByCustomerEmail } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getCustomerSession();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const orders = await getOrdersByCustomerEmail(session.user.email);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Order History</p>
          <h1 className="mt-3 font-serif text-4xl">Your Mehara Pardha orders</h1>
        </div>
        <div className="space-y-5">
          {orders.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 text-[var(--color-muted)]">
              No orders yet.
            </div>
          ) : (
            orders.map((order) => (
              <article key={order.id} className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl">{order.id}</h2>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {order.status} · {order.paymentStatus} · {order.paymentMethod}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[var(--color-mocha)]">{formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="mt-5 space-y-2 text-sm text-[var(--color-muted)]">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.productName} · {item.quantity} x {item.size}
                    </p>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
