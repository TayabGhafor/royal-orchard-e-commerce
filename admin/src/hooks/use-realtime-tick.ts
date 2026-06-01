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

type RelativeDateInput = Date | number | string | null | undefined;

function toValidDate(value: RelativeDateInput): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Human-friendly "Xs ago" / "Xm ago" relative timestamp. */
export function formatRelative(date: RelativeDateInput, now: RelativeDateInput = new Date()): string {
  const targetDate = toValidDate(date);
  const nowDate = toValidDate(now);
  if (!targetDate || !nowDate) return "just now";

  const sec = Math.max(0, Math.floor((nowDate.getTime() - targetDate.getTime()) / 1000));
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}
