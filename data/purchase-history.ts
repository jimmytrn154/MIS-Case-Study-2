import type { PurchaseHistory } from "@/types/intelligence";

export const purchaseHistory: PurchaseHistory[] = [
  ...["2026-08-18", "2026-08-25", "2026-09-01", "2026-09-08"].map((purchasedAt, index) => ({ id: `milk-${index + 1}`, customerId: "sarah", productId: "whole-milk", purchasedAt, quantity: 1 })),
  ...["2026-08-02", "2026-08-12", "2026-08-22", "2026-09-01"].map((purchasedAt, index) => ({ id: `eggs-${index + 1}`, customerId: "sarah", productId: "large-eggs", purchasedAt, quantity: 1 })),
  ...["2026-08-26", "2026-08-31", "2026-09-05", "2026-09-10"].map((purchasedAt, index) => ({ id: `bananas-${index + 1}`, customerId: "sarah", productId: "bananas", purchasedAt, quantity: 1 })),
  ...["2026-08-17", "2026-08-24", "2026-08-31", "2026-09-07"].map((purchasedAt, index) => ({ id: `chicken-${index + 1}`, customerId: "sarah", productId: "chicken-breast", purchasedAt, quantity: 1 })),
  ...["2026-07-01", "2026-07-31", "2026-08-30"].map((purchasedAt, index) => ({ id: `rice-${index + 1}`, customerId: "sarah", productId: "brown-rice", purchasedAt, quantity: 1 })),
  ...["2026-07-08", "2026-08-02", "2026-08-27"].map((purchasedAt, index) => ({ id: `towels-${index + 1}`, customerId: "sarah", productId: "paper-towels", purchasedAt, quantity: 1 })),
  ...["2026-08-11", "2026-08-28", "2026-09-12"].map((purchasedAt, index) => ({ id: `apples-${index + 1}`, customerId: "sarah", productId: "honeycrisp-apples", purchasedAt, quantity: 2 })),
];
