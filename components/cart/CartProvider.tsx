"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import { sampleCartItems } from "@/data/cart";
import type { CartItem } from "@/types/grocery";

const STORAGE_KEY = "freshwave-cart";

interface CartContextValue {
  items: CartItem[];
  getQuantity: (productId: string) => number;
  getStock: (productId: string) => number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function stockFor(productId: string): number {
  return products.find((product) => product.id === productId)?.stock ?? 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(sampleCartItems);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount so server and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-time sync from an external, client-only source (localStorage) right
      // after mount — the intentional exception the lint rule itself calls out.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore unavailable/corrupt storage — keep the default demo cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, quota) — cart still works in-memory.
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    function addItem(productId: string, quantity = 1) {
      const stock = stockFor(productId);
      if (stock <= 0) return;

      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          const nextQuantity = Math.min(stock, existing.quantity + quantity);
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity }
              : item,
          );
        }
        return [...prev, { productId, quantity: Math.min(stock, quantity) }];
      });
    }

    function removeItem(productId: string) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    }

    function increment(productId: string) {
      addItem(productId, 1);
    }

    function decrement(productId: string) {
      setItems((prev) =>
        prev
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    }

    function getQuantity(productId: string) {
      return items.find((item) => item.productId === productId)?.quantity ?? 0;
    }

    return {
      items,
      getQuantity,
      getStock: stockFor,
      addItem,
      removeItem,
      increment,
      decrement,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
