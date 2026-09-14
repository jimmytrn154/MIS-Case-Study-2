import { demoCustomer } from "@/data/customer";
import { DEMO_TODAY } from "@/data/demo-date";
import { purchaseHistory } from "@/data/purchase-history";
import { buildRestockPredictions } from "@/lib/restock-prediction-core";

export {
  buildRestockPredictions,
  isLikelyRunningLow,
  LIKELY_RUNNING_LOW_DAYS,
} from "@/lib/restock-prediction-core";

export function getRestockPredictions() {
  return buildRestockPredictions({
    history: purchaseHistory,
    customerId: demoCustomer.id,
    today: DEMO_TODAY,
  });
}
