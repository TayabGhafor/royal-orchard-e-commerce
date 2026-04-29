import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { HERO_SLIDES } from "@/data/hero-carousel-slides";

export type { HeroSlide } from "@/data/hero-carousel-slides";

const AUTO_MS = 5000;

const easeLux: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const active = HERO_SLIDES[index];
  const autoplay = !reduced && !paused;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  const panelEase = reduced
    ? { duration: 0.15, ease: easeLux }
    : { duration: 0.68, ease: easeLux };

  return (
    <div
      className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-outline-variant/15 bg-surface-container-low shadow-2xl shadow-primary/10 ring-1 ring-white/50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop highlights"
    >
      <div className="relative min-h-[min(78vh,560px)] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={panelEase}
            className="absolute inset-0"
          >
            {reduced ? (
              <img
                src={active.image}
                alt={active.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
                sizes="100vw"
              />
            ) : (
              <motion.div
                className="absolute inset-0 will-change-transform"
                initial={false}
                animate={{ scale: [1, 1.055] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="h-full w-full object-cover"
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, min(1280px, 100vw)"
                />
              </motion.div>
            )}

            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/18 md:from-black/72 md:via-black/38"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/28 via-transparent to-amber-950/15" aria-hidden />

            <div className="relative z-10 flex min-h-[inherit] flex-col justify-end p-5 pt-20 sm:p-7 sm:pt-24 md:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-11 xl:p-12">
              <motion.div
                key={`copy-${active.id}`}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.52, ease: easeLux, delay: 0.05 }}
                className="w-full max-w-xl lg:max-w-2xl"
              >
                <h1 className="font-headline text-[1.65rem] font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                  {active.title}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/92 sm:mt-4 sm:text-base md:text-lg">
                  {active.subtitle}
                </p>
                <HeroCta
                  to={active.to}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-black/30 transition-transform hover:scale-[1.02] active:scale-[0.99] sm:mt-7 sm:px-8 sm:py-3.5 sm:text-base md:py-4"
                >
                  {active.cta}
                  <Icon name="arrow_forward" className="text-lg" />
                </HeroCta>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/55 sm:left-3 sm:h-11 sm:w-11 md:left-4 md:h-12 md:w-12"
          aria-label="Previous slide"
        >
          <Icon name="chevron_left" className="text-xl md:text-2xl" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/55 sm:right-3 sm:h-11 sm:w-11 md:right-4 md:h-12 md:w-12"
          aria-label="Next slide"
        >
          <Icon name="chevron_right" className="text-xl md:text-2xl" />
        </button>
      </div>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3 backdrop-blur-md sm:gap-2.5 sm:px-4 md:py-3.5">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              i === index ? "w-8 bg-primary shadow-sm shadow-primary/50 sm:w-9" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
});
