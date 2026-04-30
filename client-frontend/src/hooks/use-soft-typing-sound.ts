import { useEffect, useRef } from "react";

/**
 * Very quiet, soft “glass ping” while the typing indicator is active.
 * Respects reduced motion (no sound). Requires a prior user gesture for AudioContext in some browsers (send counts).
 */
export function useSoftTypingSound(active: boolean, reducedMotion: boolean | null) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active || reducedMotion) return;

    let intervalId: number;
    let cancelled = false;

    const ensureCtx = () => {
      if (ctxRef.current) return ctxRef.current;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return null;
        const ctx = new Ctx();
        ctxRef.current = ctx;
        return ctx;
      } catch {
        return null;
      }
    };

    const playSoftBlip = () => {
      const ctx = ensureCtx();
      if (!ctx || cancelled) return;
      if (ctx.state === "suspended") void ctx.resume().catch(() => {});

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.045);

      filter.type = "lowpass";
      filter.frequency.value = 2800;
      filter.Q.value = 0.7;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.022, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    };

    playSoftBlip();
    intervalId = window.setInterval(playSoftBlip, 420);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);
}
