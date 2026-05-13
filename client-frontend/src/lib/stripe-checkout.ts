import { api } from "@/lib/api";

export type StripeSessionItem = {
  title: string;
  image?: string;
  quantity: number;
  unitPrice: number;
};

export async function createStripeCheckoutSession(input: {
  orderId: string;
  items: StripeSessionItem[];
  customerEmail: string;
}) {
  return api<{ checkoutUrl: string }>("/api/payments/stripe/create-session", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}
