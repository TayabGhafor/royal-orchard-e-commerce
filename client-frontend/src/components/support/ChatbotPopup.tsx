import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { postChatbotQuery } from "@/lib/chatbot-api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const introMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Hi — I can help with varieties, prices, stock, shipping, and Royal Orchard. What would you like to know?",
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  useEffect(() => {
    if (open) {
      scrollToEnd();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages, scrollToEnd]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    try {
      const reply = await postChatbotQuery(text);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}-e`,
          role: "assistant",
          text: "Something went wrong. Please try again or use WhatsApp / email from the support button.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [input, sending]);

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
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Icon name="support_agent" className="text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-headline text-sm font-bold text-on-surface truncate">Royal Orchard</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-outline truncate">
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

            <ScrollArea className="flex-1 px-3 py-3 min-h-[220px] max-h-[360px]">
              <div className="space-y-3 pr-2">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease }}
                    className={cn(
                      "max-w-[92%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "ml-auto bg-primary text-on-primary rounded-br-md"
                        : "mr-auto bg-surface-container-high text-on-surface rounded-bl-md border border-outline-variant/15",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </motion.div>
                ))}
                {sending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-auto flex items-center gap-1 rounded-2xl rounded-bl-md border border-outline-variant/15 bg-surface-container-high px-4 py-3"
                    aria-hidden
                  >
                    <span className="typing-dot h-2 w-2 rounded-full bg-outline" />
                    <span className="typing-dot animation-delay-150 h-2 w-2 rounded-full bg-outline" />
                    <span className="typing-dot animation-delay-300 h-2 w-2 rounded-full bg-outline" />
                  </motion.div>
                )}
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
          <style>{`
            .typing-dot { animation: chatDot 1.1s ease-in-out infinite; opacity: 0.35; }
            .animation-delay-150 { animation-delay: 0.15s; }
            .animation-delay-300 { animation-delay: 0.3s; }
            @keyframes chatDot {
              0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
              40% { transform: translateY(-3px); opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
