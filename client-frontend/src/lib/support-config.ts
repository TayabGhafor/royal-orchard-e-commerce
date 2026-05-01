/** WhatsApp chat entrypoint (QR invite link). */
export const SUPPORT_WHATSAPP_URL =
  (import.meta.env.VITE_SUPPORT_WHATSAPP_URL as string | undefined)?.trim() || "https://wa.me/qr/6PSU5ZQW47Q5M1";

export const SUPPORT_EMAIL =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined)?.trim() || "royalorchard.inc@gmail.com";

export function whatsappSupportUrl() {
  return SUPPORT_WHATSAPP_URL;
}

export function mailtoSupportUrl() {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Royal Orchard — Support")}`;
}
