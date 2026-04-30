import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { HERO_SLIDES } from "@/data/hero-carousel-slides";

export type { HeroSlide } from "@/data/hero-carousel-slides";

const AUTO_MS = 4800;

function shortestDelta(i: number, activeIndex: number, count: number) {
  // returns values like -2,-1,0,1,2 ... choosing the shortest wrap direction
  let d = (i - activeIndex) % count;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

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

  const autoplay = !reduced && !paused;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i === index) return;
      setIndex(i);
    },
    [count, index],
  );

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  const springContent = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 200, damping: 28, mass: 0.65 };

  const cardSpring = reduced
    ? { duration: 0.12 }
    : { type: "spring" as const, stiffness: 130, damping: 26, mass: 1.05 };

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
        {/* Cards track (smooth premium motion) */}
        <div className="relative mx-auto flex min-h-[inherit] max-w-[980px] items-center justify-center px-3 sm:px-6">
          <div className="relative h-[330px] w-full sm:h-[360px] md:h-[390px] lg:h-[410px]">
            {HERO_SLIDES.map((slide, i) => {
              const d = shortestDelta(i, index, count);
              if (Math.abs(d) > 1) return null;

              const isActive = d === 0;
              const isSide = d !== 0;

              return (
                <motion.button
                  key={slide.id}
                  type="button"
                  onClick={() => (d === -1 ? go(-1) : d === 1 ? go(1) : undefined)}
                  disabled={isActive}
                  className="absolute left-1/2 top-0 block h-full w-[min(92%,360px)] sm:w-[420px] md:w-[460px] lg:w-[500px] -translate-x-1/2 rounded-2xl focus:outline-none"
                  style={{
                    zIndex: isActive ? 30 : 20,
                    pointerEvents: isActive ? "auto" : "auto",
                  }}
                  initial={false}
                  animate={{
                    x: d * 230,
                    scale: isActive ? 1 : 0.88,
                    opacity: isActive ? 1 : 0.52,
                    filter: isActive ? "blur(0px)" : "blur(2.2px)",
                  }}
                  transition={cardSpring}
                  aria-current={isActive}
                  aria-label={isActive ? `Current slide: ${slide.title}` : `Go to slide: ${slide.title}`}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.40)] ring-1 ${
                      isActive ? "ring-black/10" : "ring-black/5"
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="h-full w-full object-cover"
                      decoding="async"
                      fetchPriority={isActive && index === 0 ? "high" : "auto"}
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 460px, 500px"
                    />

                    {/* Overlay tint */}
                    <div
                      className={isActive ? "absolute inset-0 bg-black/15" : "absolute inset-0 bg-black/10"}
                      aria-hidden
                    />

                    {/* Title */}
                    <div className="absolute inset-0 grid place-items-center px-7" aria-hidden={isSide}>
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0.85,
                          y: isActive ? 0 : 0,
                        }}
                        transition={springContent}
                        className="text-center font-headline font-light tracking-wide text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.28)] leading-[0.95] text-[42px] sm:text-[52px] md:text-[58px] lg:text-[64px]"
                      >
                        {slide.title}
                      </motion.div>
                    </div>

                    {/* Soft edge fade so side cards feel tucked behind */}
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/12 to-transparent"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/12 to-transparent"
                      aria-hidden
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* CTA pill (only current slide) */}
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
