/** WhatsApp E.164 digits only (no +), e.g. 923001234567 */
export const SUPPORT_WHATSAPP_E164 =
  (import.meta.env.VITE_SUPPORT_WHATSAPP_E164 as string | undefined)?.replace(/\D/g, "") || "923001234567";

export const SUPPORT_EMAIL =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined)?.trim() || "support@royalorchard.com";

export function whatsappSupportUrl() {
  const text = encodeURIComponent("Hello — I need help with Royal Orchard.");
  return `https://wa.me/${SUPPORT_WHATSAPP_E164}?text=${text}`;
}

export function mailtoSupportUrl() {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Royal Orchard — Support")}`;
}
