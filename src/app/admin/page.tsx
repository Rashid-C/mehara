import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminOverviewCharts } from "@/components/admin-overview-charts";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminShell } from "@/components/admin-shell";
import { AdminTaxSettings } from "@/components/admin-tax-settings";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdminPage } from "@/lib/auth";
import { getOrders, getProducts, getStoreSettings, getUsers } from "@/lib/data";
import { PaymentStatus } from "@/lib/types";

export const metadata = {
  title: "Admin | Mehara",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminPage();
  const [products, orders, users, settings] = await Promise.all([getProducts(), getOrders(), getUsers(), getStoreSettings()]);
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidSales = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const unpaidSales = totalSales - paidSales;
  const monthlySales = getMonthlySales(orders);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <AdminShell
          activePath="/admin"
          title="Operations overview"
          description="A quick view of products, orders, and signed-up customers with direct navigation into focused admin pages."
          actions={<AdminLogoutButton />}
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/admin/products" className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-6 shadow-[0_18px_50px_rgba(84,58,46,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Products</p>
              <h2 className="mt-3 font-serif text-4xl">{products.length}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Manage catalog entries, images, sizes, and stock.</p>
            </Link>
            <Link href="/admin/orders" className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-6 shadow-[0_18px_50px_rgba(84,58,46,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Orders</p>
              <h2 className="mt-3 font-serif text-4xl">{orders.length}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Track status, payment progress, and fulfillment.</p>
            </Link>
            <Link href="/admin/users" className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-6 shadow-[0_18px_50px_rgba(84,58,46,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Users</p>
              <h2 className="mt-3 font-serif text-4xl">{users.length}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Review registered customer accounts.</p>
            </Link>
          </div>
          <AdminOverviewCharts
            monthlySales={monthlySales}
            totalSales={totalSales}
            paidSales={paidSales}
            unpaidSales={unpaidSales}
          />
          <AdminTaxSettings initialTaxPercentage={settings.taxPercentage} />
          <AdminDashboard initialProducts={products} initialOrders={orders} mode="all" />
        </AdminShell>
      </main>
      <SiteFooter />
    </div>
  );
}

function getMonthlySales(orders: Array<{ createdAt: string; totalAmount: number; paymentStatus: PaymentStatus }>) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short" });
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: formatter.format(date),
      sales: 0,
      orders: 0,
    };
  });

  for (const order of orders) {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const match = months.find((month) => month.key === key);
    if (match) {
      match.sales += order.totalAmount;
      match.orders += 1;
    }
  }

  return months.map(({ label, sales, orders }) => ({ label, sales, orders }));
}
