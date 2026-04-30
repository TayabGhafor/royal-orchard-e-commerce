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

  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;
  const prev = HERO_SLIDES[prevIndex];
  const next = HERO_SLIDES[nextIndex];

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
      <div className="relative min-h-[min(58vh,460px)] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] bg-surface">
        {/* Soft wash like the reference */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_20%,rgba(255,255,255,0.95),rgba(255,255,255,0.60)_55%,rgba(255,255,255,0.0))]" />

        {/* Cards track */}
        <div className="relative mx-auto flex min-h-[inherit] max-w-[980px] items-center justify-center px-3 sm:px-6">
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={active.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="relative w-full"
            >
              {/* Side cards (desktop/tablet) */}
              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
                <div className="relative w-full">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <div className="relative h-[300px] w-[240px] md:h-[340px] md:w-[270px] lg:h-[360px] lg:w-[285px]">
                      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
                        <img
                          src={prev.image}
                          alt={prev.imageAlt}
                          className="h-full w-full object-cover opacity-70 blur-[1.5px]"
                          decoding="async"
                          sizes="(min-width: 640px) 240px"
                        />
                        <div className="absolute inset-0 bg-black/10" aria-hidden />
                      </div>
                      <div className="absolute inset-0 grid place-items-center px-6" aria-hidden>
                        <div className="text-center font-headline text-5xl font-light tracking-wide text-white/90 drop-shadow-[0_10px_26px_rgba(0,0,0,0.30)]">
                          {prev.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div className="relative h-[300px] w-[240px] md:h-[340px] md:w-[270px] lg:h-[360px] lg:w-[285px]">
                      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
                        <img
                          src={next.image}
                          alt={next.imageAlt}
                          className="h-full w-full object-cover opacity-70 blur-[1.5px]"
                          decoding="async"
                          sizes="(min-width: 640px) 240px"
                        />
                        <div className="absolute inset-0 bg-black/10" aria-hidden />
                      </div>
                      <div className="absolute inset-0 grid place-items-center px-6" aria-hidden>
                        <div className="text-center font-headline text-5xl font-light tracking-wide text-white/90 drop-shadow-[0_10px_26px_rgba(0,0,0,0.30)]">
                          {next.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center card */}
              <div className="relative mx-auto w-[min(92%,360px)] sm:w-[min(56%,420px)] md:w-[min(56%,460px)] lg:w-[min(56%,500px)]">
                <div className="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_28px_70px_-22px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
                  {reduced ? (
                    <img
                      src={active.image}
                      alt={active.imageAlt}
                      className="h-[330px] w-full object-cover sm:h-[360px] md:h-[390px] lg:h-[410px]"
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 460px, 500px"
                    />
                  ) : (
                    <motion.div
                      className="will-change-transform"
                      initial={false}
                      animate={{ scale: [1.01, 1.06] }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src={active.image}
                        alt={active.imageAlt}
                        className="h-[330px] w-full object-cover sm:h-[360px] md:h-[390px] lg:h-[410px]"
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        sizes="(max-width: 640px) 360px, (max-width: 1024px) 460px, 500px"
                      />
                    </motion.div>
                  )}

                  {/* Gentle haze + title like reference */}
                  <div className="absolute inset-0 bg-black/10" aria-hidden />
                  <div className="absolute inset-0 grid place-items-center px-8">
                    <motion.div
                      key={`title-${active.id}`}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springContent, delay: reduced ? 0 : 0.04 }}
                      className="text-center font-headline text-6xl font-light tracking-wide text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.30)] sm:text-7xl md:text-7xl lg:text-8xl"
                    >
                      {active.title}
                    </motion.div>
                  </div>
                </div>

                {/* CTA pill sits bottom-center (keeps your existing CTA) */}
                <motion.div
                  key={`cta-${active.id}`}
                  initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...springContent, delay: reduced ? 0 : 0.08 }}
                  className="mt-5 flex justify-center"
                >
                  <HeroCta
                    to={active.to}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-bold text-on-surface shadow-lg shadow-black/10 backdrop-blur-md transition-all hover:bg-white hover:shadow-xl"
                  >
                    {active.cta}
                    <Icon name="arrow_forward" className="text-lg" />
                  </HeroCta>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reference-like arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/55 text-on-surface shadow-md ring-1 ring-black/10 backdrop-blur-md transition-colors hover:bg-white sm:left-5 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          <Icon name="chevron_left" className="text-2xl" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/55 text-on-surface shadow-md ring-1 ring-black/10 backdrop-blur-md transition-colors hover:bg-white sm:right-5 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          <Icon name="chevron_right" className="text-2xl" />
        </button>
      </div>

      {/* Dots removed to match the reference UI */}
    </div>
  );
});
