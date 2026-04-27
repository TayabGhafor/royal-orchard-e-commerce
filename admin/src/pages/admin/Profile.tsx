import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";

const AdminProfile = () => {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const orders = useAdmin((s) => s.orders);
  const customers = useAdmin((s) => s.customers);
  const products = useAdmin((s) => s.products);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const received = orders.length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const returned = orders.filter((o) => o.status === "Returned").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const revenue = orders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Returned")
      .reduce((s, o) => s + o.total, 0);
    const aov = received > 0 ? Math.round(revenue / Math.max(1, received - cancelled - returned)) : 0;
    return { received, processing, pending, shipped, delivered, returned, cancelled, revenue, aov };
  }, [orders]);

  const recent = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [orders],
  );

  const initials = (user?.name || "AD")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-20 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-extrabold text-2xl flex items-center justify-center shadow-xl">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-white/80 mb-1">
                Royal Orchard · Administrator
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight">{user?.name || "Admin"}</h1>
              <p className="text-white/90 text-sm mt-1 flex items-center gap-2">
                <Icon name="mail" className="text-base" />
                {user?.email || "—"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-orange-700 font-bold text-xs uppercase tracking-widest shadow-md hover:bg-orange-50 transition-colors"
              >
                <Icon name="dashboard" className="text-sm" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/30 font-bold text-xs uppercase tracking-widest hover:bg-white/25 transition-colors"
              >
                <Icon name="logout" className="text-sm" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Realtime metrics */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Realtime Metrics</h2>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live · synced with store
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="receipt_long" label="Total Orders Received" value={stats.received.toString()} accent="from-blue-500 to-indigo-600" />
            <MetricCard icon="check_circle" label="Orders Delivered" value={stats.delivered.toString()} accent="from-emerald-500 to-teal-600" />
            <MetricCard icon="payments" label="Total Revenue" value={formatPKR(stats.revenue)} accent="from-orange-500 to-amber-600" />
            <MetricCard icon="trending_up" label="Avg. Order Value" value={formatPKR(stats.aov)} accent="from-violet-500 to-purple-600" />
          </div>
        </div>

        {/* Pipeline breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 lg:col-span-2">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Icon name="insights" className="text-orange-500" />
              Order Pipeline
            </h3>
            <div className="space-y-3">
              <PipelineRow label="Pending" count={stats.pending} total={stats.received} color="bg-amber-500" />
              <PipelineRow label="Processing" count={stats.processing} total={stats.received} color="bg-violet-500" />
              <PipelineRow label="Shipped" count={stats.shipped} total={stats.received} color="bg-blue-500" />
              <PipelineRow label="Delivered" count={stats.delivered} total={stats.received} color="bg-emerald-500" />
              <PipelineRow label="Returned" count={stats.returned} total={stats.received} color="bg-rose-500" />
              <PipelineRow label="Cancelled" count={stats.cancelled} total={stats.received} color="bg-zinc-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Icon name="hub" className="text-orange-500" />
              Catalog Snapshot
            </h3>
            <div className="space-y-4">
              <SnapRow icon="inventory_2" label="Products in catalog" value={products.length.toString()} />
              <SnapRow icon="people" label="Total customers" value={customers.length.toString()} />
              <SnapRow
                icon="verified"
                label="Active customers"
                value={customers.filter((c) => c.status === "Active").length.toString()}
              />
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon name="bolt" className="text-orange-500" />
              Recent Orders
            </h3>
            <Link
              to="/orders"
              className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
            >
              View all <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-wider border-b border-stone-100">
                <th className="text-left px-6 py-3 font-semibold">Order</th>
                <th className="text-left font-semibold">Customer</th>
                <th className="text-left font-semibold">Total</th>
                <th className="text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0">
                  <td className="px-6 py-3 font-mono text-sm">#{o.id}</td>
                  <td className="text-sm">
                    <div className="font-semibold">{o.customer}</div>
                    <div className="text-xs text-stone-500">{o.email}</div>
                  </td>
                  <td className="text-sm font-semibold">{formatPKR(o.total)}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-stone-400 py-10 text-sm">
                    No orders yet.
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

const MetricCard = ({
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
  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${accent} opacity-10 -mr-6 -mt-6`} />
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-md mb-4`}>
      <Icon name={icon} />
    </div>
    <p className="text-[11px] uppercase tracking-widest text-stone-500 font-bold">{label}</p>
    <p className="text-2xl font-extrabold text-stone-900 mt-1 tracking-tight">{value}</p>
  </div>
);

const PipelineRow = ({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className="text-stone-500 font-mono text-xs">
          {count} <span className="text-stone-300">·</span> {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const SnapRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
      <Icon name={icon} />
    </div>
    <div className="flex-1">
      <p className="text-xs text-stone-500 font-semibold">{label}</p>
      <p className="text-lg font-bold text-stone-900">{value}</p>
    </div>
  </div>
);

export default AdminProfile;
