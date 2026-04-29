import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { revealContainerVariants, revealItemVariants } from "./ScrollReveal";

const FOOTER_SOCIALS = [
  {
    href: "https://www.instagram.com/royalorchardpk",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.facebook.com/royalorchardpk42",
    label: "Facebook",
    Icon: Facebook,
  },
] as const;

function FooterSocialLinks() {
  return (
    <div className="flex gap-4">
      {FOOTER_SOCIALS.map(({ href, label, Icon: SocialIcon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Royal Orchard on ${label}`}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
        >
          <SocialIcon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
        </a>
      ))}
    </div>
  );
}

export const Footer = () => {
  const reduced = useReducedMotion();

  const grid = (
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
        <FooterSocialLinks />
      </div>
      <div>
        <h5 className="font-bold mb-6">Explore</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/shop">Current Varieties</a></li>
          <li><a className="hover:text-primary transition-colors" href="/our-story">Farm Experience</a></li>
          <li><a className="hover:text-primary transition-colors" href="/wholesale">Corporate Gifting</a></li>
          <li><a className="hover:text-primary transition-colors" href="/wholesale">Wholesale</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-6">Support</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/shipping-policy">Shipping Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="/refund-policy">Refund Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="/fruit-care-guide">Fruit Care Guide</a></li>
          <li><a className="hover:text-primary transition-colors" href="/faq">FAQs</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-6">Newsletter</h5>
        <p className="text-sm text-outline mb-4">Get harvest alerts and early-bird discounts.</p>
        <form className="flex flex-col gap-2 w-full">
          <input
            className="w-full bg-surface border border-outline-variant/40 rounded-lg text-sm px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Enter your email"
            type="email"
          />
          <button
            type="submit"
            className="w-full bg-primary text-on-primary px-5 py-3 text-sm font-semibold rounded-lg hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );

  const animatedGrid = (
    <motion.div
      variants={revealContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.06, margin: "0px 0px -10% 0px" }}
      className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20"
    >
      <motion.div variants={revealItemVariants} className="flex flex-col gap-6">
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
        <FooterSocialLinks />
      </motion.div>
      <motion.div variants={revealItemVariants}>
        <h5 className="font-bold mb-6">Explore</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/shop">Current Varieties</a></li>
          <li><a className="hover:text-primary transition-colors" href="/our-story">Farm Experience</a></li>
          <li><a className="hover:text-primary transition-colors" href="/wholesale">Corporate Gifting</a></li>
          <li><a className="hover:text-primary transition-colors" href="/wholesale">Wholesale</a></li>
        </ul>
      </motion.div>
      <motion.div variants={revealItemVariants}>
        <h5 className="font-bold mb-6">Support</h5>
        <ul className="flex flex-col gap-4 text-sm text-outline">
          <li><a className="hover:text-primary transition-colors" href="/shipping-policy">Shipping Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="/refund-policy">Refund Policy</a></li>
          <li><a className="hover:text-primary transition-colors" href="/fruit-care-guide">Fruit Care Guide</a></li>
          <li><a className="hover:text-primary transition-colors" href="/faq">FAQs</a></li>
        </ul>
      </motion.div>
      <motion.div variants={revealItemVariants}>
        <h5 className="font-bold mb-6">Newsletter</h5>
        <p className="text-sm text-outline mb-4">Get harvest alerts and early-bird discounts.</p>
        <form className="flex flex-col gap-2 w-full">
          <input
            className="w-full bg-surface border border-outline-variant/40 rounded-lg text-sm px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Enter your email"
            type="email"
          />
          <button
            type="submit"
            className="w-full bg-primary text-on-primary px-5 py-3 text-sm font-semibold rounded-lg hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Subscribe
          </button>
        </form>
      </motion.div>
    </motion.div>
  );

  const bottom = (
    <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-xs text-outline">© 2024 RoyalOrchard Pvt Ltd. All rights reserved.</p>
      <div className="flex gap-8 text-xs font-bold text-outline">
        <a className="hover:text-primary transition-colors" href="/privacy">Privacy</a>
        <a className="hover:text-primary transition-colors" href="/terms">Terms</a>
        <a className="hover:text-primary transition-colors" href="/security">Security</a>
      </div>
    </div>
  );

  const bottomAnimated = (
    <motion.div
      className="max-w-7xl mx-auto px-6 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-xs text-outline">© 2024 RoyalOrchard Pvt Ltd. All rights reserved.</p>
      <div className="flex gap-8 text-xs font-bold text-outline">
        <a className="hover:text-primary transition-colors" href="/privacy">Privacy</a>
        <a className="hover:text-primary transition-colors" href="/terms">Terms</a>
        <a className="hover:text-primary transition-colors" href="/security">Security</a>
      </div>
    </motion.div>
  );

  return (
    <footer className="bg-surface-container-highest pt-20 pb-10 border-t border-outline-variant/20">
      {reduced ? grid : animatedGrid}
      {reduced ? bottom : bottomAnimated}
    </footer>
  );
};
