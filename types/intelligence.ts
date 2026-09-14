export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface StoreLocation {
  aisleId: string;
  shelfZone: string;
}

export interface PurchaseHistory {
  id: string;
  customerId: string;
  productId: string;
  purchasedAt: string;
  quantity: number;
}

export type PantryStatus = "fresh" | "use-soon" | "expired" | "low-stock";

export interface PantryItem {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  unit: string;
  purchasedAt: string;
  expiresAt?: string;
  openedAt?: string;
  lowStockThreshold: number;
  status: PantryStatus;
}

export interface Farm {
  id: string;
  name: string;
  region: string;
  coordinates: Coordinates;
  description: string;
  productTypes: string[];
  distanceFromStoreKm: number;
  isDemo: true;
}

export interface StoreAisle {
  id: string;
  name: string;
  code: string;
  traversalOrder: number;
  floorPlan: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ShoppingRouteStop {
  aisleId: string;
  productIds: string[];
  sequence: number;
  collectedProductIds: string[];
}

export interface ShoppingRoute {
  storeId: string;
  source: "cart" | "shopping-list";
  stops: ShoppingRouteStop[];
}

export type RestockConfidence = "high" | "medium" | "low";

export interface RestockPrediction {
  productId: string;
  averagePurchaseIntervalDays: number;
  predictedNextPurchaseAt: string;
  daysUntilRestock: number;
  confidence: RestockConfidence;
  reason: string;
  pantryAdjusted: boolean;
}

export interface AntiWasteOffer {
  id: string;
  productId: string;
  normalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  daysRemaining: number;
  freshnessDate: string;
  freshnessDateType: "sell-by" | "expiration";
  personalized: boolean;
  recommendationReason: string;
}

export interface TraceabilityRecord {
  productId: string;
  farmId: string;
  originDate: string;
  originDateType: "harvested" | "produced";
}
