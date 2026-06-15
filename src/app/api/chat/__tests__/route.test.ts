import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, rateLimit, estimateCost } from "../route";

describe("checkRateLimit", () => {
  beforeEach(() => {
    rateLimit.clear();
  });

  it("allows first request", () => {
    expect(checkRateLimit("1.2.3.4")).toBe(true);
  });

  it("allows up to 30 requests", () => {
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit("1.2.3.4")).toBe(true);
    }
  });

  it("blocks the 31st request", () => {
    for (let i = 0; i < 30; i++) {
      checkRateLimit("1.2.3.4");
    }
    expect(checkRateLimit("1.2.3.4")).toBe(false);
  });

  it("resets after the time window", () => {
    for (let i = 0; i < 30; i++) {
      checkRateLimit("1.2.3.4");
    }
    // Manually expire the window
    const entry = rateLimit.get("1.2.3.4")!;
    entry.resetAt = Date.now() - 1;
    expect(checkRateLimit("1.2.3.4")).toBe(true);
  });

  it("tracks IPs independently", () => {
    for (let i = 0; i < 30; i++) {
      checkRateLimit("1.1.1.1");
    }
    expect(checkRateLimit("1.1.1.1")).toBe(false);
    expect(checkRateLimit("2.2.2.2")).toBe(true);
  });
});

describe("estimateCost", () => {
  it("returns 0 for 0 tokens", () => {
    expect(estimateCost(0, 0)).toBe(0);
  });

  it("calculates input cost correctly", () => {
    // 1M input tokens at $3/M = $3
    expect(estimateCost(1_000_000, 0)).toBeCloseTo(3.0);
  });

  it("calculates output cost correctly", () => {
    // 1M output tokens at $15/M = $15
    expect(estimateCost(0, 1_000_000)).toBeCloseTo(15.0);
  });

  it("combines input and output costs", () => {
    // 500 input ($0.0015) + 100 output ($0.0015)
    expect(estimateCost(500, 100)).toBeCloseTo(0.003);
  });
});
