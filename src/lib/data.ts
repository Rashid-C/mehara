import { CartItem } from "@/components/cart-provider";
import { createId, getDb } from "@/lib/db";
import { Order, OrderItem, PaymentMethod, PaymentStatus, Product, StoreSettings, User } from "@/lib/types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  sizes: string;
  image: string;
  short_description: string;
  description: string;
  featured: number;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  shipping_address: string;
  notes: string | null;
  total_amount: number;
  status: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  size: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  image: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: row.price,
    stock: row.stock,
    sizes: row.sizes,
    image: row.image,
    shortDescription: row.short_description,
    description: row.description,
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    size: row.size,
  };
}

function mapOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    notes: row.notes,
    totalAmount: row.total_amount,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProducts() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM products ORDER BY featured DESC, datetime(created_at) DESC, name ASC")
    .all() as ProductRow[];
  return rows.map(mapProduct);
}

export async function getAdminProductsPage(input: { page?: number; pageSize?: number }) {
  const db = getDb();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const totalRow = db.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const rows = db
    .prepare("SELECT * FROM products ORDER BY featured DESC, datetime(created_at) DESC, name ASC LIMIT ? OFFSET ?")
    .all(pageSize, offset) as ProductRow[];

  return {
    items: rows.map(mapProduct),
    total,
    totalPages,
    page: safePage,
  };
}

export async function getCatalogProducts(input: {
  q?: string;
  category?: string;
  size?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  const db = getDb();
  const q = input.q?.trim().toLowerCase() ?? "";
  const category = input.category && input.category !== "all" ? input.category : null;
  const size = input.size && input.size !== "all" ? input.size : null;
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, input.pageSize ?? 12));

  const where: string[] = [];
  const values: Array<string | number> = [];

  if (q) {
    where.push("(lower(name) LIKE ? OR lower(category) LIKE ? OR lower(short_description) LIKE ? OR lower(description) LIKE ?)");
    const pattern = `%${q}%`;
    values.push(pattern, pattern, pattern, pattern);
  }

  if (category) {
    where.push("category = ?");
    values.push(category);
  }

  if (size) {
    where.push("sizes LIKE ?");
    values.push(`%${size}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  const orderBy =
    input.sort === "price-asc"
      ? "ORDER BY price ASC, name ASC"
      : input.sort === "price-desc"
        ? "ORDER BY price DESC, name ASC"
        : input.sort === "name"
          ? "ORDER BY name ASC"
          : "ORDER BY featured DESC, datetime(created_at) DESC, name ASC";

  const totalRow = db.prepare(`SELECT COUNT(*) AS count FROM products ${whereClause}`).get(...values) as { count: number };
  const total = totalRow.count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;

  const rows = db
    .prepare(`SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`)
    .all(...values, pageSize, offset) as ProductRow[];

  return {
    products: rows.map(mapProduct),
    total,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export async function getFeaturedProducts() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM products WHERE featured = 1 ORDER BY datetime(created_at) DESC LIMIT 4")
    .all() as ProductRow[];
  return rows.map(mapProduct);
}

export async function getStoreSettings() {
  const db = getDb();
  const row = db.prepare("SELECT tax_percentage FROM store_settings WHERE id = 'default'").get() as
    | { tax_percentage: number }
    | undefined;

  return {
    taxPercentage: row?.tax_percentage ?? 0,
  } satisfies StoreSettings;
}

export async function updateStoreSettings(input: StoreSettings) {
  const db = getDb();
  db.prepare("INSERT INTO store_settings (id, tax_percentage) VALUES ('default', ?) ON CONFLICT(id) DO UPDATE SET tax_percentage = excluded.tax_percentage").run(
    input.taxPercentage,
  );

  return getStoreSettings();
}

export async function getProductBySlug(slug: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}

export async function getOrders() {
  const db = getDb();
  const orderRows = db.prepare("SELECT * FROM orders ORDER BY datetime(created_at) DESC").all() as OrderRow[];
  const itemRows = db.prepare("SELECT * FROM order_items ORDER BY rowid DESC").all() as OrderItemRow[];

  return orderRows.map((row) =>
    mapOrder(
      row,
      itemRows.filter((item) => item.order_id === row.id).map(mapOrderItem),
    ),
  );
}

export async function getAdminOrdersPage(input: { page?: number; pageSize?: number }) {
  const db = getDb();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const totalRow = db.prepare("SELECT COUNT(*) AS count FROM orders").get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const orderRows = db
    .prepare("SELECT * FROM orders ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?")
    .all(pageSize, offset) as OrderRow[];
  const orderIds = orderRows.map((row) => row.id);
  const itemRows =
    orderIds.length > 0
      ? (db
          .prepare(`SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => "?").join(",")}) ORDER BY rowid DESC`)
          .all(...orderIds) as OrderItemRow[])
      : [];

  return {
    items: orderRows.map((row) =>
      mapOrder(
        row,
        itemRows.filter((item) => item.order_id === row.id).map(mapOrderItem),
      ),
    ),
    total,
    totalPages,
    page: safePage,
  };
}

export async function getOrdersByCustomerEmail(email: string) {
  const db = getDb();
  const orderRows = db
    .prepare("SELECT * FROM orders WHERE customer_email = ? ORDER BY datetime(created_at) DESC")
    .all(email) as OrderRow[];
  const itemRows = db.prepare("SELECT * FROM order_items ORDER BY rowid DESC").all() as OrderItemRow[];

  return orderRows.map((row) =>
    mapOrder(
      row,
      itemRows.filter((item) => item.order_id === row.id).map(mapOrderItem),
    ),
  );
}

export async function getUsers() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM users ORDER BY datetime(created_at) DESC").all() as UserRow[];
  return rows.map(mapUser);
}

export async function getAdminUsersPage(input: { page?: number; pageSize?: number }) {
  const db = getDb();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const totalRow = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  const total = totalRow.count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const rows = db
    .prepare("SELECT * FROM users ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?")
    .all(pageSize, offset) as UserRow[];

  return {
    items: rows.map(mapUser),
    total,
    totalPages,
    page: safePage,
  };
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  return row
    ? {
        user: mapUser(row),
        passwordHash: row.password_hash,
      }
    : null;
}

export async function createUser(input: { name: string; email: string; passwordHash: string; image?: string | null }) {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const user: User = {
    id: createId("user"),
    name: input.name,
    email: input.email.toLowerCase(),
    image: input.image ?? null,
    role: "customer",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, image, role, created_at, updated_at)
    VALUES (@id, @name, @email, @passwordHash, @image, @role, @createdAt, @updatedAt)
  `).run({
    ...user,
    passwordHash: input.passwordHash,
  });

  return user;
}

export async function upsertOAuthUser(input: { name: string; email: string; image?: string | null }) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(input.email.toLowerCase()) as UserRow | undefined;
  const timestamp = new Date().toISOString();

  if (existing) {
    db.prepare("UPDATE users SET name = ?, image = ?, updated_at = ? WHERE id = ?").run(
      input.name,
      input.image ?? existing.image,
      timestamp,
      existing.id,
    );

    return mapUser({
      ...existing,
      name: input.name,
      image: input.image ?? existing.image,
      updated_at: timestamp,
    });
  }

  const user: User = {
    id: createId("user"),
    name: input.name,
    email: input.email.toLowerCase(),
    image: input.image ?? null,
    role: "customer",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, image, role, created_at, updated_at)
    VALUES (@id, @name, @email, NULL, @image, @role, @createdAt, @updatedAt)
  `).run(user);

  return user;
}

export async function createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const product: Product = {
    id: createId("prod"),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };

  db.prepare(`
    INSERT INTO products (
      id, name, slug, category, price, stock, sizes, image, short_description, description, featured, created_at, updated_at
    ) VALUES (
      @id, @name, @slug, @category, @price, @stock, @sizes, @image, @shortDescription, @description, @featured, @createdAt, @updatedAt
    )
  `).run({
    ...product,
    featured: product.featured ? 1 : 0,
  });

  return product;
}

export async function updateProduct(id: string, input: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;

  if (!existing) {
    return null;
  }

  const product: Product = {
    id,
    createdAt: existing.created_at,
    updatedAt: new Date().toISOString(),
    ...input,
  };

  db.prepare(`
    UPDATE products
    SET
      name = @name,
      slug = @slug,
      category = @category,
      price = @price,
      stock = @stock,
      sizes = @sizes,
      image = @image,
      short_description = @shortDescription,
      description = @description,
      featured = @featured,
      updated_at = @updatedAt
    WHERE id = @id
  `).run({
    ...product,
    featured: product.featured ? 1 : 0,
  });

  return product;
}

export async function deleteProduct(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  if (!row) {
    return null;
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return mapProduct(row);
}

export async function createOrder(input: {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: string;
  notes: string | null;
  paymentMethod: PaymentMethod;
  paymentReference: string | null;
  items: CartItem[];
}) {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const orderId = createId("order");
  const paymentStatus: PaymentStatus = input.paymentMethod === "COD" ? "PENDING" : "AWAITING_PAYMENT";
  const items: OrderItem[] = input.items.map((item) => ({
    id: createId("item"),
    orderId,
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    size: item.size,
  }));
  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const transaction = db.transaction(() => {
    db.prepare(`
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, shipping_address, notes, total_amount, status, payment_method, payment_status, payment_reference, created_at, updated_at
      ) VALUES (
        @id, @customerName, @customerEmail, @customerPhone, @shippingAddress, @notes, @totalAmount, @status, @paymentMethod, @paymentStatus, @paymentReference, @createdAt, @updatedAt
      )
    `).run({
      id: orderId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      totalAmount,
      status: "PENDING",
      paymentMethod: input.paymentMethod,
      paymentStatus,
      paymentReference: input.paymentReference,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const statement = db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, quantity, unit_price, size
      ) VALUES (
        @id, @orderId, @productId, @productName, @quantity, @unitPrice, @size
      )
    `);

    for (const item of items) {
      statement.run({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        size: item.size,
      });
    }
  });

  transaction();

  return {
    id: orderId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    notes: input.notes,
    totalAmount,
    status: "PENDING",
    paymentMethod: input.paymentMethod,
    paymentStatus,
    paymentReference: input.paymentReference,
    createdAt: timestamp,
    updatedAt: timestamp,
    items,
  } satisfies Order;
}

export async function updateOrderStatus(id: string, status: string, paymentStatus?: PaymentStatus) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;

  if (!existing) {
    return null;
  }

  const nextPaymentStatus = paymentStatus ?? existing.payment_status;
  const updatedAt = new Date().toISOString();

  db.prepare("UPDATE orders SET status = ?, payment_status = ?, updated_at = ? WHERE id = ?").run(
    status,
    nextPaymentStatus,
    updatedAt,
    id,
  );

  const itemRows = db.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid DESC").all(id) as OrderItemRow[];

  return mapOrder(
    {
      ...existing,
      status,
      payment_status: nextPaymentStatus,
      updated_at: updatedAt,
    },
    itemRows.map(mapOrderItem),
  );
}
