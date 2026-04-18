import { Icon } from "./Icon";

export const Footer = () => (
  <footer className="bg-surface-container-highest pt-20 pb-10 border-t border-outline-variant/20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="text-primary w-8 h-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-headline font-extrabold text-2xl tracking-tighter">RoyalOrchard</span>
        </div>
        <p className="text-outline text-sm leading-relaxed">
          Cultivating heritage mangoes with sustainable practices for a greener, sweeter future.
        </p>
        <div className="flex gap-4">
          {["public", "chat", "mail"].map((n) => (
            <a
              key={n}
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
            >
              <Icon name={n} className="text-lg" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h5 className="font-bold mb-6">Explore</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/shop">Current Varieties</a></li>
          <li><a className="hover:text-primary transition-colors" href="/our-story">Farm Experience</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Corporate Gifting</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Wholesale</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-6">Support</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/freshness">Shipping Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Refund Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="/freshness">Fruit Care Guide</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">FAQs</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-6">Newsletter</h5>
        <p className="text-sm text-outline mb-4">Get harvest alerts and early-bird discounts.</p>
        <div className="flex gap-2 p-1 bg-white rounded-lg border border-outline-variant/30">
          <input
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 px-3 outline-none"
            placeholder="Your email"
            type="email"
          />
          <button className="bg-primary text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full">
            Join
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-xs text-outline">© 2024 RoyalOrchard Pvt Ltd. All rights reserved.</p>
      <div className="flex gap-8 text-xs font-bold text-outline">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Security</a>
      </div>
    </div>
  </footer>
);
