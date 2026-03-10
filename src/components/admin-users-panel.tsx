import { User } from "@/lib/types";

export function AdminUsersPanel({ users, total }: { users: User[]; total?: number }) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Users</p>
        <h2 className="mt-2 font-serif text-3xl">{total ?? users.length} customer accounts</h2>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <article key={user.id} className="rounded-[1.5rem] border border-[var(--color-sand)] p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">{user.email}</p>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mocha)]">{user.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
