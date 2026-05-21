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
import { useState, useEffect, useMemo } from "react";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

const Dashboard = () => {
  const orders = useAdmin((s) => s.orders);
  const { loading: pageLoading, error: pageError, retry } = usePageLoading({ delay: 400 });
  const { data: bi, isLoading: biLoading, isError: biError, refetch, dataUpdatedAt } = useAdminAnalytics();
  const { lastUpdated } = useRealtimeTick(30000);
  const [rangeDays, setRangeDays] = useState<7 | 30>(7);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const loading = pageLoading || biLoading;
  const error = pageError || (biError ? "Could not load live analytics" : null);
  const sales = bi?.sales;
  const trending = bi?.trending?.items || [];

  const weekMomentum = useMemo(() => {
    const trend = sales?.dailySalesTrend || [];
    if (trend.length < 8) return { change: "—", trend: "up" as const };
    const last7 = trend.slice(-7).reduce((s, d) => s + d.amount, 0);
    const prev7 = trend.slice(-14, -7).reduce((s, d) => s + d.amount, 0);
    const pct = pctChange(last7, prev7);
    return { change: pct, trend: last7 >= prev7 ? ("up" as const) : ("down" as const) };
  }, [sales?.dailySalesTrend]);

  const stats = [
    {
      title: "Total Orders",
      value: (sales?.orders ?? orders.length).toLocaleString(),
      change: weekMomentum.change,
      trend: weekMomentum.trend,
      icon: "shopping_basket",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      title: "Revenue (Delivered)",
      value: formatPKR(sales?.revenue ?? 0),
      change: sales?.weeklySales ? formatPKR(sales.weeklySales) + " / 7d" : "—",
      trend: "up" as const,
      icon: "payments",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      title: "Pending Orders",
      value: (sales?.pendingOrders ?? 0).toLocaleString(),
      change: `${sales?.returnedOrders ?? 0} returned`,
      trend: "down" as const,
      icon: "pending_actions",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
  ];

  const revenueTrend = useMemo(() => {
    const trend = sales?.dailySalesTrend || [];
    const slice = trend.slice(-rangeDays);
    const points = slice.map((p) => {
      const d = new Date(p.day);
      const label =
        rangeDays === 7
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { date: d, label, value: p.amount };
    });
    const max = Math.max(...points.map((p) => p.value), 1);
    const bars = points.map((p) => ({
      ...p,
      heightPct: Math.max(8, Math.round((p.value / max) * 100)),
    }));
    return { bars, peakIdx: bars.findIndex((b) => b.value === Math.max(...bars.map((x) => x.value))) };
  }, [sales?.dailySalesTrend, rangeDays]);

  const dailyVolume = useMemo(() => {
    const top = trending.slice(0, 3);
    if (!top.length) {
      return [{ label: "No product data", value: 0, pct: 0 }];
    }
    const maxScore = Math.max(...top.map((t) => t.trendingScore), 1);
    return top.map((t) => ({
      label: t.name.length > 18 ? `${t.name.slice(0, 16)}…` : t.name,
      value: t.salesCount,
      pct: Math.max(12, Math.round((t.trendingScore / maxScore) * 100)),
    }));
  }, [trending]);

  const capacityPct = useMemo(() => {
    const total = sales?.totalSales ?? 0;
    const month = sales?.monthlySales ?? 1;
    return Math.min(99, Math.max(8, Math.round((month / Math.max(total, 1)) * 100)));
  }, [sales]);

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
              Live · {formatRelative(dataUpdatedAt || lastUpdated)}
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
              onClick={() => {
                retry();
                void refetch();
              }}
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
              <div className="relative">
                <select
                  value={rangeDays}
                  onChange={(e) => setRangeDays((Number(e.target.value) === 30 ? 30 : 7) as 7 | 30)}
                  className="appearance-none bg-white border border-stone-200 rounded-full text-xs pl-4 pr-9 py-2 font-semibold text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition focus:ring-4 focus:ring-orange-100/70 focus:border-orange-300 focus:outline-none"
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                  <Icon name="expand_more" className="text-base" />
                </span>
              </div>
            </div>
            <div
              key={rangeDays}
              className="relative h-64 flex items-end gap-2"
              onMouseLeave={() => setHoverIdx(null)}
            >
              {revenueTrend.bars.map((b, i) => {
                const isPeak = i === revenueTrend.peakIdx;
                const isActive = hoverIdx === i;
                return (
                  <motion.div
                    key={`${b.date.toISOString()}-${i}`}
                    initial={{ height: 0, opacity: 0.6 }}
                    animate={{ height: `${b.heightPct}%`, opacity: 1 }}
                    transition={{ duration: 0.55, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    className={[
                      "flex-1 rounded-t-lg relative cursor-pointer",
                      "transition-[filter,transform,background-color] duration-200",
                      isPeak ? "bg-orange-500" : "bg-orange-200/60 hover:bg-orange-400",
                      isActive ? "brightness-105 -translate-y-0.5 shadow-sm" : "",
                    ].join(" ")}
                    onMouseEnter={() => setHoverIdx(i)}
                    onFocus={() => setHoverIdx(i)}
                    tabIndex={0}
                    aria-label={`${b.label}: ${formatPKR(b.value)}`}
                  >
                    {/* subtle highlight */}
                    <span className="absolute inset-x-0 top-0 h-6 rounded-t-lg bg-white/15 opacity-0 hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}

              {hoverIdx !== null && revenueTrend.bars[hoverIdx] && (
                <div className="pointer-events-none absolute -top-2 left-0 right-0 flex justify-center">
                  <div className="bg-white border border-stone-200 shadow-lg rounded-xl px-3 py-2 text-xs">
                    <div className="font-bold text-stone-900">{revenueTrend.bars[hoverIdx].label}</div>
                    <div className="text-stone-600 font-semibold">{formatPKR(revenueTrend.bars[hoverIdx].value)}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4 text-[11px] text-stone-500 font-semibold px-1">
              {revenueTrend.bars.map((b, i) => (
                <span key={`${b.label}-${i}`} className={rangeDays === 30 ? "w-6 text-center" : ""}>
                  {rangeDays === 30 ? (i % 5 === 0 ? b.label.split(" ")[1] : "•") : b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Daily Volume */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="lg:col-span-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden transition-shadow hover:shadow-xl"
          >
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2 font-headline">Daily Volume</h4>
              <p className="text-orange-100 text-sm mb-8">Month vs total: {capacityPct}%</p>
              <div className="space-y-6">
                {dailyVolume.map((d, idx) => (
                  <div key={d.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>{d.label}</span>
                      <span>{d.value}</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.pct}%` }}
                        transition={{ duration: 0.9, delay: 0.15 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/analytics"
                className="mt-10 w-full inline-block text-center py-3 bg-white text-orange-600 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors"
              >
                View Detailed Report
              </Link>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 pointer-events-none">
              <Icon name="eco" className="text-[150px]" />
            </div>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
            </>
          )}
        </section>

        {/* Recent Orders */}
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
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
                        to="/orders"
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
            <Link to="/orders" className="text-sm font-bold text-orange-600 hover:underline">
              View All Order History
            </Link>
          </div>
        </section>
        )}
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
