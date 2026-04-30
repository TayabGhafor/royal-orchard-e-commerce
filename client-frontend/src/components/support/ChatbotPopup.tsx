import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { postChatbotQuery } from "@/lib/chatbot-api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSoftTypingSound } from "@/hooks/use-soft-typing-sound";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** When true, assistant text reveals with a premium progressive animation */
  revealContent?: boolean;
};

const introMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Hi — I can help with varieties, prices, stock, shipping, and Royal Orchard. What would you like to know?",
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const MIN_TYPING_MS = 1000;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function CompactTypingDots() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="mr-auto inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-surface-container-high px-3 py-2 shadow-sm ring-1 ring-black/[0.04]"
      aria-hidden
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary"
          animate={{
            y: [0, -5, 0],
            opacity: [0.35, 1, 0.35],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1.05,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: i * 0.16,
          }}
        />
      ))}
    </motion.div>
  );
}

function RevealAssistantText({
  text,
  scrollIntoView,
}: {
  text: string;
  scrollIntoView: () => void;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : "");
  const tickRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    setDisplay("");
    let i = 0;
    const n = text.length;
    const targetMs = Math.min(3200, Math.max(700, n * 13));
    const stepMs = Math.max(8, Math.min(22, targetMs / Math.max(n, 1)));

    const id = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      tickRef.current += 1;
      if (tickRef.current % 4 === 0) scrollIntoView();
      if (i >= n) {
        window.clearInterval(id);
        scrollIntoView();
      }
    }, stepMs);

    return () => window.clearInterval(id);
  }, [text, reduced, scrollIntoView]);

  return (
    <motion.div
      initial={{ opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease }}
      className="relative"
    >
      <p className="whitespace-pre-wrap break-words">
        {display}
        {!reduced && display.length > 0 && display.length < text.length && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-3.5 w-px rounded-full bg-primary align-middle"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </p>
    </motion.div>
  );
}

type ChatbotPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChatbotPopup({ open, onOpenChange }: ChatbotPopupProps) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Latest input for send() — avoids stale closure when `send` is memoized with `[sending]` only. */
  const inputLatestRef = useRef(input);
  inputLatestRef.current = input;

  useSoftTypingSound(sending, reduced ?? false);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => scrollToEnd());
    return () => cancelAnimationFrame(id);
  }, [open, messages.length, scrollToEnd]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open]);

  const send = useCallback(async () => {
    const text = inputLatestRef.current.trim();
    if (!text || sending) return;
    setInput("");
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    const started = Date.now();

    try {
      const [replyText] = await Promise.all([postChatbotQuery(text), sleep(MIN_TYPING_MS)]);
      startTransition(() => {
        setMessages((m) => [
          ...m,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: replyText,
            revealContent: true,
          },
        ]);
      });
    } catch {
      const elapsed = Date.now() - started;
      if (elapsed < MIN_TYPING_MS) await sleep(MIN_TYPING_MS - elapsed);
      startTransition(() => {
        setMessages((m) => [
          ...m,
          {
            id: `a-${Date.now()}-e`,
            role: "assistant",
            text: "Something went wrong. Please try again or use WhatsApp / email from the support button.",
            revealContent: true,
          },
        ]);
      });
    } finally {
      setSending(false);
    }
  }, [sending]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.32, ease }}
          className="fixed bottom-24 right-4 z-[96] w-[min(100vw-2rem,400px)] sm:bottom-28 sm:right-6"
        >
          <div
            className="flex max-h-[min(72vh,520px)] flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface shadow-2xl ring-1 ring-primary/10"
            role="dialog"
            aria-label="Support chat"
          >
            <div className="flex items-center justify-between gap-2 border-b border-outline-variant/15 bg-surface-container-highest px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Icon name="support_agent" className="text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-headline text-sm font-bold text-on-surface">Royal Orchard</p>
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-outline">
                    Typically replies instantly
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Close chat"
                onClick={() => onOpenChange(false)}
              >
                <Icon name="close" />
              </Button>
            </div>

            <ScrollArea className="min-h-[220px] max-h-[360px] flex-1 px-3 py-3">
              <div className="space-y-3 pr-2">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm leading-relaxed",
                        msg.role === "user"
                          ? "max-w-[92%] rounded-2xl rounded-br-md bg-primary px-3 py-2.5 text-on-primary"
                          : msg.revealContent
                            ? "max-w-[92%] rounded-2xl rounded-bl-md border border-outline-variant/15 bg-surface-container-high px-3 py-2.5 text-on-surface shadow-sm"
                            : "max-w-[92%] rounded-2xl rounded-bl-md border border-outline-variant/15 bg-surface-container-high px-3 py-2.5 text-on-surface",
                      )}
                    >
                      {msg.role === "assistant" && msg.revealContent ? (
                        <RevealAssistantText text={msg.text} scrollIntoView={scrollToEnd} />
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence mode="popLayout">
                  {sending && <CompactTypingDots key="typing" />}
                </AnimatePresence>

                <div ref={endRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-outline-variant/15 bg-surface-container-lowest p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Ask about mangoes, prices, shipping…"
                  className="min-w-0 flex-1 rounded-xl border border-outline-variant/30 bg-surface px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                  disabled={sending}
                  maxLength={2000}
                />
                <Button
                  type="button"
                  className="shrink-0 rounded-xl px-4"
                  disabled={!input.trim() || sending}
                  onClick={() => void send()}
                >
                  <Icon name="send" className="text-lg" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
