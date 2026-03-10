import Link from "next/link";

const sections = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export function AdminShell({
  title,
  description,
  activePath,
  actions,
  children,
}: {
  title: string;
  description: string;
  activePath: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[0.24fr_1fr]">
      <aside className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Admin Navigation</p>
        <nav className="mt-5 space-y-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-semibold ${
                activePath === section.href ? "bg-[var(--color-mocha)] text-white" : "border border-[var(--color-sand)] text-[var(--color-ink)]"
              }`}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Admin</p>
            <h1 className="mt-3 font-serif text-4xl">{title}</h1>
            <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </section>
    </div>
  );
}
