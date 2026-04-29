import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const sub = subtotal();
  const { loading, error, retry } = usePageLoading({ delay: 500 });

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter mb-2">Your Basket</h1>
          <p className="text-on-surface-variant font-medium">
            {items.length === 0 ? "Empty for now — let's fix that." : `${items.length} item${items.length > 1 ? "s" : ""} ready for harvest`}
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
            <div className="lg:col-span-8 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-6 p-6 bg-surface-container-lowest rounded-lg shadow-sm">
                  <Skeleton className="w-28 h-28 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-32 mt-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-6 text-center">
            <Icon name="shopping_basket" className="text-7xl text-primary-fixed-dim" />
            <p className="text-outline">Your basket is empty.</p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold cta-glow transition-all"
            >
              Browse Harvest
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 bg-surface-container-lowest rounded-lg shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-28 h-48 sm:h-28 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-headline font-bold text-xl">{item.name}</h3>
                        <p className="text-sm text-outline mt-1">Weight: {item.weight}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.weight)}
                        className="text-outline hover:text-error transition-colors p-2"
                        aria-label="Remove"
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto pt-4">
                      <div className="flex items-center gap-1 bg-surface-container rounded-full w-fit">
                        <button
                          onClick={() => updateQuantity(item.productId, item.weight, item.quantity - 1)}
                          className="w-9 h-9 rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center"
                          aria-label="Decrease"
                        >
                          <Icon name="remove" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.weight, item.quantity + 1)}
                          className="w-9 h-9 rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center"
                          aria-label="Increase"
                        >
                          <Icon name="add" />
                        </button>
                      </div>
                      <span className="font-headline text-xl font-extrabold text-primary">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-headline font-bold tracking-tight">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-bold text-on-surface">{formatPKR(sub)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="font-bold text-secondary">FREE</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-outline-variant/20 text-2xl font-extrabold">
                    <span>Total</span>
                    <span className="text-primary">{formatPKR(sub)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="w-full py-5 editorial-gradient text-on-primary rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                  Proceed to Checkout
                  <Icon name="arrow_forward" />
                </Link>
                <Link
                  to="/shop"
                  className="block text-center text-sm text-outline hover:text-primary transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
};

export default Cart;
