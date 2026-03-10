"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";
import { PaymentMethod } from "@/lib/types";

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  subtitle: string;
  badge: string;
}> = [
  {
    value: "STRIPE",
    label: "Stripe",
    subtitle: "Card payments and modern checkout flow. UI is ready; connect live Stripe keys next.",
    badge: "Card Gateway",
  },
  {
    value: "PAYPAL",
    label: "PayPal",
    subtitle: "Pay with PayPal balance or linked cards. UI option is ready for integration.",
    badge: "Wallet",
  },
  {
    value: "RAZORPAY",
    label: "Razorpay",
    subtitle: "Popular for regional card and UPI-style payment flows. UI option is ready for integration.",
    badge: "Regional Gateway",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    subtitle: "Send a transfer reference and let admin verify payment before shipping.",
    badge: "Manual Verify",
  },
  {
    value: "PAYMENT_LINK",
    label: "Payment Link",
    subtitle: "Your team can send a payment link after order review and confirmation.",
    badge: "Manual Link",
  },
  {
    value: "COD",
    label: "Cash on Delivery",
    subtitle: "Order first, pay when the order reaches you.",
    badge: "Offline",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
  const [taxPercentage, setTaxPercentage] = useState(0);

  useEffect(() => {
    fetch("/api/store-settings")
      .then((response) => response.json())
      .then((data) => setTaxPercentage(Number(data.taxPercentage) || 0))
      .catch(() => setTaxPercentage(0));
  }, []);

  const taxAmount = Math.round(total * (taxPercentage / 100));
  const grandTotal = total + taxAmount;
  const paymentMeta = paymentOptions.find((option) => option.value === paymentMethod);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      shippingAddress: formData.get("shippingAddress"),
      notes: formData.get("notes"),
      paymentMethod,
      paymentReference: formData.get("paymentReference"),
      items,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Order submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1fr_0.46fr]">
        <section className="space-y-8">
          <div className="rounded-[2rem] border border-[var(--color-sand)] bg-[linear-gradient(145deg,#fffefe_0%,#fff2f8_62%,#fde7f1_100%)] p-8 shadow-[0_24px_70px_rgba(214,76,139,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Checkout</p>
            <h1 className="mt-3 font-serif text-5xl">Complete your order with a cleaner contact and payment flow</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)]">
              Fill delivery details, choose your preferred payment option, and review the final amount before confirming the order.
            </p>
          </div>

          <form className="grid gap-8" onSubmit={handleSubmit}>
            <section className="glass-pink rounded-[2rem] border border-white/80 p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">Contact Details</p>
                <h2 className="mt-2 font-serif text-3xl">Delivery and contact information</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Customer name" name="customerName" required defaultValue={session?.user?.name ?? ""} />
                <Input label="Email" name="customerEmail" type="email" defaultValue={session?.user?.email ?? ""} />
                <Input label="Phone number" name="customerPhone" required />
                <div className="md:col-span-2">
                  <TextArea label="Shipping address" name="shippingAddress" rows={4} required />
                </div>
                <div className="md:col-span-2">
                  <TextArea label="Notes" name="notes" rows={3} />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">Payment</p>
                <h2 className="mt-2 font-serif text-3xl">Choose how you want to pay</h2>
              </div>
              <div className="grid gap-4">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`rounded-[1.5rem] border p-5 transition ${
                      paymentMethod === option.value
                        ? "border-[var(--color-mocha)] bg-[var(--color-blush)]/60 shadow-[0_16px_36px_rgba(214,76,139,0.12)]"
                        : "border-[var(--color-sand)] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-semibold">{option.label}</span>
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-mocha)]">
                            {option.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{option.subtitle}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod !== "COD" ? (
                <div className="mt-5">
                  <Input
                    label={
                      paymentMethod === "BANK_TRANSFER"
                        ? "Transfer reference"
                        : paymentMethod === "PAYMENT_LINK"
                          ? "Preferred payment note"
                          : `${paymentMeta?.label ?? "Gateway"} reference`
                    }
                    name="paymentReference"
                    placeholder={
                      paymentMethod === "BANK_TRANSFER"
                        ? "Txn / receipt number"
                        : paymentMethod === "PAYMENT_LINK"
                          ? "WhatsApp or payment note"
                          : "Optional transaction or customer note"
                    }
                  />
                </div>
              ) : null}

              <div className="mt-5 rounded-[1.5rem] bg-[var(--color-blush)]/45 p-5 text-sm leading-7 text-[var(--color-muted)]">
                Selected payment design: <span className="font-semibold text-[var(--color-ink)]">{paymentMeta?.label}</span>. Live gateway capture is not wired yet, but the order flow and UI are ready for Stripe, PayPal, or Razorpay integration.
              </div>
            </section>

            {message ? <p className="text-sm text-red-600">{message}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-fit rounded-full bg-[var(--color-mocha)] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(214,76,139,0.18)] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Place order"}
            </button>
          </form>
        </section>

        <aside className="glass-pink h-fit rounded-[2rem] border border-white/80 p-8 shadow-[0_20px_50px_rgba(214,76,139,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Order summary</p>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-[var(--color-muted)]">
                    {item.quantity} x {item.size}
                  </p>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3 border-t border-[var(--color-sand)] pt-4">
            <Line label="Subtotal" value={formatCurrency(total)} />
            <Line label={`Tax (${taxPercentage}%)`} value={formatCurrency(taxAmount)} />
            <Line label="Total" value={formatCurrency(grandTotal)} strong />
          </div>
          <div className="mt-5 rounded-[1.5rem] bg-white/85 p-5 text-sm leading-7 text-[var(--color-muted)]">
            Preferred gateway: <span className="font-semibold text-[var(--color-ink)]">{paymentMeta?.label}</span>
            <br />
            This selection is stored with the order so admin can track the intended payment route.
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--color-sand)] bg-white/88 px-4 py-3 outline-none transition focus:border-[var(--color-mocha)]"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  rows,
  required,
}: {
  label: string;
  name: string;
  rows: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="w-full rounded-2xl border border-[var(--color-sand)] bg-white/88 px-4 py-3 outline-none transition focus:border-[var(--color-mocha)]"
      />
    </label>
  );
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-lg font-semibold" : "text-sm"}`}>
      <span>{label}</span>
      <span className={strong ? "text-[var(--color-mocha)]" : ""}>{value}</span>
    </div>
  );
}
