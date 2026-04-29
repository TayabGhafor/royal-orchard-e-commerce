import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { Icon } from "@/components/Icon";

const JOURNEY_STEPS = [
  {
    n: "01",
    icon: "sunny" as const,
    title: "Plucked at Dawn",
    text: "We harvest at 5:00 AM when the fruit is cool and brix levels are peak.",
  },
  {
    n: "02",
    icon: "content_paste_search" as const,
    title: "Sorted with Care",
    text: "Each mango is manually inspected for bruising, skin integrity, and ripeness.",
  },
  {
    n: "03",
    icon: "ac_unit" as const,
    title: "Chilled Immediately",
    text: "Flash-cooling stops the ripening clock, preserving the lush texture.",
  },
  {
    n: "04",
    icon: "local_shipping" as const,
    title: "Same-Day Dispatch",
    text: "Our fleet departs by 4:00 PM for overnight transit to your doorstep.",
  },
];

const springSoft = { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.85 };
const springSnappy = { type: "spring" as const, stiffness: 280, damping: 28 };

export function FreshnessJourneyRoadmap() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "active" | "complete">("idle");
  const [stepIndex, setStepIndex] = useState(0);

  const start = useCallback(() => {
    setPhase("active");
    setStepIndex(0);
  }, []);

  const next = useCallback(() => {
    if (stepIndex < JOURNEY_STEPS.length - 1) setStepIndex((i) => i + 1);
    else setPhase("complete");
  }, [stepIndex]);

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const restart = useCallback(() => {
    setPhase("idle");
    setStepIndex(0);
  }, []);

  const goToStep = useCallback((i: number) => {
    if (phase !== "active") return;
    setStepIndex(i);
  }, [phase]);

  if (reduced) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-8 md:p-10">
          <p className="text-on-surface-variant mb-6 max-w-prose">
            Walk through how we move fruit from branch to box—tap each step below.
          </p>
          <ol className="space-y-4">
            {JOURNEY_STEPS.map((s, i) => (
              <li
                key={s.n}
                className="flex gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5"
              >
                <span className="font-headline text-2xl font-black text-primary/90 shrink-0">{s.n}</span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={s.icon} className="text-2xl text-primary" />
                    <h3 className="font-headline text-lg font-bold">{s.title}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={springSoft}
            className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-fixed/25 via-surface-container-lowest to-secondary-fixed/20 p-10 md:p-14 shadow-xl shadow-primary/5"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-secondary-fixed/25 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-xl text-center">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...springSnappy, delay: 0.08 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/25"
              >
                <Icon name="route" className="text-4xl text-primary" />
              </motion.div>
              <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-3">
                Start the freshness journey
              </h3>
              <p className="text-on-surface-variant mb-10 leading-relaxed">
                Follow four sunrise-to-doorstep milestones—one tap at a time—and see how we keep every minute
                accounted for.
              </p>
              <motion.button
                type="button"
                onClick={start}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 50px -12px rgb(0 0 0 / 0.22)" }}
                whileTap={{ scale: 0.98 }}
                transition={springSnappy}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 font-bold text-on-primary shadow-lg"
              >
                Begin the journey
                <Icon name="arrow_forward" className="text-xl" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springSoft}
            className="space-y-10 md:space-y-14"
          >
            <RoadmapTimeline stepIndex={stepIndex} onSelectStep={goToStep} />

            <div className="relative mx-auto max-w-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={stepIndex}
                  initial={{ opacity: 0, x: 36, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -28, filter: "blur(4px)" }}
                  transition={springSoft}
                  className="relative rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 md:p-10 shadow-2xl shadow-primary/10 ring-1 ring-primary/10"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-4 text-right font-headline font-black tabular-nums leading-none tracking-tight text-primary/[0.09] select-none whitespace-nowrap text-7xl sm:right-6 sm:top-6 sm:text-8xl md:right-8 md:top-8 md:text-9xl"
                  >
                    {JOURNEY_STEPS[stepIndex].n}
                  </div>
                  <div className="relative z-10">
                    <motion.div
                      key={`icon-${stepIndex}`}
                      initial={{ scale: 0.85, rotate: -6 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={springSnappy}
                      className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary"
                    >
                      <Icon name={JOURNEY_STEPS[stepIndex].icon} className="text-4xl" />
                    </motion.div>
                    <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">
                      {JOURNEY_STEPS[stepIndex].title}
                    </h3>
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                      {JOURNEY_STEPS[stepIndex].text}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <motion.button
                  type="button"
                  onClick={prev}
                  disabled={stepIndex === 0}
                  whileHover={stepIndex === 0 ? undefined : { x: -3 }}
                  whileTap={stepIndex === 0 ? undefined : { scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant/40 px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-35"
                >
                  <Icon name="arrow_back" className="text-lg" />
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={next}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springSnappy}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/25"
                >
                  {stepIndex < JOURNEY_STEPS.length - 1 ? (
                    <>
                      Next step
                      <Icon name="arrow_forward" className="text-lg" />
                    </>
                  ) : (
                    <>
                      Complete journey
                      <Icon name="emoji_events" className="text-lg" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={springSoft}
            className="relative overflow-hidden rounded-3xl border border-secondary-fixed/30 bg-gradient-to-b from-secondary-container/40 via-surface-container-lowest to-primary-fixed/15 p-10 md:p-14 text-center shadow-2xl"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-primary"
                  style={{
                    left: `${8 + (i * 7.5) % 84}%`,
                    top: `${12 + ((i * 13) % 70)}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0.8],
                    y: [0, -12 - (i % 4) * 4],
                  }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </motion.div>

            <div className="relative z-10 mx-auto max-w-lg">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...springSnappy, delay: 0.12 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl ring-4 ring-primary/25"
              >
                <Icon name="verified" filled className="text-5xl" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...springSoft }}
                className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-3"
              >
                Journey complete
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, ...springSoft }}
                className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10"
              >
                You&apos;ve walked every mile with us—from first light in the orchard to the moment our fleet
                heads your way. That&apos;s the RoyalOrchard freshness promise.
              </motion.p>
              <motion.button
                type="button"
                onClick={restart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-surface-container-lowest px-8 py-3.5 font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors"
              >
                <Icon name="replay" className="text-xl" />
                Experience again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoadmapTimeline({
  stepIndex,
  onSelectStep,
}: {
  stepIndex: number;
  onSelectStep: (i: number) => void;
}) {
  return (
    <>
      {/* Mobile: vertical */}
      <div className="relative mx-auto max-w-md md:hidden">
        <div className="absolute left-[22px] top-4 bottom-4 w-0.5 overflow-hidden rounded-full bg-outline-variant/25">
          <motion.div
            className="absolute left-0 top-0 w-full origin-top rounded-full bg-gradient-to-b from-primary via-primary to-secondary-fixed"
            initial={false}
            animate={{ scaleY: (stepIndex + 1) / JOURNEY_STEPS.length }}
            transition={springSoft}
            style={{ height: "100%" }}
          />
        </div>
        <div className="space-y-6 pl-2">
          {JOURNEY_STEPS.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            const upcoming = i > stepIndex;
            return (
              <motion.button
                key={s.n}
                type="button"
                onClick={() => onSelectStep(i)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springSoft, delay: i * 0.06 }}
                className="flex w-full items-start gap-4 rounded-2xl border border-transparent p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              >
                <motion.span
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
                    done
                      ? "border-primary bg-primary text-on-primary"
                      : current
                        ? "border-primary bg-primary/15 text-primary ring-4 ring-primary/20"
                        : "border-outline-variant/40 bg-surface-container-lowest text-outline"
                  }`}
                  animate={current ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ repeat: current ? Infinity : 0, duration: 2.2, ease: "easeInOut" }}
                >
                  {done ? <Icon name="check" className="text-lg font-bold" /> : s.n}
                </motion.span>
                <div className="min-w-0 pt-1.5">
                  <p
                    className={`font-headline text-sm font-bold leading-tight ${
                      upcoming ? "text-outline" : "text-on-surface"
                    }`}
                  >
                    {s.title}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative px-4">
          <div className="absolute left-12 right-12 top-[22px] h-1 overflow-hidden rounded-full bg-outline-variant/25">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary-fixed shadow-sm shadow-primary/30"
              initial={false}
              animate={{
                width: `${(stepIndex / Math.max(1, JOURNEY_STEPS.length - 1)) * 100}%`,
              }}
              transition={springSoft}
            />
          </div>
          <div className="relative flex justify-between gap-2">
            {JOURNEY_STEPS.map((s, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              const upcoming = i > stepIndex;
              return (
                <motion.button
                  key={s.n}
                  type="button"
                  onClick={() => onSelectStep(i)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springSoft, delay: i * 0.07 }}
                  className="flex w-[22%] flex-col items-center gap-3 rounded-2xl border border-transparent p-2 pt-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <motion.span
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-black shadow-md ${
                      done
                        ? "border-primary bg-primary text-on-primary"
                        : current
                          ? "border-primary bg-primary/15 text-primary ring-4 ring-primary/25 shadow-primary/20"
                          : "border-outline-variant/45 bg-surface-container-lowest text-outline"
                    }`}
                    animate={current ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ repeat: current ? Infinity : 0, duration: 2.2, ease: "easeInOut" }}
                  >
                    {done ? <Icon name="check" className="text-xl" /> : s.n}
                  </motion.span>
                  <span
                    className={`text-center font-headline text-xs font-bold leading-snug ${
                      upcoming ? "text-outline" : "text-on-surface"
                    }`}
                  >
                    {s.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
