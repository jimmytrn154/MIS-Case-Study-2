import type { PantryItem } from "@/types/intelligence";

export const initialPantryItems: PantryItem[] = [
  { id: "pantry-broccoli", customerId: "sarah", productId: "broccoli", quantity: 1, unit: "lb", purchasedAt: "2026-09-12", expiresAt: "2026-09-15", lowStockThreshold: 0.25, status: "use-soon" },
  { id: "pantry-chicken", customerId: "sarah", productId: "chicken-breast", quantity: 0.5, unit: "lb", purchasedAt: "2026-09-12", expiresAt: "2026-09-15", openedAt: "2026-09-13", lowStockThreshold: 0.5, status: "use-soon" },
  { id: "pantry-milk", customerId: "sarah", productId: "whole-milk", quantity: 2, unit: "cartons", purchasedAt: "2026-09-11", expiresAt: "2026-09-19", openedAt: "2026-09-13", lowStockThreshold: 1, status: "fresh" },
  { id: "pantry-eggs", customerId: "sarah", productId: "large-eggs", quantity: 0, unit: "eggs", purchasedAt: "2026-09-01", expiresAt: "2026-09-16", lowStockThreshold: 2, status: "low-stock" },
  { id: "pantry-rice", customerId: "sarah", productId: "brown-rice", quantity: 2, unit: "lb", purchasedAt: "2026-08-30", lowStockThreshold: 0.5, status: "fresh" },
  { id: "pantry-spinach", customerId: "sarah", productId: "spinach", quantity: 1, unit: "clamshell", purchasedAt: "2026-09-13", expiresAt: "2026-09-18", lowStockThreshold: 0, status: "fresh" },
  { id: "pantry-paper-towels", customerId: "sarah", productId: "paper-towels", quantity: 1, unit: "roll", purchasedAt: "2026-08-27", lowStockThreshold: 1, status: "low-stock" },
];
