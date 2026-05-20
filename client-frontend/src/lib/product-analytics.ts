import { apiUrl } from "./api";
import { trackUserProductView } from "./user-activity";

/** Non-blocking analytics for BI dashboards (failures ignored). */
export function trackProductView(productId: string) {
  if (!productId) return;
  const url = apiUrl(`/api/products/${encodeURIComponent(productId)}/view`);
  fetch(url, { method: "POST", credentials: "include" }).catch(() => {});
  trackUserProductView(productId);
}

export function trackProductCartAdd(productId: string, quantity = 1) {
  if (!productId) return;
  const url = apiUrl(`/api/products/${encodeURIComponent(productId)}/cart`);
  fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quantity }),
  }).catch(() => {});
}
