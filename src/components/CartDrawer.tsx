import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/store/cart";
import { Icon } from "./Icon";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const sub = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-full sm:w-[440px] bg-surface flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h2 className="font-headline font-extrabold text-2xl tracking-tight">Your Basket</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full"
                aria-label="Close cart"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-outline py-20">
                  <Icon name="shopping_basket" className="text-6xl text-primary-fixed-dim" />
                  <p className="font-medium">Your basket is empty.</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="px-6 py-3 bg-primary text-on-primary rounded-full text-sm font-bold cta-glow transition-all"
                  >
                    Browse Harvest
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.productId}-${item.weight}`}
                    className="flex gap-4 p-3 bg-surface-container-lowest rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.productId, item.weight)}
                          className="text-outline hover:text-error transition-colors"
                          aria-label="Remove"
                        >
                          <Icon name="close" className="text-base" />
                        </button>
                      </div>
                      <p className="text-xs text-outline mt-1">{item.weight}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-surface-container rounded-full">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.weight, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center"
                            aria-label="Decrease"
                          >
                            <Icon name="remove" className="text-sm" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.weight, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center"
                            aria-label="Increase"
                          >
                            <Icon name="add" className="text-sm" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-outline-variant/20 p-6 space-y-4 bg-surface-container-lowest">
                <div className="flex justify-between text-sm text-outline">
                  <span>Subtotal</span>
                  <span className="font-bold text-on-surface">${sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-outline">
                  <span>Shipping</span>
                  <span className="font-bold text-secondary">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-outline-variant/20">
                  <span>Total</span>
                  <span className="text-primary">${sub.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full py-4 editorial-gradient text-on-primary rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform"
                >
                  Checkout
                  <Icon name="arrow_forward" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="block text-center text-sm text-outline hover:text-primary transition-colors"
                >
                  View full basket
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
