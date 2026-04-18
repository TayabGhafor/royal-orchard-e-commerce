import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export const SiteShell = ({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) => (
  <div className="min-h-screen flex flex-col bg-surface text-on-surface">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
    <CartDrawer />
  </div>
);
