import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { useRealtimeTick, formatRelative } from "@/hooks/use-realtime-tick";
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/admin/AdminSkeletons";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const orders = useAdmin((s) => s.orders);
  const customers = useAdmin((s) => s.customers);
  const { loading, error, retry } = usePageLoading({ delay: 700 });
  const { lastUpdated } = useRealtimeTick(30000);
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const activeUsers = customers.filter((c) => c.status === "Active").length;

  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: "shopping_basket",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      title: "Revenue",
      value: formatPKR(revenue),
      change: "+8.2%",
      trend: "up",
      icon: "payments",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      title: "Active Users",
      value: activeUsers.toLocaleString(),
      change: "-2.4%",
      trend: "down",
      icon: "person_play",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
  ];

  const trend = [40, 65, 50, 85, 70, 95, 80];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const peakIdx = trend.indexOf(Math.max(...trend));

  const dailyVolume = [
    { label: "Fresh Picked", value: 420, pct: 85 },
    { label: "Pre-Order", value: 150, pct: 40 },
    { label: "Bulk Wholesale", value: 85, pct: 25 },
  ];

  const dateRange = (() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} - ${fmt(end)}, ${end.getFullYear()}`;
  })();

  return (
    <AdminLayout>
      <div className="p-8 lg:p-12 space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 font-headline">
              Orchard Insights
            </h2>
            <p className="text-stone-500">Welcome back, Supervisor. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live · updated {formatRelative(lastUpdated)}
            </div>
            <div className="bg-stone-50 px-4 py-2 rounded-full flex items-center gap-2 border border-stone-100">
              <Icon name="calendar_today" className="text-stone-400 text-base" />
              <span className="text-sm font-medium text-stone-700">{dateRange}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="error" /> {error}
            </div>
            <button
              onClick={retry}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${item.iconBg}`}>
                  <Icon name={item.icon} className={item.iconColor} />
                </div>
                <span
                  className={`font-bold text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                    item.trend === "up"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
                  }`}
                >
                  <Icon
                    name={item.trend === "up" ? "trending_up" : "trending_down"}
                    className="text-xs"
                  />
                  {item.change}
                </span>
              </div>
              <p className="text-sm font-medium text-stone-500">{item.title}</p>
              <h3 className="text-4xl font-bold mt-1 text-stone-900 font-headline">{item.value}</h3>
            </motion.div>
          ))}
        </section>

        {/* Charts Bento */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {loading ? (
            <>
              <ChartSkeleton className="lg:col-span-8" />
              <ChartSkeleton className="lg:col-span-4" />
            </>
          ) : (
            <>
          {/* Revenue Trends */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-bold font-headline">Revenue Trends</h4>
              <select className="bg-stone-50 border-none rounded-full text-xs px-4 py-2 font-medium focus:ring-2 focus:ring-orange-300 focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-2">
              {trend.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-t-lg transition-all ${
                    i === peakIdx
                      ? "bg-orange-500"
                      : "bg-orange-200/50 hover:bg-orange-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-stone-500 font-medium px-1">
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Daily Volume */}
          <div className="lg:col-span-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2 font-headline">Daily Volume</h4>
              <p className="text-orange-100 text-sm mb-8">Capacity: 92%</p>
              <div className="space-y-6">
                {dailyVolume.map((d) => (
                  <div key={d.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>{d.label}</span>
                      <span>{d.value}</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/analytics"
                className="mt-10 w-full inline-block text-center py-3 bg-white text-orange-600 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors"
              >
                View Detailed Report
              </Link>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 pointer-events-none">
              <Icon name="eco" className="text-[150px]" />
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center">
            <h4 className="text-xl font-bold font-headline">Recent Orders</h4>
            <button className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:opacity-70 transition-opacity">
              Export CSV <Icon name="download" className="text-sm" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-8 py-5 font-bold text-stone-900">#{o.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                          {o.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{o.customer}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-stone-600">{o.product}</td>
                    <td className="px-8 py-5 font-bold">{formatPKR(o.total)}</td>
                    <td className="px-8 py-5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-8 py-5">
                      <Link
                        to="/admin/orders"
                        className="text-stone-400 hover:text-orange-600 transition-colors inline-flex"
                      >
                        <Icon name="more_horiz" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-stone-400 text-sm">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-stone-50/40 border-t border-stone-100 text-center">
            <Link to="/admin/orders" className="text-sm font-bold text-orange-600 hover:underline">
              View All Order History
            </Link>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Pending: "bg-orange-50 text-orange-700 border-orange-200",
    Processing: "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-amber-50 text-amber-700 border-amber-200",
    Dispatched: "bg-amber-50 text-amber-700 border-amber-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Returned: "bg-rose-50 text-rose-700 border-rose-200",
    Cancelled: "bg-stone-100 text-stone-700 border-stone-200",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full border ${
        map[status] || "bg-stone-100 text-stone-700 border-stone-200"
      }`}
    >
      {status}
    </span>
  );
};

export default Dashboard;
