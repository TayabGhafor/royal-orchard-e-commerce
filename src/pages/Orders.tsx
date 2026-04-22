import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { useAdmin, type AdminOrder, type OrderStatus } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { toast } from "sonner";

type TabKey =
  | "all"
  | "to-pay"
  | "to-ship"
  | "to-receive"
  | "to-review"
  | "returns";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "all", label: "All Orders", icon: "list_alt" },
  { key: "to-pay", label: "To Pay", icon: "payments" },
  { key: "to-ship", label: "To Ship", icon: "inventory_2" },
  { key: "to-receive", label: "To Receive", icon: "local_shipping" },
  { key: "to-review", label: "To Review", icon: "rate_review" },
  { key: "returns", label: "Returns & Cancellations", icon: "assignment_return" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Returned: "bg-rose-100 text-rose-800",
  Cancelled: "bg-zinc-200 text-zinc-700",
};

const TIMELINE: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "Pending", label: "Placed", icon: "task_alt" },
  { key: "Processing", label: "Processing", icon: "inventory" },
  { key: "Shipped", label: "Shipped", icon: "local_shipping" },
  { key: "Delivered", label: "Delivered", icon: "check_circle" },
];

const TIMELINE_INDEX: Record<OrderStatus, number> = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Returned: -1,
  Cancelled: -1,
};

const filterFor = (orders: AdminOrder[], tab: TabKey) => {
  switch (tab) {
    case "all":
      return orders;
    case "to-pay":
      return orders.filter((o) => o.paid === false && o.status !== "Cancelled" && o.status !== "Returned");
    case "to-ship":
      return orders.filter((o) => o.status === "Pending" || o.status === "Processing");
    case "to-receive":
      return orders.filter((o) => o.status === "Shipped");
    case "to-review":
      return orders.filter((o) => o.status === "Delivered" && !o.reviewed);
    case "returns":
      return orders.filter((o) => o.status === "Returned" || o.status === "Cancelled");
    default:
      return orders;
  }
};

const Orders = () => {
  const user = useAuth((s) => s.user);
  const allOrders = useAdmin((s) => s.orders);
  const setOrderStatus = useAdmin((s) => s.setOrderStatus);
  const [tab, setTab] = useState<TabKey>("all");

  const myOrders = useMemo(() => {
    if (!user) return [];
    return allOrders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase());
  }, [allOrders, user]);

  const counts = useMemo(
    () => ({
      all: myOrders.length,
      "to-pay": filterFor(myOrders, "to-pay").length,
      "to-ship": filterFor(myOrders, "to-ship").length,
      "to-receive": filterFor(myOrders, "to-receive").length,
      "to-review": filterFor(myOrders, "to-review").length,
      returns: filterFor(myOrders, "returns").length,
    }),
    [myOrders],
  );

  const totalSpent = useMemo(
    () => myOrders.filter((o) => o.status !== "Cancelled" && o.status !== "Returned").reduce((s, o) => s + o.total, 0),
    [myOrders],
  );

  if (!user) return <Navigate to="/login" replace />;

  const visible = filterFor(myOrders, tab);

  const cancelOrder = (id: string) => {
    setOrderStatus(id, "Cancelled");
    toast.success(`Order #${id} cancelled`);
  };
  const returnOrder = (id: string) => {
    setOrderStatus(id, "Returned");
    toast.success(`Return requested for #${id}`);
  };
  const confirmReceived = (id: string) => {
    setOrderStatus(id, "Delivered");
    toast.success(`Order #${id} marked as received`);
  };

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Royal Orchard · Account</p>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
            My Orders
          </h1>
          <p className="text-on-surface-variant font-medium">
            Track every basket of mangoes from the orchard to your doorstep.
          </p>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <SummaryCard icon="receipt_long" label="Total Orders" value={String(counts.all)} accent="bg-primary-container text-on-primary-container" />
          <SummaryCard icon="local_shipping" label="In Transit" value={String(counts["to-receive"])} accent="bg-secondary-container text-on-secondary-container" />
          <SummaryCard icon="check_circle" label="Delivered" value={String(myOrders.filter((o) => o.status === "Delivered").length)} accent="bg-emerald-100 text-emerald-800" />
          <SummaryCard icon="payments" label="Total Spent" value={formatPKR(totalSpent)} accent="bg-amber-100 text-amber-800" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-2 px-2">
          {TABS.map((t) => {
            const active = tab === t.key;
            const count = counts[t.key];
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  active
                    ? "bg-primary text-on-primary border-primary shadow-md"
                    : "bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:border-primary/40"
                }`}
              >
                <Icon name={t.icon} className="text-base" />
                {t.label}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      active ? "bg-on-primary/20 text-on-primary" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {visible.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="space-y-5">
            {visible.map((order) => {
              const stepIdx = TIMELINE_INDEX[order.status];
              const isClosed = order.status === "Returned" || order.status === "Cancelled";
              return (
                <article
                  key={order.id}
                  className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden"
                >
                  <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-outline-variant/20 bg-surface-container/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                        <Icon name="inventory_2" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-surface">Order #{order.id}</p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleString("en-PK", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                      {order.paid === false && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-rose-100 text-rose-700">
                          Unpaid
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-start gap-3">
                        <Icon name="restaurant" className="text-primary mt-1" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                            Items ({order.quantity})
                          </p>
                          <p className="font-semibold text-on-surface">{order.product}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="location_on" className="text-primary mt-1" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                            Delivery Address
                          </p>
                          <p className="text-on-surface">{order.address}</p>
                        </div>
                      </div>

                      {!isClosed && (
                        <div className="pt-4">
                          <div className="relative flex items-start justify-between">
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-surface-container-highest" />
                            <div
                              className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
                              style={{ width: `${(stepIdx / (TIMELINE.length - 1)) * 100}%` }}
                            />
                            {TIMELINE.map((s, i) => {
                              const reached = i <= stepIdx;
                              return (
                                <div key={s.key} className="relative z-10 flex flex-col items-center text-center w-1/4">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                      reached
                                        ? "bg-primary text-on-primary"
                                        : "bg-surface-container-highest text-outline-variant"
                                    }`}
                                  >
                                    <Icon name={s.icon} className="text-sm" />
                                  </div>
                                  <span
                                    className={`text-[11px] ${
                                      reached ? "font-bold text-on-surface" : "font-medium text-on-surface-variant"
                                    }`}
                                  >
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-surface-container/50 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                          Order Total
                        </p>
                        <p className="text-3xl font-black text-primary">{formatPKR(order.total)}</p>
                        {order.paymentMethod && (
                          <p className="text-xs text-on-surface-variant mt-2 capitalize">
                            Paid via {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        {(order.status === "Pending" || order.status === "Processing") && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-rose-100 hover:text-rose-700 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => confirmReceived(order.id)}
                            className="px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-opacity"
                          >
                            Confirm Received
                          </button>
                        )}
                        {order.status === "Delivered" && !order.reviewed && (
                          <button className="px-4 py-2 rounded-full bg-amber-500 text-white font-bold text-xs hover:opacity-90 transition-opacity">
                            Leave a Review
                          </button>
                        )}
                        {order.status === "Delivered" && (
                          <button
                            onClick={() => returnOrder(order.id)}
                            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-bold text-xs hover:bg-rose-100 hover:text-rose-700 transition-colors"
                          >
                            Request Return
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            <Icon name="storefront" /> Continue Shopping
          </Link>
        </div>
      </div>
    </SiteShell>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
}) => (
  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accent}`}>
      <Icon name={icon} />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{label}</p>
      <p className="text-xl font-headline font-extrabold text-on-surface truncate">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ tab }: { tab: TabKey }) => {
  const messages: Record<TabKey, { icon: string; title: string; sub: string }> = {
    all: { icon: "shopping_basket", title: "No orders yet", sub: "Start your harvest with a sun-ripened crate." },
    "to-pay": { icon: "payments", title: "Nothing to pay", sub: "All your orders are settled." },
    "to-ship": { icon: "inventory_2", title: "Nothing being prepared", sub: "Your next order will appear here once placed." },
    "to-receive": { icon: "local_shipping", title: "No deliveries inbound", sub: "Orders in transit will show up here." },
    "to-review": { icon: "rate_review", title: "All caught up", sub: "No delivered orders awaiting your review." },
    returns: { icon: "assignment_return", title: "No returns or cancellations", sub: "Hopefully it stays that way!" },
  };
  const m = messages[tab];
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40 p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
        <Icon name={m.icon} className="text-2xl" />
      </div>
      <h3 className="font-headline text-xl font-bold text-on-surface mb-1">{m.title}</h3>
      <p className="text-on-surface-variant text-sm">{m.sub}</p>
    </div>
  );
};

export default Orders;
