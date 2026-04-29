import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function AdminTopbar() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const navigate = useNavigate();
  const orders = useAdmin((s) => s.orders);
  const loadOrders = useAdmin((s) => s.loadOrders);
  const products = useAdmin((s) => s.products);
  const customers = useAdmin((s) => s.customers);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const storeUrl = (import.meta.env.VITE_STORE_URL as string | undefined) || "/";

  const newest = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [orders]);

  useEffect(() => {
    try {
      const lastSeen = localStorage.getItem("royalorchard-admin:lastSeenOrderAt") || "";
      const lastSeenMs = lastSeen ? new Date(lastSeen).getTime() : 0;
      const count = newest.filter((o) => new Date(o.createdAt).getTime() > lastSeenMs).length;
      setNewCount(count);
    } catch {
      setNewCount(0);
    }
  }, [newest]);

  useEffect(() => {
    loadOrders().catch(() => {});
    const id = window.setInterval(() => {
      loadOrders().catch(() => {});
    }, 30_000);
    return () => window.clearInterval(id);
  }, [loadOrders]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { orders: [], products: [], customers: [] };
    return {
      orders: orders
        .filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.customer.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            o.product.toLowerCase().includes(q),
        )
        .slice(0, 5),
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.variety.toLowerCase().includes(q) ||
            p.collection.toLowerCase().includes(q),
        )
        .slice(0, 5),
      customers: customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
        )
        .slice(0, 5),
    };
  }, [query, orders, products, customers]);

  const totalResults =
    results.orders.length + results.products.length + results.customers.length;

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

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
      <div ref={wrapperRef} className="relative max-w-md flex-1">
        <div
          className={[
            "group flex items-center gap-3 rounded-full border bg-white px-4 py-2.5",
            "transition-all duration-200",
            "border-stone-200 hover:border-stone-300 hover:shadow-sm",
            "focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100/70 focus-within:shadow-md",
            "focus-within:scale-[1.01]",
          ].join(" ")}
        >
          <Icon
            name="search"
            className="text-stone-400 transition-colors group-focus-within:text-orange-600"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search orders, products, customers…"
            className={[
              "bg-transparent outline-none flex-1 text-sm placeholder:text-stone-400",
              "transition-[width] duration-200",
              "w-full focus:w-[28rem]",
            ].join(" ")}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Clear"
            >
              <Icon name="close" className="text-base" />
            </button>
          )}
        </div>
        {open && query.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {totalResults === 0 ? (
              <div className="p-6 text-center text-sm text-stone-400">
                No matches for "{query}"
              </div>
            ) : (
              <div className="py-2">
                {results.orders.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Orders
                    </p>
                    {results.orders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => go("/orders")}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-3"
                      >
                        <Icon name="receipt_long" className="text-stone-400 text-base" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            #{o.id} · {o.customer}
                          </p>
                          <p className="text-xs text-stone-500 truncate">
                            {o.product} · {o.status}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-stone-600">
                          {formatPKR(o.total)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {results.products.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Products
                    </p>
                    {results.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => go("/products")}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-3"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{p.name}</p>
                          <p className="text-xs text-stone-500 truncate">
                            {p.variety} · {p.collection}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-stone-600">
                          {formatPKR(p.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {results.customers.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Customers
                    </p>
                    {results.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => go("/customers")}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-3"
                      >
                        <Icon name="person" className="text-stone-400 text-base" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{c.name}</p>
                          <p className="text-xs text-stone-500 truncate">{c.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Popover
          open={notifOpen}
          onOpenChange={(v) => {
            setNotifOpen(v);
            if (v) {
              loadOrders().catch(() => {});
            } else {
              try {
                const newestAt = newest[0]?.createdAt;
                if (newestAt) localStorage.setItem("royalorchard-admin:lastSeenOrderAt", newestAt);
              } catch {
                // ignore
              }
              setNewCount(0);
            }
          }}
        >
          <PopoverTrigger asChild>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600">
              <Icon name="notifications" />
              {newCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {newCount > 9 ? "9+" : newCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={10} className="w-80 p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-stone-900">Notifications</div>
                <div className="text-xs text-stone-500 font-semibold">New orders and updates</div>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-orange-600 hover:underline"
                onClick={() => {
                  setNotifOpen(false);
                  navigate("/orders");
                }}
              >
                View all
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {newest.length === 0 ? (
                <div className="p-6 text-center text-sm text-stone-500">
                  No notifications yet.
                </div>
              ) : (
                newest.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/orders", { state: { highlight: o.id } });
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-stone-50 transition flex items-center gap-3 border-b border-stone-50 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center flex-shrink-0">
                      <Icon name="receipt_long" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-stone-900 truncate">
                        New order · {o.customer}
                      </div>
                      <div className="text-xs text-stone-500 font-semibold truncate">
                        #{o.id.slice(-8)} · {formatPKR(o.total)}
                      </div>
                    </div>
                    <Icon name="arrow_forward" className="text-stone-400" />
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

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
            <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer">
              <Icon name="admin_panel_settings" className="text-base text-stone-500" />
              <span>Admin Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/")} className="gap-2 cursor-pointer">
              <Icon name="dashboard" className="text-base text-stone-500" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.assign(storeUrl)} className="gap-2 cursor-pointer">
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
