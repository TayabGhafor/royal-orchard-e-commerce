import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

const REMINDER_MS = 30 * 60 * 1000;
const STORAGE_KEY = "royalorchard-cart-reminder-shown";

/**
 * After 30 minutes with items in cart and no checkout, surface a gentle reminder.
 */
export function useAbandonedCartReminder(onChatReminder?: (message: string) => void) {
  const items = useCart((s) => s.items);
  const lastCartActivityAt = useCart((s) => s.lastCartActivityAt);
  const firedRef = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      firedRef.current = false;
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }

    const check = () => {
      if (firedRef.current) return;
      let shown = false;
      try {
        shown = sessionStorage.getItem(STORAGE_KEY) === "1";
      } catch {
        // ignore
      }
      if (shown) return;

      const idle = Date.now() - lastCartActivityAt;
      if (idle < REMINDER_MS) return;

      firedRef.current = true;
      const name = items[0]?.name || "premium mangoes";
      const msg = `You left ${name} in your cart — ready to complete your harvest?`;

      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }

      toast.message("Your cart is waiting", {
        description: msg,
        duration: 8000,
      });

      onChatReminder?.(msg);
    };

    const id = window.setInterval(check, 60_000);
    check();
    return () => clearInterval(id);
  }, [items, lastCartActivityAt, onChatReminder]);
}
