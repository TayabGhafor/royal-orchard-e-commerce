import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";

export default function AdminTopbar() {
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
        <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
          AD
        </div>
      </div>
    </header>
  );
}
