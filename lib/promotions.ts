import type { BadgeTone } from "@/components/ui/Badge";
import { promotions } from "@/data/promotions";
import type { Promotion, PromotionType } from "@/types/grocery";

const PROMOTION_TONE: Record<PromotionType, BadgeTone> = {
  "percentage-discount": "deal",
  "member-deal": "info",
  "sell-by-deal": "deal",
};

export function getPromotionBadge(
  promotionId: string | undefined,
): { label: string; tone: BadgeTone } | null {
  if (!promotionId) return null;
  const promotion: Promotion | undefined = promotions.find((p) => p.id === promotionId);
  if (!promotion) return null;
  return { label: promotion.label, tone: PROMOTION_TONE[promotion.type] };
}
