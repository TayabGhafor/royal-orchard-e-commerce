import { ReactNode, useState } from "react";
import AdminSidebar from "./Sidebar";
import AdminTopbar from "./Topbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 font-body text-stone-900">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-200 ${
          sidebarCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <AdminTopbar />
        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
