export type CardTint = "green" | "purple" | "pink";

export type DietaryTag =
  | "high-protein"
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "budget-friendly";

export type PromotionType = "percentage-discount" | "member-deal" | "sell-by-deal";

export interface Promotion {
  id: string;
  type: PromotionType;
  label: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  originalPrice?: number;
  stock: number;
  tags: DietaryTag[];
  promotion?: string;
  image: string;
  cardTint: CardTint;
  rating: number;
  reviewCount: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  hoursLabel: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  householdSize: number;
  memberSince: number;
  preferences: string[];
  dietaryRestrictions: string[];
  loyalty: {
    points: number;
    monthlySavings: number;
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
}

/** Marketing banner copy for the home hero row — distinct from product-level Promotion deals. */
export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  tone: "brand" | "deal" | "pickup";
}
