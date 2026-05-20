import { motion, animate } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { formatPKR } from "@/lib/format";
import { resolvedOriginForAssets } from "@/lib/api";
import { useAdminAnalytics } from "@/hooks/use-admin-analytics";
import { formatRelative } from "@/hooks/use-realtime-tick";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#10b981", "#f59e0b", "#78716c", "#f43f5e"];

type StatVariant = "orange" | "amber" | "emerald" | "sky" | "violet" | "rose" | "stone";

const STAT_THEMES: Record<
  StatVariant,
  { ring: string; icon: string; glow: string; gradient: string }
> = {
  orange: {
    ring: "border-orange-200/80",
    icon: "bg-orange-500 text-white shadow-orange-500/30",
    glow: "bg-orange-400/20",
    gradient: "from-orange-50/90 via-white to-white",
  },
  amber: {
    ring: "border-amber-200/80",
    icon: "bg-amber-500 text-white shadow-amber-500/30",
    glow: "bg-amber-400/20",
    gradient: "from-amber-50/90 via-white to-white",
  },
  emerald: {
    ring: "border-emerald-200/80",
    icon: "bg-emerald-500 text-white shadow-emerald-500/30",
    glow: "bg-emerald-400/20",
    gradient: "from-emerald-50/90 via-white to-white",
  },
  sky: {
    ring: "border-sky-200/80",
    icon: "bg-sky-500 text-white shadow-sky-500/30",
    glow: "bg-sky-400/20",
    gradient: "from-sky-50/90 via-white to-white",
  },
  violet: {
    ring: "border-violet-200/80",
    icon: "bg-violet-500 text-white shadow-violet-500/30",
    glow: "bg-violet-400/20",
    gradient: "from-violet-50/90 via-white to-white",
  },
  rose: {
    ring: "border-rose-200/80",
    icon: "bg-rose-500 text-white shadow-rose-500/30",
    glow: "bg-rose-400/20",
    gradient: "from-rose-50/90 via-white to-white",
  },
  stone: {
    ring: "border-stone-200/80",
    icon: "bg-stone-600 text-white shadow-stone-500/30",
    glow: "bg-stone-400/15",
    gradient: "from-stone-50/90 via-white to-white",
  },
};

function imgSrc(src: string) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  const base = resolvedOriginForAssets();
  return src.startsWith("/") ? `${base}${src}` : `${base}/${src}`;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const c = animate(display, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => c.stop();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className="tabular-nums">{Math.round(display).toLocaleString()}</span>;
}

function AnimatedPKR({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const c = animate(display, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => c.stop();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps -- animate from previous display to new value
  return <span className="tabular-nums">{formatPKR(Math.round(display))}</span>;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  variant = "orange",
  delay = 0,
  pulse = false,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon: string;
  variant?: StatVariant;
  delay?: number;
  pulse?: boolean;
}) {
  const theme = STAT_THEMES[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm ring-1 ring-stone-900/[0.04] transition-shadow hover:shadow-lg ${theme.ring} ${theme.gradient} ${pulse ? "animate-pulse" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</p>
          <div className="mt-1.5 text-2xl font-extrabold tracking-tight text-stone-900 font-headline sm:text-[1.65rem]">
            {value}
          </div>
          {sub && <p className="mt-1 text-xs font-medium text-stone-500">{sub}</p>}
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md ${theme.icon}`}>
          <Icon name={icon} className="text-[22px]" />
        </div>
      </div>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${theme.glow}`} />
    </motion.div>
  );
}

function Section({
  title,
  subtitle,
  children,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm shadow-stone-900/[0.03] backdrop-blur-sm md:p-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 opacity-80" />
      <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-headline">{title}</h2>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ChartFallback({ height = 260 }: { height?: number }) {
  return (
    <div className="flex items-center justify-center text-sm text-stone-400" style={{ height }}>
      Not enough data for this chart yet.
    </div>
  );
}

const Analytics = () => {
  const bi = useAdminAnalytics();

  const loading = bi.isLoading;
  const refreshing = bi.isFetching && !bi.isLoading;
  const err = bi.error as Error | null;
  const d = bi.data;
  const lastSync = bi.dataUpdatedAt ? new Date(bi.dataUpdatedAt) : null;

  const refreshAnalytics = () => {
    void bi.refetch();
  };

  const salesCards = useMemo(() => {
    if (!d?.sales) return [];
    const s = d.sales;
    return [
      { label: "Total Sales", value: <AnimatedPKR value={s.totalSales} />, icon: "payments", variant: "orange" as const },
      { label: "Today's Sales", value: <AnimatedPKR value={s.todaySales} />, icon: "today", variant: "emerald" as const },
      { label: "Weekly Sales", value: <AnimatedPKR value={s.weeklySales} />, icon: "date_range", variant: "sky" as const },
      { label: "Monthly Sales", value: <AnimatedPKR value={s.monthlySales} />, icon: "calendar_month", variant: "violet" as const },
      { label: "Total Revenue", value: <AnimatedPKR value={s.revenue} />, sub: "Delivered orders", icon: "account_balance_wallet", variant: "amber" as const },
      { label: "Total Orders", value: <AnimatedNumber value={s.orders} />, icon: "receipt_long", variant: "stone" as const },
      { label: "Returned Orders", value: <AnimatedNumber value={s.returnedOrders} />, icon: "assignment_return", variant: "rose" as const },
      { label: "Pending Orders", value: <AnimatedNumber value={s.pendingOrders} />, icon: "hourglass_top", variant: "amber" as const },
    ];
  }, [d?.sales]);

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-[1600px] space-y-10 p-4 pb-16 sm:p-6 lg:p-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-orange-100/80 bg-gradient-to-br from-orange-50 via-white to-amber-50/40 p-6 shadow-sm sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-700">
                <Icon name="analytics" className="text-sm" />
                Business intelligence
              </p>
              <h1 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                Orchard Analytics
              </h1>
              <p className="max-w-2xl text-sm font-medium text-stone-600 sm:text-base">
                Live order pipeline, returns, inventory signals, and trending products — synced from MongoDB every 15 seconds and on every admin change.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-sm">
                <span className={`h-2 w-2 rounded-full bg-emerald-500 ${refreshing ? "animate-ping" : "animate-pulse"}`} />
                {refreshing ? "Syncing…" : "Live"}
                {lastSync ? ` · ${formatRelative(lastSync)}` : ""}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={refreshAnalytics}
                    disabled={bi.isFetching}
                    aria-label="Refresh analytics"
                    className="flex size-11 items-center justify-center rounded-full border border-stone-200/90 bg-white/90 text-stone-600 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm transition hover:border-orange-300 hover:bg-orange-50/80 hover:text-orange-700 active:scale-95 disabled:opacity-60"
                  >
                    <Icon
                      name="refresh"
                      className={`text-[22px] leading-none ${refreshing ? "animate-spin" : ""}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-semibold">
                  Refresh analytics now
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {refreshing && !loading && (
          <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-2 text-xs font-semibold text-orange-800">
            <Icon name="sync" className="animate-spin text-base" />
            Updating charts with latest orders & inventory…
          </div>
        )}

        {err && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="error" /> {err.message || "Failed to load analytics"}
            </div>
            <button
              type="button"
              onClick={() => bi.refetch()}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Sales KPI grid */}
        <div className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-4 ${refreshing && !loading ? "opacity-95" : ""}`}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[130px] rounded-2xl" />
              ))
            : salesCards.map((c, i) => (
                <StatCard key={c.label} {...c} delay={i * 0.04} pulse={refreshing && (c.label === "Pending Orders" || c.label === "Returned Orders")} />
              ))}
        </div>

        {/* Sales charts */}
        <Section title="Sales analytics" subtitle="Daily trend, monthly revenue, and order status mix" delay={0.05}>
          {loading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : d?.sales ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h3 className="mb-3 text-sm font-bold text-stone-700">Daily sales trend</h3>
                <div className="h-[280px] w-full">
                  {d.sales.dailySalesTrend.length === 0 ? (
                    <ChartFallback />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={d.sales.dailySalesTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#78716c" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#78716c" />
                        <RechartsTooltip formatter={(v: number) => formatPKR(Number(v))} />
                        <Line type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-stone-700">Order status</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {d.sales.orderStatusDistribution.map((row) => (
                    <span
                      key={row.name}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                        row.name === "Delivered"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : row.name === "Pending"
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : row.name === "Returned"
                              ? "border-rose-200 bg-rose-50 text-rose-800"
                              : "border-stone-200 bg-stone-50 text-stone-700"
                      }`}
                    >
                      {row.name}: {row.value}
                    </span>
                  ))}
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={d.sales.orderStatusDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={76}
                        paddingAngle={2}
                      >
                        {d.sales.orderStatusDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lg:col-span-3">
                <h3 className="mb-3 text-sm font-bold text-stone-700">Monthly revenue trend</h3>
                <div className="h-[260px] w-full">
                  {d.sales.monthlyRevenueTrend.length === 0 ? (
                    <ChartFallback height={220} />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={d.sales.monthlyRevenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#78716c" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#78716c" />
                        <RechartsTooltip formatter={(v: number) => formatPKR(Number(v))} />
                        <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </Section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Section title="Trending products" subtitle="Score = views×0.3 + sales×0.5 + cart adds×0.2" delay={0.08}>
            {loading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : d?.trending?.items?.length ? (
              <>
                <div className="mb-6 h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={[...d.trending.items].reverse()} margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} stroke="#57534e" />
                      <RechartsTooltip />
                      <Bar dataKey="trendingScore" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {d.trending.items.map((p, idx) => (
                    <motion.div
                      key={p.productId}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-4 rounded-xl border border-stone-100 bg-stone-50/50 p-3"
                    >
                      <img
                        src={imgSrc(p.image)}
                        alt=""
                        className="h-14 w-14 rounded-lg object-cover ring-2 ring-white shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-bold text-stone-900">{p.name}</p>
                          <span className="shrink-0 text-xs font-bold text-orange-600">{p.trendingScore}</span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Sales {p.salesCount} · Views {p.viewsCount}
                        </p>
                        <Progress value={p.progress} className="mt-2 h-1.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-stone-500">No products yet.</p>
            )}
          </Section>

          <Section title="Upcoming trending" subtitle="Velocity from daily views & cart adds" delay={0.1}>
            {loading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : d?.upcoming?.items?.length ? (
              <div className="grid gap-4">
                {d.upcoming.items.map((p, idx) => (
                  <motion.div
                    key={p.productId}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-white p-4 shadow-sm"
                  >
                    <img src={imgSrc(p.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          {p.label}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.badge === "High"
                              ? "bg-rose-100 text-rose-800"
                              : p.badge === "Medium"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <p className="mt-1 font-bold text-stone-900">{p.name}</p>
                      <p className="text-xs text-stone-600">
                        Views +{p.growthPercent}% vs prior week · Cart momentum {p.cartMomentum > 0 ? "+" : ""}
                        {p.cartMomentum}%
                      </p>
                      <p className="mt-1 text-xs font-semibold text-violet-800">Expected demand: {p.expectedDemand}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-stone-500">
                Not enough daily history yet. Open product pages and add items to cart to build velocity signals.
              </p>
            )}
          </Section>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Section title="Returns analytics" subtitle="Return volume, rate, reasons, and most returned SKUs" delay={0.1}>
            {loading ? (
              <Skeleton className="h-[280px] w-full rounded-xl" />
            ) : d?.returns ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <p className="text-xs font-bold uppercase text-stone-400">Total returns</p>
                    <p className="mt-1 text-3xl font-extrabold text-stone-900">{d.returns.totalReturns}</p>
                  </div>
                  <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <p className="text-xs font-bold uppercase text-stone-400">Return rate</p>
                    <p className="mt-1 text-3xl font-extrabold text-stone-900">{d.returns.returnRate}%</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-stone-700">Reasons</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(d.returns.reasons).map(([k, v]) => (
                      <span
                        key={k}
                        className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700"
                      >
                        {k.replace("_", " ")}: {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-bold text-stone-700">Most returned products</h3>
                  <div className="h-[200px] w-full">
                    {d.returns.mostReturned.length === 0 ? (
                      <ChartFallback height={180} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={d.returns.mostReturned.map((r) => ({ name: r.name.slice(0, 14), qty: r.quantityReturned }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <RechartsTooltip />
                          <Bar dataKey="qty" fill="#dc2626" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </Section>

          <Section title="Inventory intelligence" subtitle="Out of stock, low, critical, and runway estimates" delay={0.12}>
            {loading ? (
              <Skeleton className="h-[280px] w-full rounded-xl" />
            ) : d?.inventory ? (
              <div className="space-y-6">
                {[
                  { title: "Out of stock", tone: "border-red-200 bg-red-50/60", items: d.inventory.outOfStock },
                  { title: "Critical (< 5 units)", tone: "border-orange-200 bg-orange-50/50", items: d.inventory.criticalStock },
                  { title: "Low stock (< 10 units)", tone: "border-amber-200 bg-amber-50/40", items: d.inventory.lowStock },
                ].map((block) => (
                  <div key={block.title} className={`rounded-xl border p-4 ${block.tone}`}>
                    <h3 className="text-sm font-bold text-stone-900">{block.title}</h3>
                    <div className="mt-3 space-y-2">
                      {block.items.length === 0 ? (
                        <p className="text-xs text-stone-600">None</p>
                      ) : (
                        block.items.slice(0, 6).map((it) => (
                          <div key={it.productId} className="flex items-center justify-between gap-2 text-sm">
                            <span className="truncate font-medium text-stone-800">{it.name}</span>
                            <span className="shrink-0 text-xs font-bold text-stone-700">
                              Qty {it.quantity}
                              {it.daysRemainingEstimate != null ? ` · ~${it.daysRemainingEstimate}d` : ""}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </Section>
        </div>

        <Section title="Seasonal inventory analytics" subtitle="Season tags on products vs trailing 30-day sales" delay={0.12}>
          {loading ? (
            <Skeleton className="h-[280px] w-full rounded-xl" />
          ) : d?.seasonal ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.seasonal.seasonVsSales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <RechartsTooltip formatter={(v: number, name) => (name === "sales" ? formatPKR(v) : v)} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales (30d)" fill="#ea580c" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="stock" name="Stock units" fill="#84cc16" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </Section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Section title="Stock recommendations" subtitle="Rule-based signals from velocity, season, and runway" delay={0.14}>
            {loading ? (
              <Skeleton className="h-[260px] w-full rounded-xl" />
            ) : (
              <div className="grid gap-4">
                {(d?.recommendations?.items || []).map((r, idx) => (
                  <motion.div
                    key={`${r.productId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-sky-950">{r.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          r.priority === "High"
                            ? "bg-rose-100 text-rose-800"
                            : r.priority === "Medium"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {r.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-700">{r.detail}</p>
                  </motion.div>
                ))}
                {!d?.recommendations?.items?.length && (
                  <p className="text-sm text-stone-500">Recommendations will appear as sales and inventory diverge.</p>
                )}
              </div>
            )}
          </Section>

          <Section title="Business insights" subtitle="Auto-generated highlights" delay={0.15}>
            {loading ? (
              <Skeleton className="h-[260px] w-full rounded-xl" />
            ) : (
              <div className="grid gap-3">
                {(d?.insights?.items || []).map((ins, idx) => (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border p-4 ${
                      ins.tone === "positive"
                        ? "border-emerald-100 bg-emerald-50/50"
                        : ins.tone === "warning"
                          ? "border-amber-200 bg-amber-50/60"
                          : "border-stone-100 bg-white"
                    }`}
                  >
                    <p className="text-sm font-bold text-stone-900">{ins.title}</p>
                    <p className="mt-1 text-sm text-stone-600">{ins.detail}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        </div>

        <Section title="Most visited products" subtitle="Views, sales, conversion, and hit chart" delay={0.16}>
          {loading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : d?.hits ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="h-[280px] w-full">
                {d.hits.chart.length === 0 ? (
                  <ChartFallback />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.hits.chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="hits" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-3">
                {d.hits.items.slice(0, 8).map((h) => (
                  <div key={h.productId} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3">
                    <img src={imgSrc(h.image)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-stone-900">{h.name}</p>
                      <p className="text-xs text-stone-500">
                        {h.views.toLocaleString()} views · {h.sales} sales · {h.conversionPercent}% conv.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Section>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
