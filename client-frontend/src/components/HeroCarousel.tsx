import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { HERO_SLIDES } from "@/data/hero-carousel-slides";

export type { HeroSlide } from "@/data/hero-carousel-slides";

const AUTO_MS = 4800;

function HeroCta({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export const HeroCarousel = memo(function HeroCarousel() {
  const reduced = useReducedMotion();
  const count = HERO_SLIDES.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const autoplay = !reduced && !paused;

  const [cw, setCw] = useState(0);
  const [slideW, setSlideW] = useState(420);
  const gap = 26;
  const loopTrack = [...HERO_SLIDES, ...HERO_SLIDES, ...HERO_SLIDES];
  const n = HERO_SLIDES.length;
  const [idx, setIdx] = useState(n);
  const [instant, setInstant] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => {
      setInstant(false);
      setIdx((i) => i + dir);
    },
    [],
  );

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      setCw(w);
      // closer to the reference sizing
      const next = Math.min(520, Math.max(320, Math.round(w * 0.52)));
      setSlideW(next);
    });
    ro.observe(el);
    setCw(el.offsetWidth);
    setSlideW(Math.min(520, Math.max(320, Math.round(el.offsetWidth * 0.52))));
    return () => ro.disconnect();
  }, []);

  // keep index in sync with looped track
  useEffect(() => {
    setIndex(((idx % n) + n) % n);
  }, [idx, n]);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setInstant(false);
      setIdx((i) => i + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoplay]);

  const springContent = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 200, damping: 28, mass: 0.65 };

  const trackSpring = reduced
    ? { duration: 0.12 }
    : { type: "spring" as const, stiffness: 165, damping: 26, mass: 0.9 };

  // infinite-ish loop reset (same trick as CustomerLoveCarousel)
  useEffect(() => {
    if (idx < 2 * n) return;
    setInstant(true);
    setIdx(n);
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [idx, n]);

  useEffect(() => {
    if (idx > 0) return;
    setInstant(true);
    setIdx(n);
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [idx, n]);

  const step = slideW + gap;
  const translateX = cw > 0 ? cw / 2 - idx * step - slideW / 2 : 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-transparent"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop highlights"
    >
      <div className="relative min-h-[min(58vh,460px)] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] bg-transparent">
        {/* Simple smooth track */}
        <div ref={wrapRef} className="relative mx-auto flex min-h-[inherit] max-w-[980px] items-center justify-center px-3 sm:px-6">
          <div className="relative w-full" style={{ height: "min(410px, 58vh)" }}>
            <motion.div
              className="flex flex-row items-center will-change-transform"
              style={{ gap }}
              animate={{ x: translateX }}
              transition={instant ? { duration: 0 } : trackSpring}
            >
              {loopTrack.map((slide, i) => {
                const isCenter = i === idx;
                return (
                  <motion.button
                    key={`${slide.id}-${i}`}
                    type="button"
                    onClick={() => setIdx(i)}
                    className="shrink-0 focus:outline-none"
                    style={{ width: slideW }}
                    animate={{
                      scale: isCenter ? 1 : 0.86,
                      opacity: isCenter ? 1 : 0.45,
                      filter: isCenter ? "blur(0px)" : "blur(2.4px)",
                    }}
                    transition={instant ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 30, mass: 0.9 }}
                    aria-current={isCenter}
                    aria-label={isCenter ? `Current slide: ${slide.title}` : `Go to slide: ${slide.title}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.40)] ring-1 ring-black/10">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="h-[330px] w-full object-cover sm:h-[360px] md:h-[390px] lg:h-[410px]"
                        decoding="async"
                        fetchPriority={isCenter && index === 0 ? "high" : "auto"}
                        sizes="(max-width: 640px) 360px, (max-width: 1024px) 460px, 500px"
                      />
                      <div className="absolute inset-0 bg-black/15" aria-hidden />
                      <div className="absolute inset-0 grid place-items-center px-7">
                        <div className="text-center font-headline font-light tracking-wide text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.28)] leading-[0.98] text-[38px] sm:text-[48px] md:text-[54px] lg:text-[60px]">
                          {slide.title}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* CTA pill */}
          <motion.div
            key={`cta-${HERO_SLIDES[index]?.id ?? index}`}
            initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springContent, delay: reduced ? 0 : 0.05 }}
            className="absolute bottom-[-58px] left-1/2 -translate-x-1/2"
          >
            <HeroCta
              to={HERO_SLIDES[index].to}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-bold text-on-surface shadow-[0_18px_34px_-18px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:bg-white"
            >
              {HERO_SLIDES[index].cta}
              <Icon name="arrow_forward" className="text-lg" />
            </HeroCta>
          </motion.div>
        </div>

        {/* Reference-like arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/60 text-on-surface shadow-md ring-1 ring-black/10 backdrop-blur-md transition-colors hover:bg-white sm:left-5 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          <Icon name="chevron_left" className="text-2xl" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/60 text-on-surface shadow-md ring-1 ring-black/10 backdrop-blur-md transition-colors hover:bg-white sm:right-5 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          <Icon name="chevron_right" className="text-2xl" />
        </button>
      </div>

      {/* Dots removed to match the reference UI */}
    </div>
  );
});
