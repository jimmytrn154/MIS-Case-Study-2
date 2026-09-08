/** Trims a computed quantity to at most 2 decimals without trailing zeros, e.g. 0.50 -> "0.5". */
export function formatQuantity(quantity: number): string {
  return Number(quantity.toFixed(2)).toString();
}
