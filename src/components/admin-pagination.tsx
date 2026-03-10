import Link from "next/link";

export function AdminPagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between rounded-[1.25rem] border border-[var(--color-sand)] bg-white/80 px-4 py-3 text-sm">
      <Link
        href={`${basePath}?page=${Math.max(1, page - 1)}`}
        className={page === 1 ? "pointer-events-none text-[var(--color-muted)]/50" : "font-semibold text-[var(--color-mocha)]"}
      >
        Previous
      </Link>
      <p className="text-[var(--color-muted)]">
        Page {page} of {totalPages}
      </p>
      <Link
        href={`${basePath}?page=${Math.min(totalPages, page + 1)}`}
        className={page === totalPages ? "pointer-events-none text-[var(--color-muted)]/50" : "font-semibold text-[var(--color-mocha)]"}
      >
        Next
      </Link>
    </div>
  );
}
