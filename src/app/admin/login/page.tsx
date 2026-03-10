import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isAdminAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Admin Login | Mehara",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Admin Access</p>
          <h1 className="font-serif text-4xl">Secure catalog and order operations</h1>
          <p className="max-w-xl text-base leading-8 text-[var(--color-muted)]">
            Sign in to manage products, update order progress, and confirm payment status. The current setup uses an
            HTTP-only session cookie with credentials from the local environment file.
          </p>
          <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-white p-5 text-sm text-[var(--color-muted)]">
            <p>Default local admin email: `admin@mehara.local`</p>
            <p className="mt-2">Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in `.env` before deployment.</p>
          </div>
          <Link href="/" className="inline-flex text-sm font-semibold text-[var(--color-mocha)]">
            Back to storefront
          </Link>
        </section>
        <AdminLoginForm />
      </main>
      <SiteFooter />
    </div>
  );
}
