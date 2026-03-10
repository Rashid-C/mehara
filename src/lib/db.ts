import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Store, StoreSettings } from "@/lib/types";

let db: Database.Database | null = null;
let warnedAboutVercelStorage = false;

function getDataDir() {
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }

  if (process.env.VERCEL) {
    return path.join("/tmp", "mehara-data");
  }

  return path.join(process.cwd(), "data");
}

function getDbPath() {
  return path.join(getDataDir(), "mehara.db");
}

function getSeedStore() {
  const seedPath = path.join(process.cwd(), "src", "data", "store.json");
  const raw = readFileSync(seedPath, "utf8");
  return JSON.parse(raw) as Store;
}

function createTables(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      sizes TEXT NOT NULL,
      image TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      notes TEXT,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'COD',
      payment_status TEXT NOT NULL DEFAULT 'PENDING',
      payment_reference TEXT,
      user_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      image TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      size TEXT NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS store_settings (
      id TEXT PRIMARY KEY,
      tax_percentage REAL NOT NULL DEFAULT 0
    );
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_featured_created ON products(featured, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_products_category_name ON products(category, name);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_email_created ON orders(customer_email, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_status_payment ON orders(status, payment_status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}

function hasColumn(database: Database.Database, table: string, column: string) {
  const rows = database.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function ensureColumn(database: Database.Database, table: string, column: string, definition: string) {
  if (!hasColumn(database, table, column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function runMigrations(database: Database.Database) {
  ensureColumn(database, "orders", "customer_email", "TEXT");
  ensureColumn(database, "orders", "payment_method", "TEXT NOT NULL DEFAULT 'COD'");
  ensureColumn(database, "orders", "payment_status", "TEXT NOT NULL DEFAULT 'PENDING'");
  ensureColumn(database, "orders", "payment_reference", "TEXT");
  ensureColumn(database, "orders", "user_id", "TEXT");
}

function seedIfEmpty(database: Database.Database) {
  const productCount = database.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
  const settingsCount = database.prepare("SELECT COUNT(*) AS count FROM store_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    database.prepare("INSERT INTO store_settings (id, tax_percentage) VALUES ('default', @taxPercentage)").run({
      taxPercentage: 5,
    } satisfies StoreSettings);
  }

  if (productCount.count > 0) {
    return;
  }

  const seed = getSeedStore();
  const insertProduct = database.prepare(`
    INSERT INTO products (
      id, name, slug, category, price, stock, sizes, image, short_description, description, featured, created_at, updated_at
    ) VALUES (
      @id, @name, @slug, @category, @price, @stock, @sizes, @image, @shortDescription, @description, @featured, @createdAt, @updatedAt
    )
  `);
  const insertOrder = database.prepare(`
    INSERT INTO orders (
      id, customer_name, customer_email, customer_phone, shipping_address, notes, total_amount, status, payment_method, payment_status, payment_reference, user_id, created_at, updated_at
    ) VALUES (
      @id, @customerName, @customerEmail, @customerPhone, @shippingAddress, @notes, @totalAmount, @status, @paymentMethod, @paymentStatus, @paymentReference, @userId, @createdAt, @updatedAt
    )
  `);
  const insertOrderItem = database.prepare(`
    INSERT INTO order_items (
      id, order_id, product_id, product_name, quantity, unit_price, size
    ) VALUES (
      @id, @orderId, @productId, @productName, @quantity, @unitPrice, @size
    )
  `);

  const transaction = database.transaction(() => {
    for (const product of seed.products) {
      insertProduct.run({
        ...product,
        featured: product.featured ? 1 : 0,
      });
    }

    for (const order of seed.orders) {
      insertOrder.run({
        ...order,
        customerEmail: order.customerEmail ?? null,
        paymentMethod: order.paymentMethod ?? "COD",
        paymentStatus: order.paymentStatus ?? "PENDING",
        paymentReference: order.paymentReference ?? null,
        userId: null,
      });

      for (const item of order.items) {
        insertOrderItem.run(item);
      }
    }
  });

  transaction();
}

function openDatabase() {
  if (db) {
    return db;
  }

  const dataDir = getDataDir();
  const dbPath = getDbPath();

  if (process.env.VERCEL && !warnedAboutVercelStorage) {
    warnedAboutVercelStorage = true;
    console.warn(
      "Mehara is using temporary SQLite storage on Vercel (/tmp). Orders, users, and product changes will not persist between deployments or cold starts.",
    );
  }

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("temp_store = MEMORY");
  createTables(db);
  runMigrations(db);
  seedIfEmpty(db);
  return db;
}

export function getDb() {
  return openDatabase();
}

export function createId(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}
