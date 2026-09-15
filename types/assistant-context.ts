import type { CartItem } from "@/types/grocery";
import type {
  AntiWasteOffer,
  Farm,
  PantryItem,
  RestockPrediction,
  ShoppingRoute,
} from "@/types/intelligence";

export interface AssistantClientState {
  pantryItems: PantryItem[];
  cartItems: CartItem[];
}

export interface AssistantStructuredContext {
  pantryItems: PantryItem[];
  restockRecommendations: RestockPrediction[];
  restocksCoveredByPantry: RestockPrediction[];
  antiWasteOffers: AntiWasteOffer[];
  farms: Farm[];
  shoppingRoute: ShoppingRoute;
}
