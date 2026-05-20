import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { OrderTimelineStep } from "@/lib/chat-api";
import { cn } from "@/lib/utils";

const STEP_ICONS: Record<string, string> = {
  Placed: "task_alt",
  Processing: "inventory",
  Packed: "inventory_2",
  Shipped: "local_shipping",
  OutForDelivery: "delivery_dining",
  Delivered: "check_circle",
};

type Props = {
  timeline: OrderTimelineStep[];
  orderStatus?: string;
  expectedDelivery?: string;
};

export function ChatOrderTimeline({ timeline, orderStatus, expectedDelivery }: Props) {
  return (
    <div className="mt-2 space-y-2">
      {orderStatus && (
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
          {orderStatus}
          {expectedDelivery ? ` · ETA ${expectedDelivery}` : ""}
        </p>
      )}
      <ul className="space-y-1.5">
        {timeline.map((step, i) => (
          <motion.li
            key={step.key}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]",
                step.state === "complete" && "bg-primary text-on-primary",
                step.state === "active" && "bg-primary/15 text-primary ring-2 ring-primary/30",
                step.state === "pending" && "bg-surface-container-high text-outline",
              )}
            >
              <Icon name={STEP_ICONS[step.key] || "circle"} className="text-sm" />
            </span>
            <span
              className={cn(
                "text-xs",
                step.state === "complete" && "font-medium text-on-surface",
                step.state === "active" && "font-semibold text-primary",
                step.state === "pending" && "text-outline",
              )}
            >
              {step.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
