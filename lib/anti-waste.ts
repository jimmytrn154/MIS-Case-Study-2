import { demoCustomer } from "@/data/customer";
import { DEMO_TODAY } from "@/data/demo-date";
import { products } from "@/data/products";
import { purchaseHistory } from "@/data/purchase-history";
import { buildAntiWasteOffers } from "@/lib/anti-waste-core";
import type { AntiWasteOffer } from "@/types/intelligence";

export {
  ANTI_WASTE_WINDOW_DAYS,
  buildAntiWasteOffers,
  getAntiWasteDiscountPercent,
  getDaysRemaining,
} from "@/lib/anti-waste-core";

export function getAntiWasteOffers(): AntiWasteOffer[] {
  return buildAntiWasteOffers({
    catalog: products,
    history: purchaseHistory,
    customerId: demoCustomer.id,
    customerName: demoCustomer.name,
    today: DEMO_TODAY,
  });
}

export function getAntiWasteOfferForProduct(
  productId: string,
): AntiWasteOffer | undefined {
  return getAntiWasteOffers().find((offer) => offer.productId === productId);
}
