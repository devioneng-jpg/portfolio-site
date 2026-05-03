import { AccessToken, AgentDispatchClient, RoomServiceClient } from "livekit-server-sdk";

// Rate limiter: 5 requests/hr per IP
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = rateLimit.get(ip);

  if (!window || now > window.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (window.count >= 5) {
    return false;
  }

  window.count++;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const livekitUrl = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ error: "Voice chat is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const participantName = `visitor-${Date.now()}`;
  const roomName = `devgpt-voice-${participantName}`;

  try {
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
    await roomService.createRoom({ name: roomName });

    const agentDispatch = new AgentDispatchClient(livekitUrl, apiKey, apiSecret);
    await agentDispatch.createDispatch(roomName, "Kai-256b");

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return new Response(
      JSON.stringify({
        token: jwt,
        url: livekitUrl,
        roomName,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[voice-token] Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create voice session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
