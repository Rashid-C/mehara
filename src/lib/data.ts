import { CartItem } from "@/components/cart-provider";
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderStatus as PrismaOrderStatus,
  Prisma,
  Product as PrismaProduct,
  User as PrismaUser,
} from "@/generated/prisma";
import { getPrisma } from "@/lib/prisma";
import { Order, OrderItem, PaymentMethod, PaymentStatus, Product, StoreSettings, User } from "@/lib/types";

type PrismaOrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

export class OrderCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderCreationError";
  }
}

function mapPrismaProduct(product: PrismaProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    stock: product.stock,
    sizes: product.sizes,
    image: product.image,
    shortDescription: product.shortDescription,
    description: product.description,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function mapPrismaOrderItem(item: PrismaOrderItem): OrderItem {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    size: item.size,
  };
}

function mapPrismaOrder(order: PrismaOrderWithItems): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus as PaymentStatus,
    paymentReference: order.paymentReference,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map(mapPrismaOrderItem),
  };
}

function mapPrismaUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role === "ADMIN" ? "admin" : "customer",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getProducts() {
  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }, { name: "asc" }],
  });
  return products.map(mapPrismaProduct);
}

export async function getAdminProductsPage(input: { page?: number; pageSize?: number }) {
  const prisma = getPrisma();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const total = await prisma.product.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }, { name: "asc" }],
    skip: offset,
    take: pageSize,
  });

  return {
    items: products.map(mapPrismaProduct),
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
  const prisma = getPrisma();
  const q = input.q?.trim().toLowerCase() ?? "";
  const category = input.category && input.category !== "all" ? input.category : null;
  const size = input.size && input.size !== "all" ? input.size : null;
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, input.pageSize ?? 12));

  const where: Prisma.ProductWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (size) {
    where.sizes = { contains: size };
  }

  const orderBy =
    input.sort === "price-asc"
      ? ([{ price: "asc" }, { name: "asc" }] satisfies Prisma.ProductOrderByWithRelationInput[])
      : input.sort === "price-desc"
        ? ([{ price: "desc" }, { name: "asc" }] satisfies Prisma.ProductOrderByWithRelationInput[])
        : input.sort === "name"
          ? ([{ name: "asc" }] satisfies Prisma.ProductOrderByWithRelationInput[])
          : ([{ featured: "desc" }, { createdAt: "desc" }, { name: "asc" }] satisfies Prisma.ProductOrderByWithRelationInput[]);

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: offset,
    take: pageSize,
  });

  return {
    products: products.map(mapPrismaProduct),
    total,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export async function getFeaturedProducts() {
  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return products.map(mapPrismaProduct);
}

export async function getStoreSettings() {
  const prisma = getPrisma();
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  return {
    taxPercentage: settings?.taxPercentage ?? 0,
  } satisfies StoreSettings;
}

export async function updateStoreSettings(input: StoreSettings) {
  const prisma = getPrisma();
  const settings = await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: { taxPercentage: input.taxPercentage },
    create: {
      id: "default",
      taxPercentage: input.taxPercentage,
    },
  });

  return {
    taxPercentage: settings.taxPercentage,
  } satisfies StoreSettings;
}

export async function getProductBySlug(slug: string) {
  const prisma = getPrisma();
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? mapPrismaProduct(product) : null;
}

export async function getOrders() {
  const prisma = getPrisma();
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapPrismaOrder);
}

export async function getAdminOrdersPage(input: { page?: number; pageSize?: number }) {
  const prisma = getPrisma();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const total = await prisma.order.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: pageSize,
  });

  return {
    items: orders.map(mapPrismaOrder),
    total,
    totalPages,
    page: safePage,
  };
}

export async function getOrdersByCustomerEmail(email: string) {
  const prisma = getPrisma();
  const orders = await prisma.order.findMany({
    where: { customerEmail: email.toLowerCase() },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapPrismaOrder);
}

export async function getUsers() {
  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return users.map(mapPrismaUser);
}

export async function getAdminUsersPage(input: { page?: number; pageSize?: number }) {
  const prisma = getPrisma();
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 10));
  const total = await prisma.user.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: pageSize,
  });

  return {
    items: users.map(mapPrismaUser),
    total,
    totalPages,
    page: safePage,
  };
}

export async function getUserByEmail(email: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user
    ? {
        user: mapPrismaUser(user),
        passwordHash: user.passwordHash,
      }
    : null;
}

export async function createUser(input: { name: string; email: string; passwordHash: string; image?: string | null }) {
  const prisma = getPrisma();
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      image: input.image ?? null,
      role: "CUSTOMER",
    },
  });

  return mapPrismaUser(user);
}

export async function upsertOAuthUser(input: { name: string; email: string; image?: string | null }) {
  const prisma = getPrisma();
  const user = await prisma.user.upsert({
    where: { email: input.email.toLowerCase() },
    update: {
      name: input.name,
      ...(input.image ? { image: input.image } : {}),
    },
    create: {
      name: input.name,
      email: input.email.toLowerCase(),
      image: input.image ?? null,
      role: "CUSTOMER",
    },
  });

  return mapPrismaUser(user);
}

export async function createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const prisma = getPrisma();
  const product = await prisma.product.create({
    data: input,
  });

  return mapPrismaProduct(product);
}

export async function updateProduct(id: string, input: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const prisma = getPrisma();
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return null;
  }

  const product = await prisma.product.update({
    where: { id },
    data: input,
  });

  return mapPrismaProduct(product);
}

export async function deleteProduct(id: string) {
  const prisma = getPrisma();
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const product = await prisma.product.delete({ where: { id } });
  return mapPrismaProduct(product);
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
  const prisma = getPrisma();
  const productIds = [...new Set(input.items.map((item) => item.id))];

  const order = await prisma.$transaction(async (tx) => {
    const [products, settings, user] = await Promise.all([
      tx.product.findMany({
        where: { id: { in: productIds } },
      }),
      tx.storeSettings.findUnique({ where: { id: "default" } }),
      input.customerEmail
        ? tx.user.findUnique({ where: { email: input.customerEmail.toLowerCase() } })
        : Promise.resolve(null),
    ]);

    const productsById = new Map(products.map((product) => [product.id, product]));
    const quantitiesByProduct = new Map<string, number>();
    const items = input.items.map((item) => {
      const product = productsById.get(item.id);
      if (!product) {
        throw new OrderCreationError("One or more products are no longer available.");
      }

      const availableSizes = product.sizes.split(",").map((size) => size.trim().toLowerCase());
      if (!availableSizes.includes(item.size.trim().toLowerCase())) {
        throw new OrderCreationError(`${product.name} is not available in size ${item.size}.`);
      }

      quantitiesByProduct.set(product.id, (quantitiesByProduct.get(product.id) ?? 0) + item.quantity);

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        size: item.size,
      };
    });

    for (const [productId, quantity] of quantitiesByProduct) {
      const product = productsById.get(productId);
      if (!product || product.stock < quantity) {
        throw new OrderCreationError(`${product?.name ?? "A product"} does not have enough stock.`);
      }

      const updated = await tx.product.updateMany({
        where: {
          id: productId,
          stock: { gte: quantity },
        },
        data: {
          stock: { decrement: quantity },
        },
      });

      if (updated.count !== 1) {
        throw new OrderCreationError(`${product.name} stock changed before checkout. Please review your cart.`);
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = Math.round(subtotal * ((settings?.taxPercentage ?? 0) / 100));
    const totalAmount = subtotal + taxAmount;

    return tx.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail?.toLowerCase() ?? null,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        notes: input.notes,
        totalAmount,
        status: "PENDING",
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "COD" ? "PENDING" : "AWAITING_PAYMENT",
        paymentReference: input.paymentReference,
        userId: user?.id,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
  });

  return mapPrismaOrder(order);
}

export async function updateOrderStatus(id: string, status: string, paymentStatus?: PaymentStatus) {
  const prisma = getPrisma();
  const existing = await prisma.order.findUnique({ where: { id } });

  if (!existing) {
    return null;
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: status as PrismaOrderStatus,
      paymentStatus: paymentStatus ?? existing.paymentStatus,
    },
    include: { items: true },
  });

  return mapPrismaOrder(order);
}
