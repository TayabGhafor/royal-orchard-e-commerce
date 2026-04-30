import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { mailtoSupportUrl, whatsappSupportUrl } from "@/lib/support-config";
import { ChatbotPopup } from "./ChatbotPopup";
import { cn } from "@/lib/utils";

const CHAT_SEEN_KEY = "royalorchard-support-chat-seen";

const spring = { type: "spring" as const, stiffness: 420, damping: 28 };

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function SupportDock() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [unread, setUnread] = useState(() => {
    try {
      return localStorage.getItem(CHAT_SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const openChat = useCallback(() => {
    setChatOpen(true);
    setMenuOpen(false);
    setUnread(false);
    try {
      localStorage.setItem(CHAT_SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    setUnread(false);
    try {
      localStorage.setItem(CHAT_SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }, [chatOpen]);

  useEffect(() => {
    if (!tooltip) return;
    const t = window.setTimeout(() => setTooltip(false), 2000);
    return () => window.clearTimeout(t);
  }, [tooltip]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const actions = [
    {
      key: "wa",
      node: (
        <a
          href={whatsappSupportUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
          aria-label="WhatsApp"
        >
          <WhatsAppGlyph className="h-5 w-5 sm:h-6 sm:w-6" />
        </a>
      ),
    },
    {
      key: "email",
      node: (
        <a
          href={mailtoSupportUrl()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/30 bg-surface text-on-surface shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
          aria-label="Email support"
        >
          <Icon name="mail" className="text-xl sm:text-2xl" />
        </a>
      ),
    },
    {
      key: "bot",
      node: (
        <button
          type="button"
          onClick={openChat}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
          aria-label="Open chat assistant"
        >
          <Icon name="smart_toy" className="text-xl sm:text-2xl" />
        </button>
      ),
    },
  ];

  return (
    <>
      <div ref={rootRef} className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {menuOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3 sm:bottom-[4.5rem]">
              {actions.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={reduced ? false : { opacity: 0, y: 14, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.92 }}
                  transition={{ ...spring, delay: reduced ? 0 : i * 0.06 }}
                >
                  {item.node}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-xs font-semibold text-on-surface shadow-xl"
              >
                💬 Need help?
              </motion.div>
            )}
          </AnimatePresence>

          {!reduced && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.08, 0.5] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          )}

          <motion.button
            type="button"
            aria-label="Support options"
            aria-expanded={menuOpen}
            className={cn(
              "relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/35 ring-2 ring-white/70 sm:h-16 sm:w-16",
            )}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMenuOpen((v) => !v)}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
          >
            <Icon name={menuOpen ? "close" : "support_agent"} className="text-2xl sm:text-[28px]" />
            {unread && !chatOpen && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" />
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <ChatbotPopup open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
