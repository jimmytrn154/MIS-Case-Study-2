import type { StoreAisle } from "@/types/intelligence";

/** Ordered clockwise through the fictional FreshWave Riverside floor plan. */
export const storeAisles: StoreAisle[] = [
  { id: "entrance", name: "Entrance", code: "ENT", traversalOrder: 0, floorPlan: { x: 4, y: 82, width: 18, height: 14 } },
  { id: "produce", name: "Produce", code: "P", traversalOrder: 1, floorPlan: { x: 4, y: 52, width: 28, height: 24 } },
  { id: "bakery", name: "Bakery", code: "BK", traversalOrder: 2, floorPlan: { x: 4, y: 20, width: 28, height: 24 } },
  { id: "meat-seafood", name: "Meat & Seafood", code: "M", traversalOrder: 3, floorPlan: { x: 38, y: 4, width: 26, height: 20 } },
  { id: "dairy-eggs", name: "Dairy & Eggs", code: "D", traversalOrder: 4, floorPlan: { x: 70, y: 4, width: 26, height: 20 } },
  { id: "frozen", name: "Frozen", code: "F", traversalOrder: 5, floorPlan: { x: 70, y: 31, width: 26, height: 16 } },
  { id: "pantry", name: "Pantry", code: "A", traversalOrder: 6, floorPlan: { x: 38, y: 31, width: 26, height: 34 } },
  { id: "drinks", name: "Drinks", code: "B", traversalOrder: 7, floorPlan: { x: 70, y: 54, width: 26, height: 16 } },
  { id: "household", name: "Household", code: "H", traversalOrder: 8, floorPlan: { x: 38, y: 72, width: 26, height: 24 } },
  { id: "checkout", name: "Checkout", code: "CHK", traversalOrder: 9, floorPlan: { x: 70, y: 78, width: 26, height: 18 } },
];
