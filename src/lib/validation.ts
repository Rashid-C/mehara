import { PaymentMethod, PaymentStatus } from "@/lib/types";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const productCategories = new Set(["Abaya", "Pardha", "Women Dress"]);
const paymentMethods = new Set<PaymentMethod>(["COD", "BANK_TRANSFER", "PAYMENT_LINK", "PAYPAL", "STRIPE", "RAZORPAY"]);
const paymentStatuses = new Set<PaymentStatus>(["PENDING", "AWAITING_PAYMENT", "PAID", "FAILED"]);
const orderStatuses = new Set(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"]);

function asSafeString(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateProductInput(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const name = asSafeString(input.name, 140);
  const slug = slugify(asSafeString(input.slug || input.name, 160));
  const category = asSafeString(input.category, 40);
  const sizes = asSafeString(input.sizes, 120);
  const image = asSafeString(input.image, 2000);
  const shortDescription = asSafeString(input.shortDescription, 220);
  const description = asSafeString(input.description, 3000);
  const price = Number(input.price);
  const stock = Number(input.stock);

  if (!name || !slug || !productCategories.has(category)) {
    return { ok: false, error: "Invalid product name, slug, or category." } satisfies ValidationResult<never>;
  }

  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
    return { ok: false, error: "Product price must be a valid whole number." } satisfies ValidationResult<never>;
  }

  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
    return { ok: false, error: "Product stock must be a valid whole number." } satisfies ValidationResult<never>;
  }

  if (!sizes || !image || !shortDescription || !description) {
    return { ok: false, error: "Product details are incomplete." } satisfies ValidationResult<never>;
  }

  return {
    ok: true,
    data: {
      name,
      slug,
      category,
      price,
      stock,
      sizes,
      image,
      shortDescription,
      description,
      featured: Boolean(input.featured),
    },
  } satisfies ValidationResult<{
    name: string;
    slug: string;
    category: string;
    price: number;
    stock: number;
    sizes: string;
    image: string;
    shortDescription: string;
    description: string;
    featured: boolean;
  }>;
}

export function validateOrderInput(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const customerName = asSafeString(input.customerName, 120);
  const customerEmail = input.customerEmail ? asSafeString(input.customerEmail, 160).toLowerCase() : null;
  const customerPhone = asSafeString(input.customerPhone, 40);
  const shippingAddress = asSafeString(input.shippingAddress, 500);
  const notes = input.notes ? asSafeString(input.notes, 800) : null;
  const paymentMethod = asSafeString(input.paymentMethod, 40) as PaymentMethod;
  const paymentReference = input.paymentReference ? asSafeString(input.paymentReference, 200) : null;
  const items = Array.isArray(input.items) ? input.items : [];

  if (!customerName || !customerPhone || !shippingAddress) {
    return { ok: false, error: "Customer name, phone, and shipping address are required." } satisfies ValidationResult<never>;
  }

  if (customerEmail && !validateEmail(customerEmail)) {
    return { ok: false, error: "Customer email is invalid." } satisfies ValidationResult<never>;
  }

  if (!paymentMethods.has(paymentMethod)) {
    return { ok: false, error: "Payment method is invalid." } satisfies ValidationResult<never>;
  }

  if (items.length === 0) {
    return { ok: false, error: "Order items are required." } satisfies ValidationResult<never>;
  }

  const normalizedItems = items.map((item) => ({
    id: asSafeString((item as Record<string, unknown>).id, 120),
    name: asSafeString((item as Record<string, unknown>).name, 160),
    slug: asSafeString((item as Record<string, unknown>).slug, 180),
    category: asSafeString((item as Record<string, unknown>).category, 60),
    image: asSafeString((item as Record<string, unknown>).image, 2000),
    size: asSafeString((item as Record<string, unknown>).size, 40),
    quantity: Number((item as Record<string, unknown>).quantity),
    price: Number((item as Record<string, unknown>).price),
  }));

  const invalidItem = normalizedItems.find(
    (item) => !item.id || !item.name || !item.size || !Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isInteger(item.price) || item.price < 0,
  );

  if (invalidItem) {
    return { ok: false, error: "One or more order items are invalid." } satisfies ValidationResult<never>;
  }

  return {
    ok: true,
    data: {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      notes,
      paymentMethod,
      paymentReference,
      items: normalizedItems,
    },
  } satisfies ValidationResult<{
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    shippingAddress: string;
    notes: string | null;
    paymentMethod: PaymentMethod;
    paymentReference: string | null;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      category: string;
      image: string;
      size: string;
      quantity: number;
      price: number;
    }>;
  }>;
}

export function validateRegistrationInput(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const name = asSafeString(input.name, 120);
  const email = asSafeString(input.email, 160).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (!name || !validateEmail(email) || password.length < 8) {
    return { ok: false, error: "Invalid registration data." } satisfies ValidationResult<never>;
  }

  return { ok: true, data: { name, email, password } } satisfies ValidationResult<{ name: string; email: string; password: string }>;
}

export function validateOrderUpdateInput(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const status = asSafeString(input.status, 40);
  const paymentStatus = input.paymentStatus ? (asSafeString(input.paymentStatus, 40) as PaymentStatus) : undefined;

  if (!orderStatuses.has(status)) {
    return { ok: false, error: "Order status is invalid." } satisfies ValidationResult<never>;
  }

  if (paymentStatus && !paymentStatuses.has(paymentStatus)) {
    return { ok: false, error: "Payment status is invalid." } satisfies ValidationResult<never>;
  }

  return { ok: true, data: { status, paymentStatus } } satisfies ValidationResult<{ status: string; paymentStatus?: PaymentStatus }>;
}
