// Inputs have at most three decimals. Integer arithmetic matches the server's
// rounding to 0.001 g, including half-way values such as 0.5 × 1.001 g.
export function portionTotalGrams(count: number, grams: number): number {
  const product = Math.round(count * 1000) * Math.round(grams * 1000);
  if (!Number.isSafeInteger(product)) return NaN;
  return Math.floor((product + 500) / 1000) / 1000;
}
