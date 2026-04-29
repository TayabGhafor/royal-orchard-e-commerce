import { Link, Navigate } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { useOrders } from "@/store/orders";
import { formatPKR } from "@/lib/format";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

const Account = () => {
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  const orders = useOrders((s) => s.orders);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });
  const { loading, error, retry } = usePageLoading({ delay: 600 });

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

  const startEdit = () => {
    setForm({ name: user.name, phone: user.phone ?? "", address: user.address ?? "" });
    setEditing(true);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    updateProfile({
      name: form.name.trim(),
      phone: form.phone?.trim() ?? "",
      address: form.address?.trim() ?? "",
    });
    toast.success("Profile updated. Changes will apply to new checkouts.");
    setEditing(false);
  };

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Royal Orchard · Account</p>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">My Account</h1>
          <p className="text-on-surface-variant font-medium">Manage your profile and review your orchard journey.</p>
        </header>

        {error && (
          <div className="flex items-center justify-between gap-4 px-5 py-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="error" /> {error}
            </div>
            <button
              onClick={retry}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          </div>
        ) : (
        <>
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary text-on-primary font-headline font-extrabold text-2xl flex items-center justify-center shadow-md flex-shrink-0">
              {initials || <Icon name="person" />}
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">{user.name}</h2>
                  <p className="text-on-surface-variant text-sm">{user.email}</p>
                </div>
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <Icon name="edit" className="text-sm" /> Edit Profile
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
                  <InfoRow icon="call" label="Phone" value={user.phone || "Not added"} />
                  <InfoRow icon="badge" label="Role" value={user.role === "admin" ? "Administrator" : "Customer"} />
                  <InfoRow icon="location_on" label="Address" value={user.address || "Not added"} full />
                </div>
              ) : (
                <form onSubmit={saveProfile} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" icon="person">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="Your full name"
                        maxLength={100}
                      />
                    </Field>
                    <Field label="Email (locked)" icon="lock">
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full bg-surface-container-highest/50 border-none rounded-lg px-4 py-3 outline-none text-on-surface-variant cursor-not-allowed"
                      />
                    </Field>
                    <Field label="Phone" icon="call">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-on-surface"
                        placeholder="+92 300 0000000"
                        maxLength={20}
                      />
                    </Field>
                    <Field label="Role" icon="badge">
                      <input
                        type="text"
                        value={user.role === "admin" ? "Administrator" : "Customer"}
                        readOnly
                        className="w-full bg-surface-container-highest/50 border-none rounded-lg px-4 py-3 outline-none text-on-surface-variant cursor-not-allowed"
                      />
                    </Field>
                  </div>
                  <Field label="Delivery Address" icon="location_on">
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none"
                      placeholder="Street, city, postal code"
                      maxLength={500}
                    />
                  </Field>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                    >
                      <Icon name="check" className="text-base" /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                    <p className="text-xs text-on-surface-variant ml-auto">
                      <Icon name="info" className="text-sm align-text-bottom mr-1" />
                      Updates apply to your next checkout.
                    </p>
                  </div>
                </form>
              )}
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
        </>
        )}
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

const Field = ({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
      <Icon name={icon} className="text-sm text-primary" />
      {label}
    </label>
    {children}
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
