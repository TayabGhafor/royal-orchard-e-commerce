import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

export const customerLoveReviews = [
  {
    id: "amara",
    text: "The sweetness is unparalleled. I've ordered Chaunsa from many places, but RoyalOrchard's quality and packaging are on another level.",
    name: "Amara Khan",
    role: "Verified Buyer",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-C-VZKdl6LP0HjV9JDr4KNDi28VbBBSlvccDmgmy5oWrz3syELqahPppnQjTHJ5mX3QPJHFCeb_xNU8nGzIh471qrJTomYA2O3kVjr2vdHlUJdIPH2uU8nc3-3e7TH2HGPmcJzew7x03TWEgVLSfA_2-D3HOsDLfFZuvqmFPmpwvFNW43nJK8xVCY3Sf724YJZHSv4XTpPQVHBcsIeWG5QTRyFha3vCcz6rvgVv8TJ7srb8Gh93l2BNPTS9WYn998BO7K7bZKvGBp",
  },
  {
    id: "zain",
    text: "Incredible service! Received my order within 20 hours of harvesting. The aroma when I opened the box filled the entire house.",
    name: "Zain Malik",
    role: "Restaurateur",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJFh6j6ih6svA1KCEuupj0yI9MFC4rZX7PxENslCAupioJjHI549IEPbsE19qi41B3q352DYBLspP5KXlcEIWHGgL20JaDkBDGzXFHD62LMoJ9wkJRaJc728qzxOT5heovYEqDZDeTBtIhl5xAcQGYajWiNQIh0PwKD_gbv7ddiFGdkOMokVMofAgUmSDjgvrohendWMaO_-dHqSQQjabsUsInBuuXNEaad7XnIplch7NLQDMY-X_ck4qsrXIoM19w5VYCM2N1__70",
  },
  {
    id: "sara",
    text: "Freshness you can taste. This is the first time I've felt like I'm eating a mango straight from the tree here in the city.",
    name: "Sara Ahmed",
    role: "Food Blogger",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJMNGg7BDxekCa9jRVb5WDzoBDIDDYJaejuOdyiCz9V_oO1Q9JC7w09jN3QOttaQJEjewq1riHDT54P-JuWUa3RnkzisTb47yHVB5uyItkGnvWOlscPSzXVMGzYwbkcmTIa2Hkfb6sf-fKFKhD3oHm-kDCsbB0i2AkdN3mn-eeh-SWUM82ByKNtzneWWx2HjftiEUmQcql6I8TKuMp8eGtnbMAMdxyPGP-ZoeEb1oo7Qavex2XkNNu6z1Nv5HDe2UMlnG9A5oKOLlM",
  },
  {
    id: "hassan",
    text: "Ordered the Langra crate for Eid gifts — every box arrived picture-perfect. Zero bruising, and the stem smell alone sold three colleagues on placing their own orders.",
    name: "Hassan Raza",
    role: "Corporate Buyer",
    img: "https://i.pravatar.cc/128?img=33",
  },
  {
    id: "nadia",
    text: "My kids usually skip fruit; they finished a whole tray of Anwar Ratol in two days. Customer care even followed up on ripening tips — rare these days.",
    name: "Nadia Sheikh",
    role: "Verified Buyer",
    img: "https://i.pravatar.cc/128?img=45",
  },
  {
    id: "omar",
    text: "We serve desserts at our café — RoyalOrchard pulp has the depth of flavor our pastry chef was hunting for. Wholesale onboarding was painless.",
    name: "Omar Siddiqui",
    role: "Café Owner",
    img: "https://i.pravatar.cc/128?img=52",
  },
  {
    id: "fatima",
    text: "Tracked my shipment every step; mangoes were cooler-fresh in Karachi heat. The honey notes in the Sindhri batch were unforgettable.",
    name: "Fatima Noor",
    role: "Verified Buyer",
    img: "https://i.pravatar.cc/128?img=16",
  },
];

const REVIEW_INTERVAL_MS = 4800;
const REVIEW_GAP_PX = 24;

export function CustomerLoveCarousel() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const [slideW, setSlideW] = useState(300);
  const reviews = customerLoveReviews;
  const n = reviews.length;
  const loopTrack = [...reviews, ...reviews, ...reviews];
  const [idx, setIdx] = useState(n);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);

  const step = slideW + REVIEW_GAP_PX;
  const translateX = cw > 0 ? cw / 2 - idx * step - slideW / 2 : 0;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      setCw(w);
      const nextSlide = Math.min(380, Math.max(260, Math.round(w * 0.28)));
      setSlideW(nextSlide);
    });
    ro.observe(el);
    setCw(el.offsetWidth);
    setSlideW(Math.min(380, Math.max(260, Math.round(el.offsetWidth * 0.28))));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const t = window.setInterval(() => {
      setIdx((i) => i + 1);
    }, REVIEW_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [reduced, paused, n]);

  useEffect(() => {
    if (idx < 2 * n) return;
    setInstant(true);
    setIdx(n);
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [idx, n]);

  const goTo = useCallback((target: number) => {
    setInstant(false);
    setIdx(target);
  }, []);

  const dotActive = ((idx % n) + n) % n;

  if (reduced) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-outline-variant/10 relative lift-on-hover"
          >
            <Icon name="format_quote" className="text-primary-fixed-dim text-6xl absolute -top-4 -left-2 opacity-30" />
            <div className="flex items-center gap-1 text-tertiary mb-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" filled />
              ))}
            </div>
            <p className="text-on-surface leading-relaxed mb-8 italic">"{r.text}"</p>
            <div className="flex items-center gap-4">
              <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" src={r.img} alt={r.name} />
              <div>
                <h5 className="font-bold text-sm">{r.name}</h5>
                <p className="text-[10px] text-outline uppercase tracking-wider">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden py-6 md:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ touchAction: "pan-y" }}
    >
      <motion.div
        className="flex flex-row items-center will-change-transform"
        style={{ gap: REVIEW_GAP_PX }}
        animate={{ x: translateX }}
        transition={
          instant ? { duration: 0 } : { type: "spring", stiffness: 168, damping: 28, mass: 0.68 }
        }
      >
        {loopTrack.map((r, i) => {
          const isCenter = i === idx;
          return (
            <motion.div
              key={`${r.id}-${i}`}
              className="shrink-0 flex items-center justify-center"
              style={{ width: slideW }}
              animate={{
                scale: isCenter ? 1.075 : 0.87,
                opacity: isCenter ? 1 : 0.58,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 32,
              }}
            >
              <motion.article
                className={`relative w-full rounded-2xl border bg-white p-6 md:p-8 shadow-lg transition-shadow duration-300 ${
                  isCenter
                    ? "border-primary/30 shadow-2xl shadow-primary/15 ring-1 ring-primary/20"
                    : "border-outline-variant/15 shadow-sm"
                }`}
                whileHover={{
                  y: isCenter ? -5 : -3,
                  boxShadow: isCenter
                    ? "0 28px 60px -12px rgb(0 0 0 / 0.18)"
                    : "0 18px 40px -12px rgb(0 0 0 / 0.12)",
                }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
              >
                <Icon
                  name="format_quote"
                  className="text-primary-fixed-dim text-5xl md:text-6xl absolute -top-3 -left-1 md:-top-4 md:-left-2 opacity-25"
                />
                <div className="flex items-center gap-0.5 text-tertiary mb-3 md:mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Icon key={s} name="star" filled className="text-sm md:text-base" />
                  ))}
                </div>
                <p
                  className={`text-on-surface leading-relaxed mb-6 md:mb-8 italic ${
                    isCenter ? "text-base md:text-lg" : "text-sm md:text-base line-clamp-5"
                  }`}
                >
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    className={`rounded-full object-cover ring-2 ring-white shadow-md ${
                      isCenter ? "w-12 h-12 md:w-14 md:h-14" : "w-10 h-10 md:w-11 md:h-11"
                    }`}
                    src={r.img}
                    alt={r.name}
                  />
                  <div>
                    <h5 className={`font-bold ${isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>
                      {r.name}
                    </h5>
                    <p className="text-[10px] text-outline uppercase tracking-wider">{r.role}</p>
                  </div>
                </div>
              </motion.article>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 flex justify-center gap-2">
        {reviews.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={`Show review from ${r.name}`}
            aria-current={dotActive === i}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              dotActive === i ? "w-8 bg-primary" : "w-2 bg-outline-variant/60 hover:bg-outline-variant"
            }`}
            onClick={() => goTo(i + n)}
          />
        ))}
      </div>
    </div>
  );
}
