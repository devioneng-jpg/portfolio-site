import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { chatRequestBodySchema, estimateCost, POST } from "../route";
import {
  checkRateLimit,
  resetMemoryRateLimitsForTests,
} from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetMemoryRateLimitsForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const checkChatLimit = (identifier: string) =>
    checkRateLimit({
      scope: "chat",
      identifier,
      limit: 30,
      windowSeconds: 3600,
    });

  it("allows first request", async () => {
    expect((await checkChatLimit("1.2.3.4")).success).toBe(true);
  });

  it("allows up to 30 requests", async () => {
    for (let i = 0; i < 30; i++) {
      expect((await checkChatLimit("1.2.3.4")).success).toBe(true);
    }
  });

  it("blocks the 31st request", async () => {
    for (let i = 0; i < 30; i++) {
      await checkChatLimit("1.2.3.4");
    }
    expect((await checkChatLimit("1.2.3.4")).success).toBe(false);
  });

  it("resets after the time window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T12:00:00Z"));
    for (let i = 0; i < 30; i++) {
      await checkChatLimit("1.2.3.4");
    }
    vi.advanceTimersByTime(3_600_001);
    expect((await checkChatLimit("1.2.3.4")).success).toBe(true);
  });

  it("tracks IPs independently", async () => {
    for (let i = 0; i < 30; i++) {
      await checkChatLimit("1.1.1.1");
    }
    expect((await checkChatLimit("1.1.1.1")).success).toBe(false);
    expect((await checkChatLimit("2.2.2.2")).success).toBe(true);
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

describe("chatRequestBodySchema", () => {
  const message = {
    id: "user-1",
    role: "user",
    parts: [{ type: "text", text: "Tell me about Devion" }],
  };

  it("accepts the default AI SDK v6 submit payload", () => {
    expect(
      chatRequestBodySchema.safeParse({
        id: "chat-1",
        messages: [message],
        trigger: "submit-message",
      }).success
    ).toBe(true);
  });

  it("accepts the AI SDK v6 regeneration payload", () => {
    expect(
      chatRequestBodySchema.safeParse({
        id: "chat-1",
        messages: [message],
        trigger: "regenerate-message",
        messageId: "user-1",
      }).success
    ).toBe(true);
  });

  it("still rejects unknown request fields", () => {
    expect(
      chatRequestBodySchema.safeParse({
        id: "chat-1",
        messages: [message],
        trigger: "submit-message",
        unexpected: true,
      }).success
    ).toBe(false);
  });
});

describe("POST /api/chat", () => {
  beforeEach(() => {
    resetMemoryRateLimitsForTests();
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 503 when Anthropic is not configured", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [] }),
      })
    );
    expect(response.status).toBe(503);
  });

  it("rejects invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: "{",
      })
    );
    expect(response.status).toBe(400);
  });

  it("rejects invalid message payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: "not-an-array" }),
      })
    );
    expect(response.status).toBe(400);
  });

  it("rejects oversized requests before parsing", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "content-length": "100001" },
        body: JSON.stringify({ messages: [] }),
      })
    );
    expect(response.status).toBe(413);
  });
});
