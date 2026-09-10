/** The only unit in the catalog priced continuously by weight. */
const WEIGHT_BASED_UNIT = "per lb";

/**
 * Normalizes a quantity to something actually purchasable for the given
 * product unit, and is the single point that prevents floating-point drift
 * from repeated addition (e.g. 0.3 + 0.3 + 0.3 = 0.8999999999999999).
 *
 * - "per lb" is the only unit sold continuously by weight, so it may be
 *   fractional — rounded to the nearest quarter pound, a realistic
 *   butcher-counter increment. Quarter-pound steps are exactly
 *   representable in floating point, so sums of them never drift.
 * - Every other unit ("each", "dozen", "500 ml", "2 lb bag", ...) is a
 *   discrete package or piece — you buy 1, 2, 3 of them, never 1.5 — so it's
 *   rounded to the nearest whole number.
 */
export function normalizeQuantity(quantity: number, unit: string): number {
  if (unit === WEIGHT_BASED_UNIT) {
    return Math.max(0.25, Math.round(quantity * 4) / 4);
  }
  return Math.max(1, Math.round(quantity));
}
