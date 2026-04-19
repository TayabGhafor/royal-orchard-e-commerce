import { useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { Icon } from "@/components/Icon";

const Analytics = () => {
  const orders = useAdmin((s) => s.orders);

  const { revenue, avg, delivered, pending, profit } = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const avg = orders.length ? Math.round(revenue / orders.length) : 0;
    const profit = Math.round(revenue * 0.32);
    return { revenue, avg, delivered, pending, profit };
  }, [orders]);

  const kpis = [
    { label: "Revenue", value: formatPKR(revenue), tone: "text-emerald-600", icon: "payments" },
    { label: "Avg Order", value: formatPKR(avg), tone: "text-stone-900", icon: "shopping_cart" },
    { label: "Conversion", value: "3.4%", tone: "text-blue-600", icon: "trending_up" },
    { label: "Profit (est.)", value: formatPKR(profit), tone: "text-orange-600", icon: "savings" },
  ];

  // Mock daily/weekly/monthly trend
  const monthly = [120, 180, 220, 260, 240, 320, 300, 360, 410, 380, 450, 480];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const max = Math.max(...monthly);

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-end flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Orchard Analytics</h1>
            <p className="text-stone-500 mt-1">Live performance metrics from your storefront.</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
            Export
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-start justify-between"
            >
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">{k.label}</p>
                <h3 className={`text-2xl font-bold mt-2 ${k.tone}`}>{k.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <Icon name={k.icon} className="text-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-end justify-between mb-6">
            <h4 className="font-bold text-lg">Monthly Revenue</h4>
            <span className="text-xs text-stone-500">2024 (mock)</span>
          </div>
          <div className="h-64 flex items-end gap-2">
            {monthly.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(v / max) * 100}%` }}
                  className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg hover:opacity-80 transition-opacity"
                  title={formatPKR(v * 1000)}
                />
                <span className="text-[10px] text-stone-500 font-medium">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h4 className="font-bold text-lg mb-4">Delivered vs Pending</h4>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-semibold text-emerald-600">Delivered</span>
                  <span>{delivered}</span>
                </div>
                <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${orders.length ? (delivered / orders.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-4 mb-2 text-sm">
                  <span className="font-semibold text-amber-600">Pending</span>
                  <span>{pending}</span>
                </div>
                <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${orders.length ? (pending / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h4 className="font-bold text-lg mb-4">Quick Insights</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-stone-500">Orders today</span>
                <span className="font-bold">{orders.filter((o) => Date.now() - new Date(o.createdAt).getTime() < 86400000).length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-stone-500">Orders this week</span>
                <span className="font-bold">{orders.filter((o) => Date.now() - new Date(o.createdAt).getTime() < 86400000 * 7).length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-stone-500">Total revenue</span>
                <span className="font-bold text-orange-600">{formatPKR(revenue)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
