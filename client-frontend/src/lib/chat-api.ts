import { apiUrl, getAuthToken } from "@/lib/api";
import { getGuestSessionId } from "@/lib/guest-session";

export type ChatProduct = {
  id: string;
  slug: string;
  name: string;
  variety: string;
  minPrice: number;
  availabilityStatus: string;
};

export type OrderTimelineStep = {
  key: string;
  label: string;
  state: "pending" | "active" | "complete";
};

export type ChatCartAction = {
  action: string;
  productId?: string;
  slug?: string;
  productName?: string;
  weight?: string;
  quantity?: number;
  unitPrice?: number;
  couponCode?: string;
  discountPercent?: number;
  reply: string;
};

export type ChatQueryResponse = {
  reply: string;
  products?: ChatProduct[];
  cartAction?: ChatCartAction;
  order?: {
    orderId: string;
    orderStatus: string;
    expectedDelivery?: string;
    timeline: OrderTimelineStep[];
  };
  suggestions?: string[];
};

function chatHeaders(): HeadersInit {
  const h: Record<string, string> = {
    "content-type": "application/json",
    "x-guest-session": getGuestSessionId(),
  };
  const token = getAuthToken();
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

export async function postChatbotQuery(message: string): Promise<ChatQueryResponse> {
  const res = await fetch(apiUrl("/api/chatbot/query"), {
    method: "POST",
    headers: chatHeaders(),
    credentials: "include",
    body: JSON.stringify({ message, guestSessionId: getGuestSessionId() }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Chat failed (${res.status})`);
  }
  return res.json() as Promise<ChatQueryResponse>;
}

export async function fetchChatSuggestions(q: string) {
  const res = await fetch(apiUrl(`/api/chat/suggestions?q=${encodeURIComponent(q)}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Suggestions unavailable");
  return res.json() as Promise<{ suggestions: { text: string; kind: string; slug?: string }[] }>;
}

export async function fetchChatRecommendations(
  section: "forYou" | "similar" | "trending" | "alsoBought" | "recent",
  productId?: string,
) {
  const params = new URLSearchParams({ section });
  if (productId) params.set("productId", productId);
  const res = await fetch(apiUrl(`/api/chat/recommendations?${params}`), {
    credentials: "include",
    headers: chatHeaders(),
  });
  if (!res.ok) throw new Error("Recommendations unavailable");
  return res.json() as Promise<{ section: string; products: ChatProduct[] }>;
}

export async function postChatActivity(productId: string, type: "view" | "click") {
  const url = apiUrl("/api/chat/activity");
  fetch(url, {
    method: "POST",
    credentials: "include",
    headers: chatHeaders(),
    body: JSON.stringify({ productId, type, guestSessionId: getGuestSessionId() }),
  }).catch(() => {});
}
