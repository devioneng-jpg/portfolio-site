import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetMemoryRateLimitsForTests } from "@/lib/rate-limit";

const livekitMocks = vi.hoisted(() => ({
  createRoom: vi.fn().mockResolvedValue(undefined),
  deleteRoom: vi.fn().mockResolvedValue(undefined),
  createDispatch: vi.fn().mockResolvedValue(undefined),
  addGrant: vi.fn(),
  toJwt: vi.fn().mockResolvedValue("test-jwt"),
}));

vi.mock("livekit-server-sdk", () => ({
  RoomServiceClient: class {
    createRoom = livekitMocks.createRoom;
    deleteRoom = livekitMocks.deleteRoom;
  },
  AgentDispatchClient: class {
    createDispatch = livekitMocks.createDispatch;
  },
  AccessToken: class {
    addGrant = livekitMocks.addGrant;
    toJwt = livekitMocks.toJwt;
  },
}));

import { POST } from "../route";

const voiceRequest = () =>
  new Request("http://localhost/api/voice-token", { method: "POST" });

describe("POST /api/voice-token", () => {
  beforeEach(() => {
    resetMemoryRateLimitsForTests();
    livekitMocks.createRoom.mockClear();
    livekitMocks.deleteRoom.mockClear();
    livekitMocks.createDispatch.mockClear();
    livekitMocks.addGrant.mockClear();
    livekitMocks.toJwt.mockClear();
    process.env.LIVEKIT_URL = "wss://example.livekit.cloud";
    process.env.LIVEKIT_API_KEY = "test-key";
    process.env.LIVEKIT_API_SECRET = "test-secret";
    process.env.LIVEKIT_AGENT_NAME = "test-agent";
  });

  afterEach(() => {
    delete process.env.LIVEKIT_URL;
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;
    delete process.env.LIVEKIT_AGENT_NAME;
  });

  it("returns 503 when voice is not configured", async () => {
    delete process.env.LIVEKIT_AGENT_NAME;
    const response = await POST(voiceRequest());
    expect(response.status).toBe(503);
  });

  it("creates a short-lived room and dispatches the configured agent", async () => {
    const response = await POST(voiceRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.token).toBe("test-jwt");
    expect(body.url).toBe("wss://example.livekit.cloud");
    expect(body.bookingUrl).toBe("https://cal.com/dtharpe");
    expect(livekitMocks.createRoom).toHaveBeenCalledWith(
      expect.objectContaining({
        emptyTimeout: 60,
        maxParticipants: 2,
      })
    );
    expect(livekitMocks.createDispatch).toHaveBeenCalledWith(
      expect.stringMatching(/^ai-twin-/),
      "test-agent",
      expect.objectContaining({
        metadata: expect.stringContaining("https://cal.com/dtharpe"),
      })
    );
  });

  it("limits repeated voice session creation", async () => {
    for (let index = 0; index < 6; index += 1) {
      expect((await POST(voiceRequest())).status).toBe(200);
    }
    expect((await POST(voiceRequest())).status).toBe(429);
  });

  it("allows same-host origins in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("APP_URL", "http://localhost:3000");

    const response = await POST(
      new Request("https://portfolio-site-tli2.vercel.app/api/voice-token", {
        method: "POST",
        headers: { Origin: "https://portfolio-site-tli2.vercel.app" },
      })
    );

    expect(response.status).not.toBe(403);
    vi.unstubAllEnvs();
  });
});
