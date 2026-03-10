import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminShell } from "@/components/admin-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdminPage } from "@/lib/auth";
import { getAdminOrdersPage, getAdminProductsPage } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const [productsResult, ordersResult] = await Promise.all([
    getAdminProductsPage({ page: 1, pageSize: 10 }),
    getAdminOrdersPage({ page, pageSize: 10 }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <AdminShell
          activePath="/admin/orders"
          title="Order management"
          description="Track fulfillment, payment states, and customer order flow from one place."
          actions={<AdminLogoutButton />}
        >
          <AdminDashboard
            initialProducts={productsResult.items}
            initialOrders={ordersResult.items}
            ordersTotal={ordersResult.total}
            mode="orders"
          />
          <AdminPagination page={ordersResult.page} totalPages={ordersResult.totalPages} basePath="/admin/orders" />
        </AdminShell>
      </main>
      <SiteFooter />
    </div>
  );
}
