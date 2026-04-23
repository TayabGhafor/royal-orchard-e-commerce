import { useMemo, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { useAdmin, type OrderStatus } from "@/store/admin";
import { formatPKR } from "@/lib/format";

const tabs: ("All" | OrderStatus)[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Returned",
  "Cancelled",
];

const next: Record<OrderStatus, OrderStatus | null> = {
  Pending: "Processing",
  Processing: "Shipped",
  Shipped: "Delivered",
  Delivered: null,
  Returned: null,
  Cancelled: null,
};

const Orders = () => {
  const orders = useAdmin((s) => s.orders);
  const setOrderStatus = useAdmin((s) => s.setOrderStatus);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = useMemo(
    () => (tab === "All" ? orders : orders.filter((o) => o.status === tab)),
    [orders, tab],
  );

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const advance = (id: string, current: OrderStatus) => {
    const n = next[current];
    if (!n) {
      toast("Already delivered");
      return;
    }
    setOrderStatus(id, n);
    toast.success(`Order #${id} → ${n}`);
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Order Management</h1>
            <p className="text-stone-500 mt-1">Move orders along the fulfillment pipeline.</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold">
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat title="Total Orders" value={counts.total.toString()} />
          <Stat title="Pending" value={counts.pending.toString()} accent="text-amber-600" />
          <Stat title="Processing" value={counts.processing.toString()} accent="text-violet-600" />
          <Stat title="Shipped" value={counts.shipped.toString()} accent="text-blue-600" />
          <Stat title="Delivered" value={counts.delivered.toString()} accent="text-emerald-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-wider border-b border-stone-100">
                <th className="text-left px-6 py-4 font-semibold">Order ID</th>
                <th className="text-left font-semibold">Customer</th>
                <th className="text-left font-semibold">Product</th>
                <th className="text-left font-semibold">Total</th>
                <th className="text-left font-semibold">Status</th>
                <th className="text-right pr-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50">
                  <td className="px-6 py-3.5 font-mono text-sm">#{o.id}</td>
                  <td className="text-sm">
                    <div className="font-semibold">{o.customer}</div>
                    <div className="text-xs text-stone-500">{o.email}</div>
                  </td>
                  <td className="text-sm text-stone-600">
                    {o.product} × {o.quantity}
                  </td>
                  <td className="text-sm font-semibold">{formatPKR(o.total)}</td>
                  <td>
                    <StatusPill status={o.status} />
                  </td>
                  <td className="pr-6 text-right">
                    {next[o.status] ? (
                      <button
                        onClick={() => advance(o.id, o.status)}
                        className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                      >
                        Mark {next[o.status]}
                        <Icon name="arrow_forward" className="text-sm" />
                      </button>
                    ) : (
                      <Icon name="check_circle" className="text-emerald-500" />
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-stone-400 py-12 text-sm">
                    No orders for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const Stat = ({ title, value, accent = "text-stone-900" }: { title: string; value: string; accent?: string }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
    <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">{title}</p>
    <h3 className={`text-3xl font-bold mt-1 ${accent}`}>{value}</h3>
  </div>
);

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-violet-50 text-violet-700",
    Shipped: "bg-blue-50 text-blue-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Returned: "bg-rose-50 text-rose-700",
    Cancelled: "bg-zinc-100 text-zinc-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] ?? "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
};

export default Orders;
