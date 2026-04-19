import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";

const Dashboard = () => {
  const orders = useAdmin((s) => s.orders);
  const customers = useAdmin((s) => s.customers);
  const products = useAdmin((s) => s.products);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { title: "Total Orders", value: orders.length.toString(), change: "+12.5%", icon: "receipt_long", tone: "text-emerald-600" },
    { title: "Revenue", value: formatPKR(revenue), change: "+8.2%", icon: "payments", tone: "text-emerald-600" },
    { title: "Active Users", value: customers.filter((c) => c.status === "Active").length.toString(), change: "-2.4%", icon: "groups", tone: "text-rose-500" },
  ];

  // Mock 7-day revenue trend
  const trend = [40, 65, 50, 85, 70, 95, 80];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Orchard Insights</h2>
            <p className="text-stone-500">Welcome back, Supervisor. Here's what's happening today.</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
              {delivered} delivered
            </span>
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full font-medium">
              {pending} pending
            </span>
            <span className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full font-medium">
              {products.length} products
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-start justify-between"
            >
              <div>
                <p className="text-sm text-stone-500">{item.title}</p>
                <h3 className="text-3xl font-bold mt-1">{item.value}</h3>
                <span className={`text-sm font-medium ${item.tone}`}>{item.change}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                <Icon name={item.icon} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-end justify-between mb-6">
            <h4 className="font-bold text-lg">Revenue Trends</h4>
            <span className="text-xs text-stone-500">Last 7 days (mock)</span>
          </div>
          <div className="h-64 flex items-end gap-3">
            {trend.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${h}%` }}
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg"
                />
                <span className="text-xs text-stone-500 font-medium">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <h4 className="font-bold text-lg">Recent Orders</h4>
            <Link to="/admin/orders" className="text-sm font-semibold text-orange-600 hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-wider border-y border-stone-100">
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="font-semibold">Customer</th>
                <th className="font-semibold">Product</th>
                <th className="font-semibold">Amount</th>
                <th className="font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                  <td className="px-6 py-4 font-mono text-sm">#{o.id}</td>
                  <td className="text-sm">{o.customer}</td>
                  <td className="text-sm text-stone-600">{o.product}</td>
                  <td className="text-sm font-semibold">{formatPKR(o.total)}</td>
                  <td>
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Shipped: "bg-blue-50 text-blue-700",
    Delivered: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] || "bg-stone-100"}`}>
      {status}
    </span>
  );
};

export default Dashboard;
