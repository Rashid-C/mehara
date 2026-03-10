import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminShell } from "@/components/admin-shell";
import { AdminUsersPanel } from "@/components/admin-users-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdminPage } from "@/lib/auth";
import { getAdminUsersPage } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const usersResult = await getAdminUsersPage({ page, pageSize: 10 });

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <AdminShell
          activePath="/admin/users"
          title="Customer accounts"
          description="Review the growing customer account base and who is using Mehara Pardha."
          actions={<AdminLogoutButton />}
        >
          <AdminUsersPanel users={usersResult.items} total={usersResult.total} />
          <AdminPagination page={usersResult.page} totalPages={usersResult.totalPages} basePath="/admin/users" />
        </AdminShell>
      </main>
      <SiteFooter />
    </div>
  );
}
