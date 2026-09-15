"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoCustomer } from "@/data/customer";
import { DEMO_TODAY } from "@/data/demo-date";
import { initialPantryItems } from "@/data/pantry";
import { products } from "@/data/products";
import {
  buildPurchasedPantryItems,
  consumePantryItems,
  withCalculatedPantryStatus,
} from "@/lib/pantry-core";
import type { CartItem } from "@/types/grocery";
import type { PantryItem } from "@/types/intelligence";

const STORAGE_KEY = "freshwave-pantry";

interface PantryContextValue {
  items: PantryItem[];
  addPurchasedItems: (cartItems: CartItem[]) => void;
  consumeItems: (deductions: { pantryItemId: string; quantity: number }[]) => void;
}

const PantryContext = createContext<PantryContextValue | null>(null);

function makePantryId(productId: string): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `pantry-${productId}-${suffix}`;
}

function sanitizeItems(value: unknown): PantryItem[] {
  if (!Array.isArray(value)) return initialPantryItems;
  const productIds = new Set(products.map((product) => product.id));
  const items = value.filter(
    (item): item is PantryItem =>
      Boolean(item) &&
      typeof item === "object" &&
      "id" in item &&
      typeof item.id === "string" &&
      "customerId" in item &&
      typeof item.customerId === "string" &&
      "productId" in item &&
      typeof item.productId === "string" &&
      productIds.has(item.productId) &&
      "quantity" in item &&
      typeof item.quantity === "number" &&
      item.quantity >= 0 &&
      "unit" in item &&
      typeof item.unit === "string" &&
      "purchasedAt" in item &&
      typeof item.purchasedAt === "string" &&
      "lowStockThreshold" in item &&
      typeof item.lowStockThreshold === "number",
  );
  return withCalculatedPantryStatus(items, DEMO_TODAY);
}

export function PantryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(() =>
    withCalculatedPantryStatus(initialPantryItems, DEMO_TODAY),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // Intentional one-time synchronization with client-only prototype storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(sanitizeItems(JSON.parse(raw)));
    } catch {
      // Keep the internally consistent demo pantry if storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Pantry remains usable in memory when localStorage is unavailable.
    }
  }, [items, hydrated]);

  const value = useMemo<PantryContextValue>(
    () => ({
      items,
      addPurchasedItems(cartItems) {
        const purchased = buildPurchasedPantryItems({
          cartItems,
          catalog: products,
          customerId: demoCustomer.id,
          purchasedAt: DEMO_TODAY,
          makeId: makePantryId,
        });
        setItems((current) =>
          withCalculatedPantryStatus([...purchased, ...current], DEMO_TODAY),
        );
      },
      consumeItems(deductions) {
        setItems((current) => consumePantryItems(current, deductions, DEMO_TODAY));
      },
    }),
    [items],
  );

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) throw new Error("usePantry must be used within a PantryProvider");
  return context;
}
