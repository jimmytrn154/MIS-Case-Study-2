import type { Category } from "@/types/grocery";

export const categories: Category[] = [
  { id: "all", name: "All products", icon: "layout-grid" },
  { id: "produce", name: "Produce", icon: "apple" },
  { id: "dairy-eggs", name: "Dairy & eggs", icon: "milk" },
  { id: "meat-seafood", name: "Meat & seafood", icon: "beef" },
  { id: "bakery", name: "Bakery", icon: "croissant" },
  { id: "pantry", name: "Pantry", icon: "wheat" },
  { id: "drinks", name: "Drinks", icon: "glass-water" },
  { id: "frozen", name: "Frozen", icon: "snowflake" },
  { id: "household", name: "Household", icon: "spray-can" },
];
