import { formatCurrency } from "@/lib/format";

type MonthlyPoint = {
  label: string;
  sales: number;
  orders: number;
};

export function AdminOverviewCharts({
  monthlySales,
  totalSales,
  paidSales,
  unpaidSales,
}: {
  monthlySales: MonthlyPoint[];
  totalSales: number;
  paidSales: number;
  unpaidSales: number;
}) {
  const maxSales = Math.max(...monthlySales.map((item) => item.sales), 1);
  const paidPct = totalSales > 0 ? Math.round((paidSales / totalSales) * 100) : 0;
  const unpaidPct = totalSales > 0 ? Math.round((unpaidSales / totalSales) * 100) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Sales Overview</p>
            <h2 className="mt-2 font-serif text-3xl">Monthly sales bars</h2>
          </div>
          <p className="text-sm font-semibold text-[var(--color-mocha)]">{formatCurrency(totalSales)} total</p>
        </div>
        <div className="grid h-72 grid-cols-6 items-end gap-4">
          {monthlySales.map((item) => (
            <div key={item.label} className="flex h-full flex-col justify-end gap-3">
              <div className="text-center text-xs font-semibold text-[var(--color-muted)]">{item.orders} ord</div>
              <div
                className="rounded-t-[1rem] bg-[linear-gradient(180deg,#f9a8d4,#d64c8b)]"
                style={{ height: `${Math.max(16, (item.sales / maxSales) * 180)}px` }}
              />
              <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <CircularCard title="Paid Sales" amount={formatCurrency(paidSales)} percent={paidPct} color="#d64c8b" />
        <CircularCard title="Awaiting / Unpaid" amount={formatCurrency(unpaidSales)} percent={unpaidPct} color="#f472b6" />
      </section>
    </div>
  );
}

function CircularCard({
  title,
  amount,
  percent,
  color,
}: {
  title: string;
  amount: string;
  percent: number;
  color: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{title}</p>
      <div className="mt-6 flex items-center gap-6">
        <div
          className="grid h-32 w-32 place-items-center rounded-full"
          style={{
            background: `conic-gradient(${color} 0 ${percent}%, #fdebf3 ${percent}% 100%)`,
          }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-lg font-semibold text-[var(--color-ink)]">
            {percent}%
          </div>
        </div>
        <div>
          <p className="font-serif text-3xl">{amount}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Visual share of total sales value in the current admin data set.</p>
        </div>
      </div>
    </article>
  );
}
