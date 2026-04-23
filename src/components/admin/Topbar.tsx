import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

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
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600">
          <Icon name="notifications" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-orange-600"
        >
          <Icon name="storefront" className="text-sm" />
          View Store
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Open profile menu"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
            >
              <span className="relative">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {initials}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </span>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-bold text-stone-800 max-w-[120px] truncate">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                  Administrator
                </span>
              </div>
              <Icon name="expand_more" className="text-stone-400 text-base group-hover:text-stone-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="px-2 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-sm">
                  {initials}
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-bold text-stone-900 truncate">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500 truncate">
                    {user?.email || "—"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/account")} className="gap-2 cursor-pointer">
              <Icon name="person" className="text-base text-stone-500" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2 cursor-pointer">
              <Icon name="dashboard" className="text-base text-stone-500" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/")} className="gap-2 cursor-pointer">
              <Icon name="storefront" className="text-base text-stone-500" />
              <span>View Storefront</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
            >
              <Icon name="logout" className="text-base" />
              <span className="font-semibold">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
