import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Icon } from "@/components/Icon";
import {
  StatCardSkeleton,
  TableSkeleton,
} from "@/components/admin/AdminSkeletons";

const Customers = () => {
  const customers = useAdmin((s) => s.customers);
  const active = customers.filter((c) => c.status === "Active").length;
  // Mock "new today"
  const newToday = 156;
  const { loading, error, retry } = usePageLoading({ delay: 700 });

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-orange-900">Customers</h1>
          <p className="text-stone-500 mt-1">
            Manage your registered shoppers and their account status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            : [
            { title: "Total Customers", value: customers.length.toLocaleString() },
            { title: "Active Today", value: active.toLocaleString() },
            { title: "New Signups", value: newToday.toLocaleString() },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-stone-100"
            >
              <p className="text-stone-500">{item.title}</p>
              <h3 className="text-3xl font-bold mt-1">{item.value}</h3>
            </motion.div>
          ))}
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

        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 flex justify-between items-center">
            <button className="bg-stone-100 px-4 py-2 rounded-full text-sm font-semibold hover:bg-stone-200">
              Filter
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              Add Customer
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-wider border-y border-stone-100">
                <th className="text-left px-6 py-3 font-semibold">Customer</th>
                <th className="text-left font-semibold">Status</th>
                <th className="text-left font-semibold">Orders</th>
                <th className="text-left font-semibold">Spent</th>
                <th className="text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-stone-500">{c.email}</div>
                  </td>
                  <td>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        c.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="text-sm">{c.orders}</td>
                  <td className="text-sm font-semibold">{formatPKR(c.spent)}</td>
                  <td className="text-sm text-stone-500">{c.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
