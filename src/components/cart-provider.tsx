"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  price: number;
  quantity: number;
  size: string;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mehara-cart";
const EMPTY_ITEMS: CartItem[] = [];
const listeners = new Set<() => void>();

let cachedRaw = "";
let cachedItems: CartItem[] = EMPTY_ITEMS;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getClientSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_ITEMS;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (raw === cachedRaw) {
    return cachedItems;
  }

  cachedRaw = raw;
  cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_ITEMS;
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function writeItems(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cachedRaw = event.newValue ?? "";
      cachedItems = cachedRaw ? (JSON.parse(cachedRaw) as CartItem[]) : EMPTY_ITEMS;
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  function addItem(item: CartItem) {
    const current = getClientSnapshot();
    const existing = current.find((entry) => entry.id === item.id && entry.size === item.size);

    if (existing) {
      writeItems(
        current.map((entry) =>
          entry.id === item.id && entry.size === item.size
            ? { ...entry, quantity: entry.quantity + item.quantity }
            : entry,
        ),
      );
      return;
    }

    writeItems([...current, item]);
  }

  function removeItem(id: string, size: string) {
    writeItems(getClientSnapshot().filter((item) => !(item.id === id && item.size === size)));
  }

  function updateQuantity(id: string, size: string, quantity: number) {
    writeItems(
      getClientSnapshot().map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)),
    );
  }

  function clearCart() {
    writeItems(EMPTY_ITEMS);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
