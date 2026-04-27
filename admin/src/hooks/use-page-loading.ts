import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Options {
  /** Average loading delay in ms (default 600). */
  delay?: number;
  /** Probability (0-1) of simulating a fetch error (default 0.08 = 8%). */
  errorRate?: number;
  /** Toast message shown on simulated error. */
  errorMessage?: string;
  /** Disable the simulated error toast (loading still occurs). */
  silent?: boolean;
}

/**
 * Simulates a paginated fetch lifecycle for mock-data pages:
 *  - returns { loading: true } on mount
 *  - flips to { loading: false } after `delay` ms
 *  - randomly surfaces an error toast (`errorRate`) and exposes `error`
 *  - exposes `retry()` to re-run the cycle
 */
export function usePageLoading({
  delay = 600,
  errorRate = 0.08,
  errorMessage = "We couldn't reach the orchard servers. Showing cached data.",
  silent = false,
}: Options = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (cancelled) return;
      const fail = Math.random() < errorRate;
      if (fail) {
        setError(errorMessage);
        if (!silent) toast.error(errorMessage);
      }
      setLoading(false);
    }, delay + Math.random() * 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [delay, errorRate, errorMessage, silent, tick]);

  return { loading, error, retry: () => setTick((n) => n + 1) };
}
