import type { Product, WeightOption } from "@/data/products";

type RawProduct = Product & { price?: number };

export function unitPriceForWeight(product: RawProduct, weight: WeightOption): number {
  const fromWeight = product.weightPrices?.[weight];
  if (Number.isFinite(fromWeight) && fromWeight! >= 0) return fromWeight!;
  const legacy = Number((product as RawProduct).price);
  if (Number.isFinite(legacy) && legacy >= 0) return legacy;
  return 0;
}

export function minListedPrice(product: RawProduct): number {
  const prices = product.weights
    .map((w) => unitPriceForWeight(product, w))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return 0;
  return Math.min(...prices);
}
