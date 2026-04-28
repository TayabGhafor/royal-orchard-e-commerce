import { ReactNode, useState } from "react";
import AdminSidebar from "./Sidebar";
import AdminTopbar from "./Topbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex bg-stone-50 min-h-screen text-stone-900 font-body">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div className={`${sidebarCollapsed ? "ml-20" : "ml-64"} w-full flex flex-col min-h-screen`}>
        <AdminTopbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
