import { postChatActivity } from "@/lib/chat-api";

/** Per-user/guest activity for recommendations (non-blocking). */
export function trackUserProductView(productId: string) {
  postChatActivity(productId, "view");
}

export function trackUserProductClick(productId: string) {
  postChatActivity(productId, "click");
}
