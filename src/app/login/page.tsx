import { redirect } from "next/navigation";
import { getCustomerSession } from "@/auth";
import { AuthCard } from "@/components/auth-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default async function LoginPage() {
  const session = await getCustomerSession();
  if (session?.user) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--color-sand)] bg-[linear-gradient(145deg,#fffefe_0%,#fff2f8_58%,#fde7f1_100%)] p-8 shadow-[0_24px_70px_rgba(214,76,139,0.08)]">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(243,141,183,0.18),_transparent_72%)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Customer Account</p>
          <h1 className="mt-3 font-serif text-4xl">Sign in with protected access and a smooth boutique account experience</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--color-muted)]">
            {`Mehar Pardha customer accounts keep your order history in one place and make future checkout faster across your
            UAE shopping sessions.`}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <AuthPoint title="Order history" copy="Track previous purchases in one place." />
            <AuthPoint title="Faster checkout" copy="Reuse your account for a quicker buying flow." />
          </div>
        </section>
        <AuthCard mode="login" googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
      </main>
      <SiteFooter />
    </div>
  );
}

function AuthPoint({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-5 shadow-[0_12px_28px_rgba(214,76,139,0.08)]">
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{copy}</p>
    </div>
  );
}
