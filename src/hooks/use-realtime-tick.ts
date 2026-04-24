import { useEffect, useState } from "react";

/**
 * Returns a monotonically increasing counter and a `lastUpdated` Date that
 * advance on a fixed interval (default 30s). Use to force re-derivation of
 * computed analytics so the "live" feel is paired with a timestamp.
 */
export function useRealtimeTick(intervalMs = 30000) {
  const [tick, setTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTick((n) => n + 1);
      setLastUpdated(new Date());
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { tick, lastUpdated };
}

/** Human-friendly "Xs ago" / "Xm ago" relative timestamp. */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const sec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}
