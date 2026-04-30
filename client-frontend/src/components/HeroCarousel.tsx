import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { HERO_SLIDES } from "@/data/hero-carousel-slides";

export type { HeroSlide } from "@/data/hero-carousel-slides";

const AUTO_MS = 4800;

const easeLux: [number, number, number, number] = [0.16, 1, 0.3, 1];

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 48,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -36,
    scale: 1.02,
  }),
};

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
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const active = HERO_SLIDES[index];
  const autoplay = !reduced && !paused;

  const go = useCallback(
    (dir: -1 | 1) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i === index) return;
      const diff = (i - index + count) % count;
      setDirection(diff <= count / 2 ? 1 : -1);
      setIndex(i);
    },
    [count, index],
  );

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  const panelTransition = reduced
    ? { duration: 0.12, ease: easeLux }
    : { duration: 0.62, ease: easeLux };

  const springContent = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 200, damping: 28, mass: 0.65 };

  return (
    <div
      className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-outline-variant/20 bg-surface-container-low shadow-2xl shadow-primary/15 ring-1 ring-white/60"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop highlights"
    >
      <div className="relative min-h-[min(72vh,520px)] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px]">
        <div className="pointer-events-none absolute inset-y-10 left-0 z-[15] w-14 sm:w-20 md:w-28 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-10 right-0 z-[15] w-14 sm:w-20 md:w-28 bg-gradient-to-l from-black/55 via-black/20 to-transparent" />

        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={active.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelTransition}
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
                animate={{ scale: [1, 1.045] }}
                transition={{
                  duration: 16,
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
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 md:from-black/78 md:via-black/35"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-amber-950/25 via-transparent to-primary/20"
              aria-hidden
            />

            {/* Copy: bottom-left — CTA: top-right (opposite corner) */}
            <div className="relative z-10 flex min-h-[inherit] flex-col p-5 pt-16 sm:p-7 sm:pt-20 md:p-10 lg:p-11 xl:p-12">
              <motion.div
                key={`cta-${active.id}`}
                initial={reduced ? false : { opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...springContent, delay: reduced ? 0 : 0.08 }}
                className="self-end z-20 w-full max-w-[min(100%,280px)] sm:max-w-xs md:max-w-sm"
              >
                <HeroCta
                  to={active.to}
                  className="ml-auto flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/12 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/25 backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary hover:text-on-primary hover:shadow-primary/30 sm:px-7 sm:py-3 sm:text-base md:py-3.5"
                >
                  {active.cta}
                  <Icon name="arrow_forward" className="text-lg" />
                </HeroCta>
              </motion.div>

              <div className="mt-auto flex w-full flex-1 flex-col justify-end pb-1 sm:pb-2">
                <motion.div
                  key={`copy-${active.id}`}
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springContent, delay: reduced ? 0 : 0.04 }}
                  className="w-full max-w-xl lg:max-w-2xl"
                >
                  <h1 className="font-headline text-[1.6rem] font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl lg:text-6xl">
                    {active.title}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-amber-50/95 sm:mt-4 sm:text-base md:text-lg md:leading-relaxed">
                    {active.subtitle}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/50 sm:left-3 sm:h-11 sm:w-11 md:left-4 md:h-12 md:w-12"
          aria-label="Previous slide"
        >
          <Icon name="chevron_left" className="text-xl md:text-2xl" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/50 sm:right-3 sm:h-11 sm:w-11 md:right-4 md:h-12 md:w-12"
          aria-label="Next slide"
        >
          <Icon name="chevron_right" className="text-xl md:text-2xl" />
        </button>
      </div>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 border-t border-outline-variant/15 bg-surface-container-lowest/95 px-3 py-3.5 backdrop-blur-md sm:gap-2.5 sm:px-4 md:py-4">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              i === index
                ? "w-8 bg-primary shadow-sm shadow-primary/40 sm:w-9"
                : "w-2 bg-outline-variant/55 hover:bg-outline-variant"
            }`}
          />
        ))}
      </div>
    </div>
  );
});
