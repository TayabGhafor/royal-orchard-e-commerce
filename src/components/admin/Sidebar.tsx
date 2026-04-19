import { NavLink } from "react-router-dom";
import { Icon } from "@/components/Icon";

const menu = [
  { name: "Dashboard", path: "/admin", icon: "dashboard", end: true },
  { name: "Inventory", path: "/admin/products", icon: "inventory_2", end: false },
  { name: "Orders", path: "/admin/orders", icon: "receipt_long", end: false },
  { name: "Customers", path: "/admin/customers", icon: "groups", end: false },
  { name: "Analytics", path: "/admin/analytics", icon: "analytics", end: false },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r border-stone-200 p-5 flex flex-col gap-2 z-40">
      <div className="px-2 mb-6">
        <h1 className="font-headline font-extrabold text-xl tracking-tight text-orange-900">
          RoyalOrchard
        </h1>
        <p className="text-xs text-stone-400 font-medium mt-1 uppercase tracking-widest">Admin</p>
      </div>

      <nav className="flex flex-col gap-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`
            }
          >
            <Icon name={item.icon} className="text-xl" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-orange-50 border border-orange-100">
        <p className="text-xs font-bold text-orange-900">Mock Data</p>
        <p className="text-[11px] text-orange-700/70 mt-1 leading-snug">
          All admin changes persist in your browser via localStorage.
        </p>
      </div>
    </aside>
  );
}
