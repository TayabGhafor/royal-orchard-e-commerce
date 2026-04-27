import { useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { usePageLoading } from "@/hooks/use-page-loading";
import { useRealtimeTick, formatRelative } from "@/hooks/use-realtime-tick";
import {
  StatCardSkeleton,
  ChartSkeleton,
} from "@/components/admin/AdminSkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const Analytics = () => {
  const orders = useAdmin((s) => s.orders);
  const products = useAdmin((s) => s.products);
  const customers = useAdmin((s) => s.customers);
  const { loading, error, retry } = usePageLoading({ delay: 800 });
  const { lastUpdated } = useRealtimeTick(30000);
  // Tick a 1s render so "Xs ago" stays fresh.
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { revenue, avg, profit } = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const avg = orders.length ? Math.round(revenue / orders.length) : 0;
    const profit = Math.round(revenue * 0.32);
    return { revenue, avg, profit };
  }, [orders]);

  const kpis = [
    {
      label: "Total Revenue",
      value: formatPKR(revenue),
      change: "+12%",
      trend: "up",
      icon: "payments",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      accent: "border-amber-500",
    },
    {
      label: "Average Order Value",
      value: formatPKR(avg),
      icon: "shopping_basket",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      accent: "",
    },
    {
      label: "Conversion Rate",
      value: "3.4%",
      icon: "ads_click",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      accent: "",
    },
    {
      label: "Net Profit",
      value: formatPKR(profit),
      icon: "account_balance_wallet",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      accent: "",
    },
  ];

  // Weekly revenue trend (mock heights)
  const trend = [40, 65, 45, 85, 60, 95, 50];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const peakIdx = trend.indexOf(Math.max(...trend));

  // Top selling varieties — derive from product list
  const topVarieties = useMemo(() => {
    const palette = ["bg-orange-500", "bg-amber-500", "bg-emerald-500"];
    const shares = [42, 28, 15];
    return products.slice(0, 3).map((p, i) => ({
      name: p.name,
      share: shares[i],
      color: palette[i],
    }));
  }, [products]);

  const newCustomers = customers.filter((c) => c.status === "Active").length;
  const dateRange = (() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} - ${fmt(end)}, ${end.getFullYear()}`;
  })();

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-2 font-headline">
              Orchard Analytics
            </h1>
            <p className="text-stone-500 font-medium">
              Detailed performance insights for your premium harvest
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live · updated {formatRelative(lastUpdated)}
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border border-stone-100">
            <button className="px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 rounded-full transition-all">
              7 Days
            </button>
            <button className="px-6 py-2 text-sm font-bold bg-orange-500 text-white rounded-full shadow-md shadow-orange-500/20">
              {dateRange}
            </button>
            <button className="p-2 text-stone-400 hover:text-orange-600 transition-colors">
              <Icon name="calendar_today" />
            </button>
            </div>
          </div>
        </div>

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

        {/* KPI Bento */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between ${
                k.accent ? `border-b-4 ${k.accent}` : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${k.iconBg} ${k.iconColor}`}>
                  <Icon name={k.icon} />
                </div>
                {k.change && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {k.change}
                    <Icon name="trending_up" className="text-[14px]" />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                  {k.label}
                </p>
                <h3 className="text-3xl font-extrabold text-stone-900 font-headline">{k.value}</h3>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Revenue Trends */}
        {loading ? <ChartSkeleton /> : (
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-headline">Revenue Trends</h2>
              <p className="text-sm text-stone-500">
                Comparing performance across orchard sectors
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-stone-600">Export</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-stone-600">Local Market</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 w-full border-b border-stone-100">
            {trend.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-t-lg relative group transition-all ${
                  i === peakIdx
                    ? "bg-orange-500"
                    : "bg-orange-200/60 hover:bg-orange-400/70"
                }`}
              >
                {i === peakIdx && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-orange-500 text-white shadow p-1 rounded">
                    Peak
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </section>
        )}

        {/* Bottom Two Columns */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-4">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-3 flex-1 rounded-full" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Varieties */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-900 font-headline">
                Top Selling Varieties
              </h2>
              <button className="text-orange-600 text-sm font-bold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-6">
              {topVarieties.map((v) => (
                <div key={v.name} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-700 flex-shrink-0 flex items-center justify-center">
                    <Icon name="nutrition" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-stone-900">{v.name}</span>
                      <span className="text-xs font-bold text-stone-500">{v.share}% Share</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${v.color} h-full`}
                        style={{ width: `${v.share}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {topVarieties.length === 0 && (
                <p className="text-sm text-stone-400 text-center py-6">No products yet.</p>
              )}
            </div>
          </div>

          {/* Customer Acquisition */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 mb-6 font-headline">
              Customer Acquisition
            </h2>
            <div className="bg-stone-50 rounded-xl p-6 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                  Weekly Signups
                </p>
                <h4 className="text-2xl font-extrabold text-stone-900 font-headline">
                  {customers.length.toLocaleString()}
                </h4>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-stone-200 flex items-center justify-center">
                <span className="text-xs font-black text-orange-600">+8%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-stone-100 rounded-xl">
                <Icon name="person_add" className="text-emerald-600 mb-2" />
                <p className="text-xs font-bold text-stone-400">New Customers</p>
                <p className="text-lg font-extrabold">{newCustomers}</p>
              </div>
              <div className="p-4 border border-stone-100 rounded-xl">
                <Icon name="replay" className="text-amber-600 mb-2" />
                <p className="text-xs font-bold text-stone-400">Repeat Rate</p>
                <p className="text-lg font-extrabold">64%</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <h4 className="text-sm font-bold text-stone-900">Acquisition Channels</h4>
              {[
                { label: "Organic Search", pct: 45, dot: "bg-emerald-500" },
                { label: "Social Referrals", pct: 30, dot: "bg-amber-500" },
                { label: "Direct", pct: 25, dot: "bg-stone-300" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className="text-sm text-stone-600 flex-1">{c.label}</span>
                  <span className="text-sm font-bold">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics;
