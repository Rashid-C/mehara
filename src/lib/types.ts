export type Product = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

export type StoreSettings = {
  taxPercentage: number;
};

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "PAYMENT_LINK" | "PAYPAL" | "STRIPE" | "RAZORPAY";
export type PaymentStatus = "PENDING" | "AWAITING_PAYMENT" | "PAID" | "FAILED";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  size: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: string;
  notes: string | null;
  totalAmount: number;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type UserRole = "customer" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type Store = {
  products: Product[];
  orders: Order[];
};
