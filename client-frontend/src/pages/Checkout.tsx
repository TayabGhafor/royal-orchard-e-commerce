import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useAuth } from "@/store/auth";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  address: z.string().trim().min(10, "Please enter a full address").max(500),
});

type Payment = "cod" | "card" | "easypaisa" | "jazzcash";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const addOrder = useOrders((s) => s.addOrder);
  const upsertCustomer = useOrders((s) => s.upsertCustomer);
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });
  const [payment, setPayment] = useState<Payment>("cod");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const sub = subtotal();
  const tax = Math.round(sub * 0.05);
  const total = sub + tax;
  const { loading, error, retry } = usePageLoading({ delay: 600 });

  if (items.length === 0 && !submitting) {
    return <Navigate to="/shop" replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    (async () => {
      const productSummary =
        items.length === 1
          ? `${items[0].name} (${items[0].weight})`
          : `${items[0].name} (${items[0].weight}) +${items.length - 1} more`;
      const totalQty = items.reduce((n, it) => n + it.quantity, 0);
      const email = user?.email ?? `${form.name.toLowerCase().replace(/\s+/g, ".")}@guest.local`;
      try {
        await api<{ order: unknown }>("/api/orders/guest", {
          method: "POST",
          body: JSON.stringify({
            guest: { email },
            deliveryDetails: { name: form.name, phone: form.phone, address: form.address },
            paymentMethod:
              payment === "cod"
                ? "COD"
                : payment === "easypaisa"
                ? "Easypaisa"
                : payment === "jazzcash"
                ? "JazzCash"
                : "Card",
            pricing: { shipping: 0, tax, total },
            items: items.map((it) => ({
              product: it.productId,
              weight: it.weight,
              quantity: it.quantity,
            })),
          }),
        });

        // Keep local order store in sync for UI sections that still read it.
        addOrder({
          customer: form.name,
          email,
          product: productSummary,
          quantity: totalQty,
          total,
          address: form.address,
          paid: payment !== "cod",
          paymentMethod: payment,
          status: "Processing",
        });
        upsertCustomer({ name: form.name, email, spent: total });
        if (user) updateProfile({ address: form.address, phone: form.phone, name: form.name });
        clear();
        toast.success("Order placed! We'll be in touch shortly.");
        navigate("/");
      } catch (err: any) {
        toast.error(err?.message || "Unable to place order right now");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const paymentOptions: { id: Payment; label: string; sub: string; icon: string }[] = [
    { id: "cod", label: "Cash on Delivery", sub: "Pay when your fruit arrives", icon: "handshake" },
    { id: "card", label: "Credit Card", sub: "Visa, Mastercard, PayPak", icon: "credit_card" },
    { id: "easypaisa", label: "Easypaisa", sub: "Instant mobile payment", icon: "account_balance_wallet" },
    { id: "jazzcash", label: "JazzCash", sub: "Secure mobile wallet", icon: "smartphone" },
  ];

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
            Finalize Your Harvest
          </h1>
          <p className="text-on-surface-variant font-medium">
            Review your selection of sun-ripened premium mangoes.
          </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            </div>
            <div className="lg:col-span-5">
              <Skeleton className="h-96 rounded-lg" />
            </div>
          </div>
        ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <Icon name="local_shipping" className="text-on-primary-container" />
                </div>
                <h2 className="text-2xl font-headline font-bold tracking-tight">Delivery Details</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Haris Ahmed"
                      className="w-full bg-surface-container-low border-none rounded-lg px-5 py-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant ml-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className="w-full bg-surface-container-low border-none rounded-lg px-5 py-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">Delivery Address</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Full street address, apartment, suite, building, floor, etc."
                    className="w-full bg-surface-container-low border-none rounded-lg px-5 py-4 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <Icon name="payments" className="text-on-secondary-container" />
                </div>
                <h2 className="text-2xl font-headline font-bold tracking-tight">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map((opt) => {
                  const active = payment === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPayment(opt.id)}
                      className={`relative flex items-center p-5 rounded-lg bg-surface-container-lowest border-2 transition-all text-left ${
                        active ? "border-primary" : "border-transparent hover:border-primary-container"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                          active ? "bg-primary-container border-primary" : "border-outline-variant"
                        }`}
                      >
                        {active && <Icon name="circle" filled className="text-xs text-on-primary-container" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{opt.label}</p>
                        <p className="text-xs text-on-surface-variant">{opt.sub}</p>
                      </div>
                      <Icon name={opt.icon} className="text-on-surface-variant" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-headline font-bold mb-8">What happens next?</h3>
              <div className="relative flex items-start justify-between">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-surface-container-highest -z-0" />
                <div className="absolute top-5 left-0 w-1/4 h-0.5 bg-primary -z-0" />
                {[
                  { label: "Pending", icon: "task_alt", active: true },
                  { label: "Processing", icon: "inventory" },
                  { label: "Shipped", icon: "local_shipping" },
                  { label: "Delivered", icon: "check_circle" },
                ].map((s) => (
                  <div key={s.label} className="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                        s.active ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline-variant"
                      }`}
                    >
                      <Icon name={s.icon} className="text-sm" />
                    </div>
                    <span className={`text-xs ${s.active ? "font-bold text-on-surface" : "font-medium text-on-surface-variant"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-headline font-bold tracking-tight mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.weight}`} className="flex items-center gap-4">
                    <div className="relative w-24 h-24 bg-surface-container rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded-full">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                        <span className="font-bold">{formatPKR(item.unitPrice * item.quantity)}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1 italic">{item.weight}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-container-highest pt-6 space-y-3">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Subtotal</span>
                  <span>{formatPKR(sub)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Harvest Tax (5%)</span>
                  <span>{formatPKR(tax)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 text-on-surface">
                  <span>Total</span>
                  <span className="text-primary">{formatPKR(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-10 py-5 editorial-gradient text-on-primary rounded-full font-bold text-lg tracking-tight shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {submitting ? "Placing order..." : "Confirm & Place Order"}
                {!submitting && <Icon name="arrow_forward" />}
              </button>
              <p className="text-center mt-6 text-xs text-on-surface-variant flex items-center justify-center gap-2">
                <Icon name="verified_user" className="text-sm" />
                Secure transaction powered by OrchardPay
              </p>
              <Link to="/cart" className="block text-center mt-3 text-xs text-outline hover:text-primary">
                Edit basket
              </Link>
            </div>
          </aside>
        </form>
        )}
      </div>
    </SiteShell>
  );
};

export default Checkout;
