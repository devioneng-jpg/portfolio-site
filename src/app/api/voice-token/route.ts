import { AccessToken, AgentDispatchClient, RoomServiceClient } from "livekit-server-sdk";
import {
  checkRateLimit,
  getClientIdentifier,
} from "@/lib/rate-limit";
import { BOOKING_URL } from "@/lib/booking";
import {
  getMissingProductionSecurityConfig,
  hasValidSecuritySession,
  isAllowedOrigin,
  logRouteError,
} from "@/lib/request-security";

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return Response.json({ error: "Origin is not allowed" }, { status: 403 });
  }

  if (getMissingProductionSecurityConfig().length > 0) {
    return Response.json(
      { error: "Voice chat is temporarily unavailable" },
      { status: 503 }
    );
  }

  if (!hasValidSecuritySession(req)) {
    return Response.json(
      { error: "Verification is required" },
      { status: 403 }
    );
  }

  const limit = await checkRateLimit({
    scope: "voice",
    identifier: getClientIdentifier(req),
    limit: 6,
    windowSeconds: 3600,
    globalLimit: 60,
  });
  if (!limit.configured) {
    return Response.json(
      { error: "Voice chat is temporarily unavailable" },
      { status: 503 }
    );
  }
  if (!limit.success) {
    return Response.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  const livekitUrl = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const agentName = process.env.LIVEKIT_AGENT_NAME;

  if (!livekitUrl || !apiKey || !apiSecret || !agentName) {
    return Response.json(
      { error: "Voice chat is not configured" },
      { status: 503 }
    );
  }

  const sessionId = crypto.randomUUID();
  const participantName = `visitor-${sessionId}`;
  const roomName = `ai-twin-${sessionId}`;
  const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);

  try {
    await roomService.createRoom({
      name: roomName,
      emptyTimeout: 60,
      departureTimeout: 20,
      maxParticipants: 2,
    });

    const agentDispatch = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);
    await agentDispatch.createDispatch(roomName, agentName, {
      metadata: JSON.stringify({
        tools: {
          bookMeeting: {
            url: BOOKING_URL,
            label: "Choose a 15- or 30-minute meeting with Devion",
            instruction:
              "When the visitor asks to schedule time, offer this booking link.",
          },
        },
      }),
    });

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: "10m",
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return Response.json(
      {
        token: jwt,
        url: livekitUrl,
        roomName,
        bookingUrl: BOOKING_URL,
      },
      { status: 200 }
    );
  } catch (err) {
    logRouteError("voice-token", err);
    await roomService.deleteRoom(roomName).catch(() => undefined);
    return Response.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
