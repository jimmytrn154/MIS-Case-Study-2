export type CardTint = "green" | "purple" | "pink";

export type ProductBadge =
  | "in-stock-local"
  | "member-deal"
  | "recommended"
  | "bought-before"
  | "sell-by-deal";

export interface Product {
  id: string;
  name: string;
  unit: string;
  categoryId: string;
  price: number;
  previousPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  emoji: string;
  cardTint: CardTint;
  badges?: ProductBadge[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  hoursLabel: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  tone: "brand" | "deal" | "pickup";
}

export interface LoyaltySummary {
  tier: string;
  points: number;
  pointsToNextTier: number;
  nextTier: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
