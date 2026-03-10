import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminShell } from "@/components/admin-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdminPage } from "@/lib/auth";
import { getAdminOrdersPage, getAdminProductsPage } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const [productsResult, ordersResult] = await Promise.all([
    getAdminProductsPage({ page, pageSize: 10 }),
    getAdminOrdersPage({ page: 1, pageSize: 10 }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <AdminShell
          activePath="/admin/products"
          title="Product management"
          description="Create, edit, restock, and update the storefront catalog."
          actions={<AdminLogoutButton />}
        >
          <AdminDashboard
            initialProducts={productsResult.items}
            initialOrders={ordersResult.items}
            productsTotal={productsResult.total}
            mode="products"
          />
          <AdminPagination page={productsResult.page} totalPages={productsResult.totalPages} basePath="/admin/products" />
        </AdminShell>
      </main>
      <SiteFooter />
    </div>
  );
}
