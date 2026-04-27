import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "OurStory" },
  { to: "/freshness", label: "Freshness" },
];

export const Navbar = () => {
  const total = useCart((s) => s.totalItems());
  const setOpen = useCart((s) => s.setOpen);
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const adminUrl = import.meta.env.VITE_ADMIN_URL as string | undefined;

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className="glass-nav pointer-events-auto h-16 px-6 md:px-8 flex items-center justify-between gap-6 md:gap-12 rounded-full border border-outline-variant/20 shadow-xl max-w-screen-xl w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-primary w-8 h-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-headline font-extrabold text-xl md:text-2xl tracking-tighter text-on-surface">
            RoyalOrchard
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 px-1 ${
                  isActive
                    ? "text-[#F4A300] border-b-2 border-[#F4A300] pb-1"
                    : "text-on-surface hover:text-[#F4A300]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="md:hidden p-2 hover:bg-surface-container rounded-full transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-surface-container rounded-full transition-colors relative"
            aria-label="Cart"
          >
            <Icon name="shopping_bag" />
            {total > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-primary text-[10px] text-on-primary flex items-center justify-center rounded-full">
                {total}
              </span>
            )}
          </button>
          {user ? (
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                  aria-label="Account"
                >
                  {initials || <Icon name="person" />}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={12} className="w-72 p-0 overflow-hidden border-outline-variant/30">
                <div className="bg-primary/10 p-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">
                    {initials || <Icon name="person" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline font-bold text-on-surface truncate">{user.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  {user.address && (
                    <div className="flex items-start gap-2 text-on-surface-variant">
                      <Icon name="location_on" className="text-base text-primary mt-0.5" />
                      <span className="leading-snug">{user.address}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Icon name="call" className="text-base text-primary" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        if (adminUrl) window.location.assign(adminUrl);
                        else navigate("/");
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-container text-on-surface font-semibold"
                    >
                      <Icon name="dashboard" className="text-base" /> Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUserOpen(false);
                      navigate("/account");
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-container text-on-surface font-semibold transition-colors"
                  >
                    <Icon name="person" className="text-base text-primary" /> My Account
                  </button>
                  <button
                    onClick={() => {
                      setUserOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-container text-on-surface font-semibold transition-colors"
                  >
                    <Icon name="receipt_long" className="text-base text-primary" /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setUserOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:opacity-90"
                  >
                    <Icon name="logout" className="text-base" /> Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block px-5 py-2 bg-primary text-on-primary font-bold rounded-full cta-glow transition-all text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 pointer-events-auto bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant/20 p-4 flex flex-col gap-2 animate-fade-up">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-full text-sm font-bold ${
                  isActive ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
