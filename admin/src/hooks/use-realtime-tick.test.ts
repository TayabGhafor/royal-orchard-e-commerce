import { describe, expect, it } from "vitest";
import { formatRelative } from "./use-realtime-tick";

describe("formatRelative", () => {
  it("formats Date values", () => {
    expect(formatRelative(new Date("2026-06-01T10:00:00.000Z"), new Date("2026-06-01T10:00:30.000Z"))).toBe("30s ago");
  });

  it("formats millisecond timestamps from query metadata", () => {
    expect(formatRelative(1_780_306_400_000, 1_780_306_520_000)).toBe("2m ago");
  });

  it("does not throw for missing or invalid values", () => {
    expect(formatRelative(undefined)).toBe("just now");
    expect(formatRelative("not-a-date")).toBe("just now");
  });
});
