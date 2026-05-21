import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

const menu = [
  { name: "Dashboard", path: "/", icon: "dashboard", end: true },
  { name: "Inventory", path: "/products", icon: "inventory_2", end: false },
  { name: "Orders", path: "/orders", icon: "receipt_long", end: false },
  { name: "Customers", path: "/customers", icon: "groups", end: false },
  { name: "Analytics", path: "/analytics", icon: "analytics", end: false },
  { name: "Blog", path: "/blogs", icon: "article", end: false },
  { name: "Chatbot KB", path: "/chatbot-knowledge", icon: "smart_toy", end: false },
];

export default function AdminSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const signOut = useAuth((s) => s.signOut);
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };
  return (
    <aside
      className={`${
        collapsed ? "w-20 px-3" : "w-64 p-5"
      } h-screen fixed top-0 left-0 bg-white border-r border-stone-200 flex flex-col gap-2 z-40 transition-[width,padding] duration-200`}
    >
      <div className={`${collapsed ? "px-0" : "px-2"} mb-6`}>
        <h1
          className={`font-headline font-extrabold tracking-tight text-orange-900 ${
            collapsed ? "text-lg text-center" : "text-xl"
          }`}
        >
          {collapsed ? "RO" : "RoyalOrchard"}
        </h1>
        <p
          className={`text-xs text-stone-400 font-medium mt-1 uppercase tracking-widest ${
            collapsed ? "text-center" : ""
          }`}
        >
          {collapsed ? "Admin" : "Admin"}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`
            }
            title={collapsed ? item.name : undefined}
          >
            <Icon name={item.icon} className="text-xl" />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className={`group flex items-center ${
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          } py-3 rounded-lg text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors border border-transparent hover:border-stone-200`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-stone-200/60 flex items-center justify-center">
            <Icon name={collapsed ? "chevron_right" : "chevron_left"} className="text-xl text-stone-600" />
          </span>
          {!collapsed && <span>{collapsed ? "Expand" : "Collapse"}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`group flex items-center ${
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          } py-3 rounded-lg text-sm font-semibold text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-100`}
          title={collapsed ? "Sign out" : undefined}
        >
          <span className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-rose-100 flex items-center justify-center">
            <Icon name="logout" className="text-base text-stone-500 group-hover:text-rose-600" />
          </span>
          {!collapsed && (
            <span className="flex flex-col items-start leading-tight">
              <span>Sign out</span>
              <span className="text-[10px] font-medium text-stone-400 group-hover:text-rose-500/80 max-w-[140px] truncate">
                {user?.email || "Admin"}
              </span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
