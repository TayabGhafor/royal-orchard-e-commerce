import { Link, Navigate } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { useAdmin } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import { useMemo } from "react";

const Account = () => {
  const user = useAuth((s) => s.user);
  const orders = useAdmin((s) => s.orders);

  const myOrders = useMemo(
    () => (user ? orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()) : []),
    [orders, user],
  );

  if (!user) return <Navigate to="/login" replace />;

  const spent = myOrders
    .filter((o) => o.status !== "Cancelled" && o.status !== "Returned")
    .reduce((s, o) => s + o.total, 0);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Royal Orchard · Account</p>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">My Account</h1>
          <p className="text-on-surface-variant font-medium">Manage your profile and review your orchard journey.</p>
        </header>

        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-8 flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary text-on-primary font-headline font-extrabold text-2xl flex items-center justify-center shadow-md">
            {initials || <Icon name="person" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-headline font-bold text-on-surface">{user.name}</h2>
            <p className="text-on-surface-variant text-sm mb-4">{user.email}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <InfoRow icon="call" label="Phone" value={user.phone || "Not added"} />
              <InfoRow icon="badge" label="Role" value={user.role === "admin" ? "Administrator" : "Customer"} />
              <InfoRow icon="location_on" label="Address" value={user.address || "Not added"} full />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Stat icon="receipt_long" label="Orders" value={String(myOrders.length)} />
          <Stat icon="check_circle" label="Delivered" value={String(myOrders.filter((o) => o.status === "Delivered").length)} />
          <Stat icon="payments" label="Lifetime Spend" value={formatPKR(spent)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard to="/orders" icon="local_shipping" title="My Orders" subtitle="Track & manage your deliveries" />
          <ActionCard to="/shop" icon="storefront" title="Continue Shopping" subtitle="Discover more orchard treasures" />
        </div>
      </div>
    </SiteShell>
  );
};

const InfoRow = ({ icon, label, value, full }: { icon: string; label: string; value: string; full?: boolean }) => (
  <div className={`flex items-start gap-2 ${full ? "sm:col-span-2" : ""}`}>
    <Icon name={icon} className="text-primary text-base mt-0.5" />
    <div>
      <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{label}</p>
      <p className="text-on-surface">{value}</p>
    </div>
  </div>
);

const Stat = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
      <Icon name={icon} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{label}</p>
      <p className="text-xl font-headline font-extrabold text-on-surface">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ to, icon, title, subtitle }: { to: string; icon: string; title: string; subtitle: string }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
  >
    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform">
      <Icon name={icon} />
    </div>
    <div className="flex-1">
      <p className="font-headline font-bold text-on-surface">{title}</p>
      <p className="text-xs text-on-surface-variant">{subtitle}</p>
    </div>
    <Icon name="chevron_right" className="text-on-surface-variant group-hover:text-primary transition-colors" />
  </Link>
);

export default Account;
