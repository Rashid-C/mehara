"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImageUpload } from "@/components/product-image-upload";
import { formatCurrency } from "@/lib/format";
import { Order, PaymentStatus, Product } from "@/lib/types";
import { slugify } from "@/lib/validation";

type Props = {
  initialProducts: Product[];
  initialOrders: Order[];
  productsTotal?: number;
  ordersTotal?: number;
  mode?: "all" | "products" | "orders";
};

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  category: "Abaya",
  price: "349",
  stock: "12",
  sizes: "S, M, L, XL",
  image: "",
  shortDescription: "",
  description: "",
  featured: true,
};

const starterForm = {
  ...emptyForm,
  shortDescription: "Premium modestwear tailored with fluid movement and understated elegance.",
  description:
    "Crafted for customers who prefer modest silhouettes with rich drape, polished finishing, and versatile styling from day to evening.",
};

export function AdminDashboard({
  initialProducts,
  initialOrders,
  productsTotal,
  ordersTotal,
  mode = "all",
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [form, setForm] = useState(starterForm);
  const [statusMessage, setStatusMessage] = useState("");

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.image) {
      setStatusMessage("Upload a product image before saving.");
      return;
    }

    const isEditing = Boolean(form.id);
    const endpoint = isEditing ? `/api/products/${form.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    if (!response.ok) {
      setStatusMessage("Product save failed.");
      return;
    }

    const product = await response.json();
    setProducts((current) =>
      isEditing ? current.map((entry) => (entry.id === product.id ? product : entry)) : [product, ...current],
    );
    setForm(starterForm);
    setStatusMessage(isEditing ? "Product updated." : "Product created.");
    router.refresh();
  }

  async function removeProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatusMessage("Product delete failed.");
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== id));
    setStatusMessage("Product removed.");
    router.refresh();
  }

  async function updateOrder(id: string, status: string, paymentStatus: PaymentStatus) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus }),
    });

    if (!response.ok) {
      setStatusMessage("Order update failed.");
      return;
    }

    const updated = await response.json();
    setOrders((current) => current.map((order) => (order.id === id ? updated : order)));
    setStatusMessage("Order updated.");
    router.refresh();
  }

  function generateSlug() {
    const nextSlug = slugify(form.name);
    setForm((current) => ({ ...current, slug: nextSlug }));
    setStatusMessage(nextSlug ? "Slug generated from product name." : "Enter a product name first.");
  }

  return (
    <div className={`grid gap-8 ${mode === "all" ? "xl:grid-cols-[0.95fr_1.05fr]" : ""}`}>
      {mode === "all" || mode === "products" ? (
        <section className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {form.id ? "Edit Product" : "Add Product"}
          </p>
          <form className="mt-6 grid gap-4" onSubmit={saveProduct}>
            <Input label="Product name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Slug</span>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="rounded-full border border-[var(--color-sand)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-mocha)]"
                >
                  Generate slug
                </button>
              </div>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
              >
                <option>Abaya</option>
                <option>Pardha</option>
                <option>Women Dress</option>
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Price (AED)" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
              <Input label="Stock" value={form.stock} onChange={(value) => setForm((current) => ({ ...current, stock: value }))} />
            </div>
            <Input label="Sizes" value={form.sizes} onChange={(value) => setForm((current) => ({ ...current, sizes: value }))} />
            <ProductImageUpload
              image={form.image}
              uploadThingEnabled={process.env.NEXT_PUBLIC_UPLOADTHING_ENABLED === "true"}
              localUploadEnabled={process.env.NEXT_PUBLIC_LOCAL_UPLOADS_ENABLED !== "false"}
              onUploaded={(url) => setForm((current) => ({ ...current, image: url }))}
              onRemove={() => setForm((current) => ({ ...current, image: "" }))}
            />
            <Input
              label="Short description"
              value={form.shortDescription}
              onChange={(value) => setForm((current) => ({ ...current, shortDescription: value }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
              />
              Feature on homepage
            </label>
            {statusMessage ? <p className="text-sm text-[var(--color-mocha)]">{statusMessage}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[var(--color-mocha)] px-5 py-3 text-sm font-semibold text-white">
                {form.id ? "Update product" : "Create product"}
              </button>
              <button
                type="button"
                onClick={() => setForm(starterForm)}
                className="rounded-full border border-[var(--color-sand)] px-5 py-3 text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {mode === "all" || mode === "products" || mode === "orders" ? (
        <section className="space-y-8">
          {mode === "all" || mode === "products" ? (
            <div className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Products</p>
                <h2 className="mt-2 font-serif text-3xl">{productsTotal ?? products.length} items</h2>
              </div>
              <div className="space-y-4">
                {products.map((product) => (
                  <article key={product.id} className="rounded-[1.5rem] border border-[var(--color-sand)] p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-20 w-20 rounded-[1.25rem] bg-cover bg-center"
                          style={{ backgroundImage: `url(${product.image})` }}
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{product.category}</p>
                          <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                          <p className="mt-2 text-sm text-[var(--color-muted)]">
                            {formatCurrency(product.price)} | Stock {product.stock}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              category: product.category,
                              price: String(product.price),
                              stock: String(product.stock),
                              sizes: product.sizes,
                              image: product.image,
                              shortDescription: product.shortDescription,
                              description: product.description,
                              featured: product.featured,
                            })
                          }
                          className="rounded-full border border-[var(--color-sand)] px-4 py-2 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "all" || mode === "orders" ? (
            <div className="rounded-[1.75rem] border border-[var(--color-sand)] bg-white p-8 shadow-[0_18px_50px_rgba(214,76,139,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Orders</p>
              <h2 className="mt-2 font-serif text-3xl">{ordersTotal ?? orders.length} orders</h2>
              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-[1.5rem] border border-[var(--color-sand)] p-5">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{order.customerName}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{order.customerPhone}</p>
                        <p className="text-sm text-[var(--color-muted)]">{order.shippingAddress}</p>
                        <p className="text-sm font-semibold text-[var(--color-mocha)]">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-sm text-[var(--color-muted)]">
                          Payment: {formatPaymentMethod(order.paymentMethod)} | {formatPaymentStatus(order.paymentStatus)}
                        </p>
                        {order.paymentReference ? <p className="text-sm text-[var(--color-muted)]">Reference: {order.paymentReference}</p> : null}
                        <ul className="space-y-1 text-sm text-[var(--color-muted)]">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.productName} | {item.quantity} x {item.size}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid min-w-52 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium">Order status</label>
                          <select
                            value={order.status}
                            onChange={(event) => updateOrder(order.id, event.target.value, order.paymentStatus)}
                            className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
                          >
                            <option>PENDING</option>
                            <option>CONFIRMED</option>
                            <option>SHIPPED</option>
                            <option>DELIVERED</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">Payment status</label>
                          <select
                            value={order.paymentStatus}
                            onChange={(event) => updateOrder(order.id, order.status, event.target.value as PaymentStatus)}
                            className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3"
                          >
                            <option>PENDING</option>
                            <option>AWAITING_PAYMENT</option>
                            <option>PAID</option>
                            <option>FAILED</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-[var(--color-sand)] px-4 py-3" />
    </label>
  );
}

function formatPaymentMethod(value: Order["paymentMethod"]) {
  if (value === "BANK_TRANSFER") {
    return "Bank Transfer";
  }
  if (value === "PAYMENT_LINK") {
    return "Payment Link";
  }
  if (value === "PAYPAL") {
    return "PayPal";
  }
  if (value === "STRIPE") {
    return "Stripe";
  }
  if (value === "RAZORPAY") {
    return "Razorpay";
  }
  return "Cash on Delivery";
}

function formatPaymentStatus(value: PaymentStatus) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
