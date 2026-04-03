import { AccessToken, AgentDispatchClient, RoomServiceClient } from "livekit-server-sdk";

export async function POST() {
  const livekitUrl = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ error: "LiveKit environment variables not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const participantName = `visitor-${Date.now()}`;
  const roomName = `devgpt-voice-${participantName}`;

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
}
