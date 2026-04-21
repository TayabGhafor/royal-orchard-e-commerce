import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

export default function AdminTopbar() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const navigate = useNavigate();
  const initials = (user?.name || "AD")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 max-w-md flex-1">
        <Icon name="search" className="text-stone-400" />
        <input
          placeholder="Search orders, products, customers…"
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-stone-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600">
          <Icon name="notifications" />
        </button>
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-orange-600"
        >
          View Store
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              Admin
            </span>
            <span className="text-xs text-stone-500 mt-1 max-w-[180px] truncate">
              {user?.email || "—"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
            {initials}
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
            aria-label="Sign out"
          >
            <Icon name="logout" className="text-sm" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
